import React from 'react'
import ReactDOM from 'react-dom'
import { NodeActionPopover, NodePopover, BreakdownProgress, StencilConfigs, Utils } from 'components'
import { Popover, Position } from '@blueprintjs/core'
import WorkflowLayout from './WorkflowLayout'
import NodeElementStatusSummary from './NodeElementStatusSummary'
import ExecSummaryBox from './ExecSummaryBox'

import css from './DeploymentDetailsView.css'

export default class DeploymentDetailsView extends React.Component {
  static propTypes = {
    data: React.PropTypes.object.isRequired, // data from /executions/id
    fullPage: React.PropTypes.bool,
    onNodeClick: React.PropTypes.func,
    onContainerClick: React.PropTypes.func // for List View only (to go to Details page)
  }

  state = {
    nodes: [],
    selectedNode: null,
    fitHeight: 0,
    showPopover: false,
    showActionPopover: false,
    popoverParams: { left: 0, top: 0 },
    actionPopoverParams: { left: 0, top: 0 },
    popoverTarget: null,
    popoverData: {},
    showNodeOverLay: false
  }
  isFirstTime = true
  refreshingGraph = false
  lastClickedNode = null
  lastRunningNode = null
  collapsedNodes = {} // object of Node ids as keys
  showPopoverTimer = null // setTimeout handler
  showActionPopoverTimer = null // setTimeout handler
  expandedIds = {} // expandedIds[ node.id ]

  updateNodeExpanded = (node, flag) => {
    if (this.expandedIds[node.id]) {
      if (flag !== true) {
        node.expanded = this.expandedIds[node.id]
      }
    } else {
      if (flag === true) {
        this.expandedIds[node.id] = node.expanded
      }
    }
  }

  // similar to "transformNode"
  updateNodeExpandedStatus (node, flag) {
    this.updateNodeExpanded(node, flag)
    if (node.group) {
      this.updateNodeExpanded(node.group, flag)
      if (node.group.elements) {
        for (const element of node.group.elements) {
          this.updateNodeExpandedStatus(element)
          this.updateNodeExpanded(element, flag)
        }
      }
    }
    if (node.next) {
      this.updateNodeExpandedStatus(node.next, flag)
      this.updateNodeExpanded(node.next, flag)
    }
  }

  // iterate through all nodes from newProps.data.executionNode
  // to collapse/expand children nodes, etc.
  iterateNode (node) {
    // Workflow is RUNNING, expand RUNNING PHASE nodes, collapse other nodes.
    if (
      (this.props.data.status === 'RUNNING' || this.props.data.status === 'WAITING') &&
      Utils.isSubWorkflow(node.type)
    ) {
      // if (node.status !== 'RUNNING') {
      //   this.collapsedNodes[ node.id ] = true
      //   delete this.expandedIds[ node.id ]
      // }
      // else {
      //   delete this.collapsedNodes[ node.id ]
      //   this.expandedIds[ node.id ] = true
      // }
      if (!this.lastClickedNode) {
        // auto mode
        if (Utils.isInProgressNode(node)) {
          delete this.collapsedNodes[node.id]
          this.expandedIds[node.id] = true
        } else {
          this.collapsedNodes[node.id] = true
          delete this.expandedIds[node.id]
        }
      }
    }
    if (Utils.isInProgressNode(node)) {
      this.lastRunningNode = node
    }

    if (node.group) {
      // console.log('- Node Group: ' + node.group.name)
      this.iterateNode(node.group)
      if (node.group.elements) {
        for (const element of node.group.elements) {
          this.iterateNode(element)
        }
        if (node.group.elements && node.group.elements.length === 1 && node.group.elements[0].type === 'REPEAT') {
          // console.log('- Node: ' + node.name)
          node.group = node.group.elements[0].group
        }
      }
    }
    if (node.next) {
      this.iterateNode(node.next)
    }
  }

  componentWillReceiveProps (newProps) {
    // console.log('componentWillReceiveProps...')
    if (newProps.data && newProps.data.executionNode) {
      if (this.refreshingGraph) {
        return
      }
      this.refreshingGraph = true
      this.lastRunningNode = null

      this.iterateNode(newProps.data.executionNode)
      if (this.lastRunningNode && !this.lastClickedNode && this.props.onNodeClick) {
        // auto mode & auto set the Last Running Node
        this.props.onNodeClick(this.lastRunningNode)
      }

      // const selectedNode = this.lastClickedNode
      // if (!selectedNode) {    // user has not clicked on a node => auto select node
      //   for (const n of this.state.nodes) {
      //     if (n.type === 'PHASE') {
      //       this.collapsedNodes[ n.id ] = true
      //       delete this.expandedIds[ n.id ]
      //     }
      //   }
      // }

      this.updateNodeExpandedStatus(newProps.data.executionNode)
      this.expandAll(newProps.data.executionNode)
      this.refreshGraph(newProps.data, null, true)
    }
  }

  componentDidMount () {
    const fitHeight = window.innerHeight - 117
    this.setState({ fitHeight })
  }

  closePopover = () => {
    if (this.showPopoverTimer) {
      clearTimeout(this.showPopoverTimer)
    }
    this.setState({ showPopover: false })
  }

  // closeActionPopover = () => {
  //   if (this.showActionPopoverTimer) {
  //     clearTimeout(this.showActionPopoverTimer)
  //   }
  //   this.setState({ showActionPopover: false })
  // }

  expandAll (nodeOrGroup) {
    if (this.collapsedNodes[nodeOrGroup.id] === true) {
      nodeOrGroup.expanded = false
      if (nodeOrGroup.next) {
        this.expandAll(nodeOrGroup.next)
      }
      return
    }

    // if (this.isFirstTime && nodeOrGroup.type === 'ELEMENT' && nodeOrGroup.next) {
    //   nodeOrGroup.expanded = true
    //   nodeOrGroup.next.expanded = false
    //   this.collapsedNodes[ nodeOrGroup.next.id ] = true
    //   return
    // }

    nodeOrGroup.expanded = true
    const group = nodeOrGroup.group
    if (group) {
      this.expandAll(group)
    }
    if (nodeOrGroup.next) {
      this.expandAll(nodeOrGroup.next)
    }

    if (this.isFirstTime && Utils.isSubWorkflow(nodeOrGroup.type)) {
      // initially, collapse PHASE_STEP nodes for a cleaner UI:
      nodeOrGroup.expanded = false
      this.collapsedNodes[nodeOrGroup.id] = true
    }

    if (nodeOrGroup.elements) {
      const elements = nodeOrGroup.elements

      // get the Last Un-Queued Element & remember it so we don't collapse it (to keep it expanded)
      let nodeToKeepExpanded = null
      for (let i = elements.length - 1; i >= 0; i--) {
        if (elements[i].status !== 'QUEUED') {
          nodeToKeepExpanded = elements[i]
          break
        }
      }

      for (let i = 0; i < elements.length; i++) {
        const childNode = elements[i]
        this.expandAll(childNode)

        if (nodeToKeepExpanded && childNode.id === nodeToKeepExpanded.id) {
          continue // don't collapse this one
        }

        // otherwise, collapse other REPEAT/FORK nodes
        if (
          this.isFirstTime &&
          childNode.next &&
          (childNode.next.type === 'REPEAT' ||
            childNode.next.type === 'FORK' ||
            Utils.isSubWorkflow(childNode.next.type))
        ) {
          childNode.expanded = true
          childNode.next.expanded = false
          this.collapsedNodes[childNode.next.id] = true
        }

        // if (!elements[i + 1] || elements[i + 1].status === 'QUEUED') {
        //   const lastElement = elements[i + 1]
        //   this.expandAll(lastElement)
        //   delete this.collapsedNodes[ lastElement.id ]
        //   break
        // }
      }
    }
  }

  refreshGraph (execData, callback, renderOnly) {
    const layout = new WorkflowLayout()
    const nodes = layout.paintGraph(execData)

    let selectedNode = this.lastClickedNode
    if (!selectedNode) {
      // user has not clicked on a node => auto select node
      let lastNode = nodes[nodes.length - 1] || {}
      let failedFound = false
      let runningFound = false
      // auto set selectedNode to the last RUNNING (more priority) or FAILED command node
      for (let i = nodes.length - 1; i >= 0; i--) {
        if (!failedFound && (nodes[i].status === 'FAILED' || nodes[i].status === 'WAITING')) {
          failedFound = true
          lastNode = nodes[i] // set to the last Failed Node, but keep looping.
        }
        if (Utils.isRunning(nodes[i].status)) {
          // set to the Running Node & exit the loop
          runningFound = true
          lastNode = nodes[i]
          break
        }
      }
      // if no running/failed node => get the last Success Command node
      if (!runningFound && !failedFound) {
        for (let i = nodes.length - 1; i >= 0; i--) {
          if (this.isCommandType(nodes[i].type)) {
            lastNode = nodes[i]
            break
          }
        }
      }

      // if (renderOnly !== true && this.isCommandType(lastNode.type)) {
      if (renderOnly !== true) {
        selectedNode = lastNode
        // this will trigger componentWillReceiveProps again but we're safe with this.refreshingGraph flag.
        if (this.props.onNodeClick) {
          this.props.onNodeClick(selectedNode) // tell parent (so it can update Activity Logs, etc.)
        }
      }
    }
    this.setState({ nodes, selectedNode }, () => {
      if (callback) {
        callback()
      }
    })

    setTimeout(() => {
      this.refreshingGraph = false

      if (this.isFirstTime) {
        this.isFirstTime = false
        this.scrollToBottom()
      }
    }, 100) // skip multiple refreshGraph() calls
  }

  scrollToBottom = () => {
    const containerEl = ReactDOM.findDOMNode(this.refs.container)
    if (containerEl) {
      containerEl.scrollLeft = 999999 // scroll all the way to the bottom, right side
      containerEl.scrollTop = 999999
    }
  }

  isCommandType (nodeType) {
    return (
      nodeType !== 'REPEAT' &&
      nodeType !== 'FORK' &&
      nodeType !== 'GROUP' &&
      nodeType !== 'ELEMENT' &&
      !Utils.isSubWorkflow(nodeType)
    )
  }

  onNodeClick = (node, ev) => {
    // this.expandedIds = {}
    this.lastClickedNode = node
    this.setState({ selectedNode: this.lastClickedNode })

    if (this.isCommandType(node.type)) {
      // this.setState({ lastClickedNode: node })
      this.lastClickedNode = node
      this.props.onNodeClick ? this.props.onNodeClick(node) : ''
    } else {
      this.props.onNodeClick ? this.props.onNodeClick(node) : ''

      if (Utils.isSubWorkflow(node.type)) {
        for (const n of this.state.nodes) {
          if (Utils.isFirstLevelNode(node)) {
            this.collapsedNodes[n.id] = true
            delete this.expandedIds[n.id]
          }
          // else if (node.type === 'PHASE_STEP' && n.type === 'PHASE_STEP') {
          //   this.collapsedNodes[ n.id ] = true
          //   delete this.expandedIds[ n.id ]
          // }
        }
      }

      // Toggle node (Collapse or Expand)
      node.expanded = !node.expanded
      if (node.expanded) {
        delete this.collapsedNodes[node.id]
        this.expandedIds[node.id] = true
      } else {
        this.collapsedNodes[node.id] = true
        delete this.expandedIds[node.id]
      }

      this.expandAll(this.props.data.executionNode)
      this.refreshGraph(this.props.data, () => {
        // this.updateNodeExpandedStatus(this.props.data.executionNode, true)
      })
    }

    // show Action Menu
    // if (node.status === 'WAITING') {
    //   const nodeEl = Utils.findParentByChild(ev.nativeEvent.target, '.__node')
    //   const rect = nodeEl.getBoundingClientRect()
    //   const actionPopoverParams = {
    //     left: parseInt(rect.left) - 347 + 'px',
    //     top: parseInt(rect.top) - 180 + 'px'
    //   }
    //   this.showActionPopoverTimer = setTimeout(() => {
    //     this.setState({ popoverTarget: nodeEl,
    //       showActionPopover: true,
    //       popoverData: node,
    //       actionPopoverParams
    //     })
    //   }, 50)
    // }
    if (node.status === 'WAITING') {
      this.setState({ showNodeOverLay: true })
    }
  }

  onNodeActionClick = (action, node) => {
    if (action) {
      this.setState({ showNodeOverLay: false })
    }
    this.props.onNodeActionClick(action, node)
  }

  onMouseOverNode (ev) {
    const nodeEl = Utils.findParentByChild(ev.nativeEvent.target, '.__node')
    const nodeData = this.state.nodes.find(n => n.id === nodeEl.dataset.id)

    let popoverParams
    // let actionPopoverParams
    const rect = nodeEl.getBoundingClientRect()
    // const isNavCollapsed = document.body.classList.contains('collapse-sidebar')

    if (this.props.fullPage === true) {
      popoverParams = {
        left: parseInt(rect.left) - 110 + 'px',
        top: parseInt(rect.top) - 50 + 'px'
      }
      // actionPopoverParams = {
      //   left: parseInt(rect.left) - 10 + 'px',
      //   top: parseInt(rect.top) - 60 + 'px'
      // }
    } else {
      // popoverParams = {
      //   left: parseInt(rect.left - containerRect.left) - 100 + 'px',
      //   top: parseInt(rect.top - containerRect.top) + 60 + 'px'
      // }
    }

    if (this.showPopoverTimer) {
      clearTimeout(this.showPopoverTimer)
    }
    if (this.showActionPopoverTimer) {
      clearTimeout(this.showActionPopoverTimer)
    }
    this.showPopoverTimer = setTimeout(() => {
      this.setState({
        popoverTarget: nodeEl,
        showPopover: true,
        popoverData: nodeData,
        popoverParams
      })
    }, nodeData.type === 'PHASE' ? 1000 : 2000)

    // this.showActionPopoverTimer = setTimeout(() => {
    //   this.setState({ popoverTarget: nodeEl,
    //     showActionPopover: true,
    //     popoverData: nodeData,
    //     actionPopoverParams
    //   })
    // }, 50)
  }

  onMouseOutNode = () => {
    this.closePopover()
    // this.closeActionPopover()
  }

  resumeNode (ev) {
    const dataset = ev.target.dataset
    if (dataset.action === 'RESUME' && dataset.id) {
      this.props.onResumeNode(dataset.id)
    }
  }

  renderArrow (node) {
    let arrow = null
    const isFirstRowNode = node.y <= 60
    if (
      ((node.type === 'ELEMENT' || Utils.isSubWorkflow(node.type)) && node.next) ||
      (this.isCommandType(node.type) && node.next)
    ) {
      let arrowWidth = node.next.x - node.x - 50
      if (isFirstRowNode) {
        arrowWidth = node.next.x - node.x - 80
      }
      let arrowCss = '__arrow'
      const customStyleObj = { width: arrowWidth + 'px' }
      if (node.type === 'ELEMENT') {
        customStyleObj.width = arrowWidth + 30 + 'px'
        arrowCss += ' __elementArrow'
      }
      arrow = <div className={arrowCss} style={customStyleObj} />
    }
    return arrow
  }

  renderNode (node) {
    const nodeIconClass = StencilConfigs.getNodeIconClass(node.type, node.name)
    const isFirstRowNode = node.y <= 60
    let nodeClass = '__node ' + (isFirstRowNode ? '__firstLevelNode ' : ' ')

    const nodeStyles = {
      left: node.x,
      top: isFirstRowNode ? node.y : node.y + 50
    }
    if (node.type === 'GROUP') {
      const isFirstLevelGroup = nodeStyles.top <= 150
      if (isFirstLevelGroup) {
        nodeClass += '__firstLevelGroup '
        nodeStyles.left += 33
        nodeStyles.top -= 20
      }
      nodeStyles.height = node.height
    }
    if (node.name && node.name.indexOf('Rollback') >= 0) {
      nodeClass += '__rollbackNode '
    }

    const arrow = this.renderArrow(node)
    const elementStatusClass = node.status ? '__elementStatus-' + node.status.toLowerCase() : ''

    let expandBtn = null
    let nodeSummaryBox = null
    if (
      (node.status && (node.type === 'REPEAT' || node.type === 'FORK')) ||
      (Utils.isSubWorkflow(node.type) && node.group)
    ) {
      if (node.expanded === true) {
        expandBtn = (
          <span className="__expandBtn">
            <i className="icons8-minus-math __expanded" />
          </span>
        )
      } else {
        expandBtn = (
          <span className="__expandBtn">
            <i className="icons8-plus-math __collapsed" />
          </span>
        )

        if (node.type === 'REPEAT' || node.type === 'FORK') {
          // render Collapsed Node's Summary
          nodeSummaryBox = (
            <div className="__nodeSummary">
              <NodeElementStatusSummary nodeData={node} />
            </div>
          )
          // summaryStyles.visibility = 'hidden'
        }
      }
    }

    const nodeBorderClass = node.status ? '__nodeBorder_' + node.status.toLowerCase() : ''
    // for multi-step Command, if initialization failed (ssh, etc.) (status = FAILED) & progress sum = 0:
    // if (node.status === 'FAILED' && node.type !== 'ELEMENT' && node.type !== 'REPEAT' && node.type !== 'FORK') {
    //   nodeClass += nodeBorderClass
    //   progressBar = null
    // }
    if (node.type !== 'ELEMENT') {
      nodeClass += nodeBorderClass
    }

    if (Utils.isRunning(node.status) && node.type !== 'ELEMENT' && node.type !== 'REPEAT' && node.type !== 'FORK') {
      nodeClass += ' __nodeRunningFx'
    }

    if (this.state.selectedNode && node.id === this.state.selectedNode.id) {
      nodeClass += ' selectedNode'
    } else if (this.lastRunningNode && node.id === this.lastRunningNode.id) {
      nodeClass += ' selectedNode'
    }

    let nodeName = node.name
    if (node.type === 'ELEMENT' && node.name.indexOf('Fork-') === 0) {
      nodeName = ''
    }

    let showFolderLine =
      node.type !== 'PHASE' && node.type !== 'PHASE_STEP' && node.type !== 'GROUP' && node.type !== 'COMMAND'
    showFolderLine = showFolderLine === true && node.group === null && node.next === null // for leaf nodes only
    let folderLine = null
    if (node.type === 'ELEMENT') {
      folderLine = <div className="__folderLine __folderLineElement" />
    } else {
      folderLine = <div className="__folderLine" style={{ display: showFolderLine ? 'block' : 'none' }} />
    }

    const nodeEl = (
      <div
        key={node.id + node.name}
        data-id={node.id}
        data-type={node.type}
        data-status={node.status}
        data-expanded={node.expanded}
        className={nodeClass}
        style={nodeStyles}
        onClick={ev => this.onNodeClick(node, ev)}
        onMouseOver={this.onMouseOverNode.bind(this)}
        onMouseOut={this.onMouseOutNode}
      >
        <div
          className="__pulsatingBorder"
          style={{
            display:
              Utils.isRunning(node.status) && node.type !== 'ELEMENT' && node.type !== 'REPEAT' && node.type !== 'FORK'
                ? 'table-cell'
                : 'none'
          }}
        />
        <div className="__nodeIcon">
          <i className={nodeIconClass} />
        </div>
        {/* progressBar */}
        <div className="__nodeLabel">
          <span>{nodeName}</span>
        </div>
        {folderLine}
        <div
          className={`__elementStatus ${elementStatusClass}`}
          style={{ display: node.type === 'ELEMENT' ? 'inline-block' : 'none' }}
        />
        {arrow}
        {expandBtn}
        {/* <ul className="__actions"
            style={{ display: (node.status === 'PAUSED' && node.type !== 'ELEMENT' ? 'inline-block' : 'none') }}>
          <li data-action="RESUME">
            <i className="icons8-play-filled" data-action="RESUME" data-id={node.id}
               onClick={this.resumeNode.bind(this)}
            />
          </li>
        </ul> */}
        {nodeSummaryBox}
      </div>
    )

    if (node.status === 'WAITING' && (this.lastClickedNode && node.id === this.lastClickedNode.id)) {
      return (
        <Popover
          position={Position.TOP_LEFT}
          content={<NodeActionPopover data={node} onNodeActionClick={this.onNodeActionClick} />}
          target={nodeEl}
          isOpen={this.state.showNodeOverLay}
          onClose={() => {
            this.setState({ showNodeOverLay: false })
          }}
        />
      )
    }
    return nodeEl
  }

  onContainerClick (ev) {
    if (this.props.onContainerClick) {
      this.props.onContainerClick()
    }

    if (ev.nativeEvent.target.className.indexOf('__container') >= 0) {
      // reset lastClickedNode (resume Auto Select mode)
      this.lastClickedNode = null
      this.refreshGraph(this.props.data, () => {
        this.scrollToBottom()
      })
      // this.closeActionPopover()
    }
  }

  renderMainProgress () {
    const workflowStatus = this.props.data.status
    if (workflowStatus !== 'RUNNING' && workflowStatus !== 'PAUSED' && workflowStatus !== 'WAITING') {
      return null
    }
    const progress = { donePct: 0, failedPct: 0, runningPct: 0 }
    switch (workflowStatus) {
      case 'SUCCESS':
        progress.donePct = 100
        break
      case 'FAILED':
        progress.failedPct = 100
        break
      case 'RUNNING':
      case 'PAUSED':
      case 'WAITING':
        progress.donePct = Math.round(this.props.data.breakdown.success / this.props.data.total * 100)
        progress.failedPct = Math.round(this.props.data.breakdown.failed / this.props.data.total * 100)
        progress.runningPct = 0
        break
    }
    // const sum = Math.round(progress.donePct + progress.failedPct + progress.runningPct)
    return <BreakdownProgress progress={progress} status={workflowStatus} className="__mainProgress" />
  }

  hasDetailsData = () => {
    const { data } = this.props
    return data && data.orchestrationType !== Utils.workflowTypes.BUILD ? true : false
  }

  render () {
    let mainCss = css.main
    let listViewClass = ''

    let execSummaryBox = null
    const hasDetails = this.hasDetailsData()
    if (this.props.fullPage === true) {
      execSummaryBox = <ExecSummaryBox data={this.props.data} hasDetails={hasDetails} />
    } else {
      listViewClass = '__containerListView'
    }

    if (this.props.fullPage !== true) {
      mainCss += ' ' + css.listView
    }

    const header = this.props.header || null
    return (
      <section ref="main" className={mainCss} fill>
        {header &&
          execSummaryBox && (
            <split-view vertical>
              {header}
              {execSummaryBox}
            </split-view>
          )}
        {this.renderMainProgress()}
        <div ref="container" className={`__container ${listViewClass}`} onClick={this.onContainerClick.bind(this)}>
          {this.state.nodes.map(node => this.renderNode(node))}
        </div>
        <NodePopover
          data={this.state.popoverData}
          show={this.state.showPopover}
          target={() => ReactDOM.findDOMNode(this.state.popoverTarget)}
          container={this}
          onClose={this.closePopover}
          params={this.state.popoverParams}
        />

        {/* <NodeActionPopover data={this.state.popoverData}
                    show={this.state.showActionPopover}
                    target={() => ReactDOM.findDOMNode(this.state.popoverTarget)}
                    container={this}
                    onNodeActionClick={this.onNodeActionClick}
                    onClose={this.closeActionPopover}
                    params={this.state.actionPopoverParams}
        /> */}
      </section>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/WorkflowView/DeploymentDetailsView.js