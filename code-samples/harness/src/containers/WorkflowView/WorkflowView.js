import React from 'react'
import ReactDOM from 'react-dom'
import { BreakdownProgress, NodePopover, StencilConfigs, Utils } from 'components'
import NodeDetailsModal from './NodeDetailsModal'
// import ActivityModal from '../ActivityPage/ActivityModal'
import ExecSummaryBox from './ExecSummaryBox'
import NodeElementStatusSummary from './NodeElementStatusSummary'

import css from './WorkflowView.css'

const customLink = {
  connector: 'Straight', // 'Straight', 'Flowchart', 'StateMachine'
  // straight (Flowchart style) connectors:
  // connector: [ 'Flowchart', { stub: [40, 60], gap: 10, cornerRadius: 5, alwaysRespectStubs: true } ],
  anchor: 'Continuous', // 'AutoDefault'
  // Blank, Dot, Rectangle, Image, [ 'Dot', { radius: 1 } ]
  endpoint: ['Image', { src: '/img/workflow/linkTypes/success.png', cssClass: 'iconEndpoint' }],
  endpointStyle: { fillStyle: '#c8cfd0', outlineColor: '#c8cfd0' },
  paintStyle: { strokeStyle: '#c8cfd0', lineWidth: 2 },
  hoverPaintStyle: { strokeStyle: '#76858d', lineWidth: 2 },
  overlays: [
    ['PlainArrow', { location: 1, width: 15, length: 12 }]
    // ,[ 'Label', { label: 'FOO', id: 'label', cssClass: 'aLabel' }]
  ]
}

let scrollLeft = 0
let scrollTop = 0

class WorkflowView extends React.Component {
  // TODO: propTypes
  state = {
    data: {},
    modalData: {},
    showModal: false,
    showPopover: false,
    popoverParams: { left: 0, top: 0 },
    popoverTarget: null,
    popoverData: {},
    showActivityModal: false,
    modalActivity: {},
    graphData: {
      nodes: [],
      links: []
    }
  }
  jsp = null // jsplumb instance
  jsplumbSetupDone = false
  firstTimeScroll = false

  appIdFromUrl = Utils.appIdFromUrl()
  envIdFromUrl = Utils.envIdFromUrl()

  componentWillMount () {
    let graphData = Utils.getJsonValue(this, 'props.data.graph')
    if (graphData) {
      this.setNodesToState(graphData.nodes, graphData.links)
    } else {
      const originNode = {
        id: Utils.generateNodeId(),
        name: 'ORIGIN',
        x: 10,
        y: 10,
        type: 'ORIGIN'
      }
      const nodes = [originNode]
      graphData = {
        nodes: nodes,
        links: []
      }
      this.setNodesToState(nodes, [])
    }
    if (this.props.jsplumbLoaded) {
      this.invokeSetupWorkflow()
    }
  }

  componentDidUpdate () {
    if (this.props.autoUpdate === true && !this.firstTimeScroll) {
      this.scrollToBottom()
      setTimeout(() => {
        this.firstTimeScroll = true
      }, 500)
    }
  }

  scrollToBottom = () => {
    const containerEl = ReactDOM.findDOMNode(this.refs.jsplumbContainer)
    containerEl.scrollLeft = 999999 // scroll all the way to the bottom, right side
    containerEl.scrollTop = 999999
  }

  componentWillReceiveProps (newProps) {
    if (newProps.data.graph) {
      this.setNodesToState(newProps.data.graph.nodes, newProps.data.graph.links)
    }
    if (newProps.jsplumbLoaded) {
      this.invokeSetupWorkflow()
    }
  }

  setNodesToState = (nodes, links) => {
    // sort Nodes by "x"
    const isAllZeroes = true
    // const sortedNodes = nodes.sort((a, b) => {
    //   if (a.x) {
    //     isAllZeroes = false
    //   }
    //   return a.x > b.x ? 1 : b.x > a.x ? -1 : 0
    // })
    const sortedNodes = Utils.reorderNodesByLinks({ nodes, links })

    if (isAllZeroes) {
      // auto generate "x"
      let cnt = 0
      for (let i = 0; i < sortedNodes.length; i++) {
        if (sortedNodes[i].name.toUpperCase().indexOf('ROLLBACK') >= 0) {
          sortedNodes[i].x = -1000 // hide it
          continue
        }
        sortedNodes[i].x = 150 * cnt
        cnt++
      }
    }
    this.setState({
      graphData: {
        nodes: sortedNodes,
        links
      }
    })
  }

  invokeSetupWorkflow = () => {
    // wait for state & node rendering
    setTimeout(() => {
      if (this.props.runningCardView === true) {
        // list view
        this.debouncedSetupFn()
      } else {
        // details (play back) view
        this.setupWorkflow(this.state.graphData)
      }
    }, 100)
  }

  debouncedSetupFn = Utils.debounce(
    () => {
      this.setupWorkflow(this.state.graphData)
    },
    3000,
    true
  )

  setupWorkflow = graphData => {
    if (!this.jsplumbSetupDone) {
      // ensure this runs once
      this.jsp = jsPlumb.getInstance()
      this.jsp.importDefaults({
        ConnectionsDetachable: false,
        ReattachConnections: false
      })
    }
    this.jsplumbSetupDone = true

    if (this.jsp) {
      jsPlumb.reset()
      this.jsp.reset()
    }
    const containerEl = ReactDOM.findDOMNode(this.refs.jsplumbContainer)
    if (!containerEl) {
      return
    }

    const nodeEls = containerEl.querySelectorAll('.jsplumb-node')

    Array.prototype.forEach.call(nodeEls, nodeEl => {
      // cross-browser loop (for Safari)
      this.setupNode(nodeEl)
    })

    // --- add Links & Endpoints
    jsPlumb.setSuspendDrawing(true)
    for (const link of graphData.links) {
      const linkTypeStr = (link.type || 'blank').toLowerCase()
      const nodeData = graphData.nodes.find(n => n.id === link.from)
      if (nodeData.type === 'ORIGIN') {
        continue
      }
      if (this.props.status === 'true' && nodeData.type === 'REPEAT') {
        // skip the link from REPEAT node to GROUP node
        const toNode = graphData.nodes.find(n => n.id === link.to)
        if (toNode.type === 'GROUP') {
          continue
        }
      }
      customLink.endpoint = [
        'Image',
        {
          src: `/img/workflow/linkTypes/${linkTypeStr}.png`,
          cssClass: `iconEndpoint iconEndpoint-${linkTypeStr}`,
          type: link.type
        }
      ]
      /*
        When cloned/Templatized parent and cloned workflow
        has the same graph linkids and nodeids .todifferentiate
        suffixing with workflowid
       */
      const fromLink = this.props.workflowId ? `${this.props.workflowId}_${link.from}` : `${link.from}`
      const toLink = this.props.workflowId ? `${this.props.workflowId}_${link.to}` : `${link.to}`
      const c = this.jsp.connect(
        {
          source: fromLink,
          target: toLink
        },
        customLink
      )
      if (this.props.status === 'true') {
        const sourceEndpointEl = c.endpoints[0].endpoint.canvas
        sourceEndpointEl.style.display = 'none'
      }
      const targetEndpointEl = c.endpoints[1].endpoint.canvas
      targetEndpointEl.style.display = 'none'
    }
    this.jsp.repaintEverything()
    jsPlumb.setSuspendDrawing(false, true)
  }

  setupNode = nodeEl => {
    const that = this
    // this.jsp.draggable(nodeEl, { grid: [10, 10] })
    nodeEl.className = Utils.removeClassName(nodeEl.className, 'node-selected')
    if (this.props.selectedNode && nodeEl.id === this.props.selectedNode.id) {
      nodeEl.className += ' node-selected'

      // TODO: scroll to the selected node
      if (this.props.autoUpdate === true) {
        this.scrollToBottom()
      } else {
        if (scrollTop) {
          const containerEl = ReactDOM.findDOMNode(this.refs.jsplumbContainer)
          containerEl.scrollLeft = scrollLeft
          containerEl.scrollTop = scrollTop
          scrollTop = 0
          scrollLeft = 0
        }
      }
    }

    this.jsp.makeTarget(nodeEl, {
      dropOptions: { hoverClass: 'dragHover' },
      anchor: 'Continuous',
      allowLoopback: false
    })

    nodeEl.onmouseover = function nodeonmouseover (ev) {
      if (that.props.status) {
        const el = Utils.findParentByChild(ev.target, '.jsplumb-node')
        if (el) {
          const nodeData = that.state.graphData.nodes.find(n => n.id === nodeEl.dataset.id)
          let popoverParams
          const rect = el.getBoundingClientRect()
          const containerRect = ReactDOM.findDOMNode(that.refs.jsplumbContainer).getBoundingClientRect()
          if (that.props.fullPage === 'true') {
            popoverParams = {
              left: parseInt(rect.left - containerRect.left) - 165 + 'px',
              top: parseInt(rect.top - containerRect.top) + 60 + 'px'
            }
          } else {
            popoverParams = {
              left: parseInt(rect.left - containerRect.left) - 165 + 'px',
              top: parseInt(rect.top - containerRect.top) + 60 + 'px'
            }
          }

          that.setState({
            popoverTarget: this,
            showPopover: true,
            popoverData: nodeData,
            popoverParams
          })
        }
      }
    }

    nodeEl.onmouseout = function nodeonmouseout (ev) {
      if (that.props.status) {
        that.closePopover()
      }
    }

    nodeEl.onclick = function nodeOnClick (ev) {
      const el = this
      const containerEl = ReactDOM.findDOMNode(that.refs.jsplumbContainer)
      const allNodeEls = containerEl.querySelectorAll('.jsplumb-node')
      const nodeData = that.state.graphData.nodes.find(n => n.id === nodeEl.dataset.id)
      if (!nodeData || !nodeData.type) {
        return
      }

      if (nodeData.type !== 'ELEMENT' && nodeData.type !== 'REPEAT' && nodeData.type !== 'FORK') {
        for (const nodeEl of allNodeEls) {
          nodeEl.className = Utils.removeClassName(nodeEl.className, 'node-selected')
        }
        if (el.className.indexOf('node-selected') >= 0) {
          el.className = Utils.removeClassName(el.className, 'node-selected')
        } else {
          el.className += ' node-selected'
        }
        that.props.onNodeClick(nodeData)
      }

      if (nodeData.type === 'REPEAT' || nodeData.type === 'FORK') {
        if (ev.target.className.indexOf('__expanded') >= 0 || ev.target.className.indexOf('__collapsed') >= 0) {
          that.expandNode.bind(that, this.dataset.id, this.dataset.expanded)()
        }
      }
      // 'this' is nodeEl
      // if (that.props.runningCardView === true) {
      //   return
      // }
      // if (ev.target.dataset.action) {
      // } else if (that.props.status) {
      //   const nodeData = that.state.graphData.nodes.find(n => n.id === nodeEl.dataset.id)
      //   if (nodeData.type === 'COMMAND') {
      //     const activityUuid = Utils.getJsonValue(nodeData, 'executionDetails.activityId.value') || ''
      //     if (activityUuid.length > 0) {
      //       const modalActivity = { uuid: activityUuid }
      //       that.setState({ showActivityModal: true, modalActivity })
      //     }
      //   } else {
      //     that.setState({ modalData: nodeData, showModal: true })
      //   }
      //
      //   if (ev.target.className.indexOf('__expanded') >= 0 || ev.target.className.indexOf('__collapsed') >= 0) {
      //     if (that.props.onGroupClick) {
      //       that.props.onGroupClick(this)
      //     }
      //   }
      // }
    }
  }

  resumeNode = ev => {
    const dataset = ev.target.dataset
    if (dataset.action === 'RESUME' && dataset.id) {
      this.props.onResumeNode(dataset.id)
    }
  }

  // viewLogs = (ev) => {
  //   const dataset = ev.target.dataset
  //   if (dataset.action === 'LOGS' && dataset.id) {
  //     const nodeData = this.state.graphData.nodes.find(n => n.id === dataset.id)
  //     this.props.onViewLogs(nodeData)
  //   }
  // }

  getMargins = () => {
    const nodes = Utils.getJsonValue(this, 'state.graphData.nodes')
    const margins = { x: Number.MAX_VALUE, y: Number.MAX_VALUE }
    if (nodes) {
      for (const node of nodes) {
        if (node && node.type !== 'ORIGIN' && node.x >= 0 && node.y >= 0) {
          margins.x = node.x < margins.x ? node.x : margins.x
          margins.y = node.y < margins.y ? node.y : margins.y
        }
      }
    }
    return margins
  }

  expandNode = (nodeId, nodeExpanded) => {
    const containerEl = ReactDOM.findDOMNode(this.refs.jsplumbContainer)
    // scrollLeft = containerEl.scrollLeft
    // scrollTop = containerEl.scrollTop
    const workflowId = this.props.workflowId
    const computedNodeId = workflowId ? `${workflowId}_${nodeId}` : `${nodeId}`
    let nodeEl = containerEl.querySelector('[id="' + computedNodeId + '"]')
    if (nodeEl) {
      if (nodeEl.nextSibling && nodeEl.nextSibling.className === '__nodeSummary') {
        nodeEl = nodeEl.nextSibling
      }
      // show Loading icon
      const expandBtnEl = nodeEl.querySelector('.expand-btn')
      expandBtnEl.innerHTML += '<span class="wings-spinner __expandSpinner"></span>'
    }

    if (this.props.onGroupClick) {
      this.props.onGroupClick(computedNodeId, nodeExpanded)
    }
  }

  renderNode = node => {
    if (node.type === 'ORIGIN') {
      return null
    }

    let nodeName = node.name
    const labelLen = node.type === 'ELEMENT' ? 12 : 25
    if (nodeName && nodeName.length > labelLen) {
      nodeName = nodeName.slice(0, labelLen) + String.fromCharCode(8230) // ellipsis unicode (...)
    }
    const margins = this.getMargins()
    const nodeStyles = {
      width: 50,
      height: 35,
      left: node.x - margins.x + 20,
      top: node.y - margins.y + 8
    }
    if (node.type === 'REPEAT' || node.type === 'FORK') {
      nodeStyles.width = 37
      nodeStyles.height = 37
    }
    if (node.type === 'PHASE' || node.type === 'PHASE_STEP') {
      // nodeStyles.width = node.width + 'px'
      // nodeStyles.height = node.height + 'px'
      nodeStyles.width = 70
      nodeStyles.height = 45
    }
    if (node.type === 'ELEMENT') {
      nodeStyles.width = 30 + nodeName.length * 6
      nodeStyles.width = nodeStyles.width < 35 ? 35 : nodeStyles.width
      nodeStyles.width = nodeStyles.width > 120 ? 120 : nodeStyles.width
    }

    // const statusEl = node.status ? (
    //   <img className="status-icon" src={`/img/workflow/status_${node.status.toLowerCase()}.png`} />
    // ) : null
    const nodeStatusClass = node.status ? 'node-status-' + node.status.toLowerCase() : ''
    const elementStatusClass = node.status ? '__elementStatus-' + node.status.toLowerCase() : ''

    let expandBtn = null
    let nodeSummaryBox = null
    if (node.status && (node.type === 'REPEAT' || node.type === 'FORK')) {
      if (node.expanded === true) {
        expandBtn = (
          <span className="expand-btn">
            <i className="fa fa-minus-square-o __expanded" />
          </span>
        )
      } else {
        expandBtn = (
          <span className="expand-btn">
            <i className="fa fa-plus-square-o __collapsed" />
          </span>
        )

        // render Collapsed Node's Summary
        const styleObj = {
          left: nodeStyles.left,
          top: nodeStyles.top - 2
        }
        nodeSummaryBox = (
          <div className="__nodeSummary" style={styleObj} onClick={this.expandNode.bind(this, node.id, node.expanded)}>
            {expandBtn}
            <NodeElementStatusSummary nodeData={node} />
          </div>
        )
        nodeStyles.visibility = 'hidden'
      }
    }

    const progress = Utils.getProgressPercentages(node)
    let progressBar = null
    if (
      this.props.status &&
      node.type !== 'GROUP' &&
      node.type !== 'REPEAT' &&
      node.type !== 'FORK' &&
      node.type !== 'ELEMENT'
    ) {
      progressBar = (
        <BreakdownProgress className="__nodeProgress" progress={progress} status={node.status} hidePct={true} />
      )
    }

    let nodeClass = 'jsplumb-node ' + css.node
    // for multi-step Command, if initialization failed (ssh, etc.) (status = FAILED) & progress sum = 0:
    if (node.status === 'FAILED' && node.type !== 'ELEMENT' && node.type !== 'REPEAT' && node.type !== 'FORK') {
      nodeClass += ' ' + nodeStatusClass
      progressBar = null
    }
    if (node.status === 'RUNNING' && node.type !== 'ELEMENT' && node.type !== 'REPEAT' && node.type !== 'FORK') {
      nodeClass += ' node-running-fx'
    }
    /*
        When cloned/Templatized parent and cloned workflow
        has the same graph linkids and nodeids .todifferentiate
        suffixing with workflowid
       */
    const workflowId = this.props.workflowId
    const computedNodeId = workflowId ? `${workflowId}_${node.id}` : `${node.id}`
    const iconClass = StencilConfigs.getNodeIconClass(node.type, node.name)
    return (
      <div key={computedNodeId}>
        <div
          id={computedNodeId}
          className={node.type === 'GROUP' ? 'jsplumb-node wings-group-node' : nodeClass}
          data-id={computedNodeId}
          data-shape={node.shape}
          data-type={node.type}
          data-expanded={node.expanded}
          style={nodeStyles}
        >
          <div
            className="__pulsatingBorder"
            style={{
              display:
                node.status === 'RUNNING' && node.type !== 'ELEMENT' && node.type !== 'REPEAT' && node.type !== 'FORK'
                  ? 'table-cell'
                  : 'none'
            }}
          />
          <div className="__nodeIcon" style={{ display: node.type !== 'ELEMENT' ? 'table-cell' : 'none' }}>
            <i
              className={iconClass}
              style={{
                display: typeof node.type !== 'undefined' ? 'inline-block' : 'none'
              }}
            />
          </div>
          <div
            className={`__elementStatus ${elementStatusClass}`}
            style={{
              display: node.type === 'ELEMENT' ? 'inline-block' : 'none'
            }}
          />
          {progressBar}
          <div
            className="__nodeLabel"
            style={{
              display: this.props.status && (node.type === 'GROUP' || node.type === 'REPEAT' ? 'none' : 'inline-block')
            }}
          >
            <span className={node.type === 'ELEMENT' ? 'groupNodeLabel' : ''}>{nodeName}</span>
          </div>
          {expandBtn}
          <ul
            className="__actions"
            style={{
              display: node.status === 'PAUSED' && node.type !== 'ELEMENT' ? 'inline-block' : 'none'
            }}
          >
            <li data-action="RESUME">
              <i className="icons8-play-filled" data-action="RESUME" data-id={node.id} onClick={this.resumeNode} />
            </li>
          </ul>
          <div className="__folderLine" style={{ display: node.type === 'ELEMENT' ? 'block' : 'none' }} />
        </div>
        {nodeSummaryBox}
      </div>
    )
  }

  closePopover = () => {
    this.setState({ showPopover: false })
  }

  onShowActivity = activityUuid => {
    Utils.hideModal.bind(this)()
    const modalActivity = {
      uuid: activityUuid
    }
    this.setState({ showActivityModal: true, modalActivity })
  }

  render () {
    const styleObj = {}
    const propData = this.props.data
    const workflowStatus = propData.status
    const nodes = Utils.getJsonValue(this, 'state.graphData.nodes')

    // for Canary workflow, update x, y to have a "linear" graph
    if (propData.name === 'Canary Deployment') {
      for (let i = 0; i < nodes.length; i++) {
        nodes[i].x = 120 * (i + 1)
        nodes[i].y = 10
      }
    }

    let mainClass = css.main + ' ' + css.flowchartContainer + ' ' + this.props.className
    let flowchartClass = css.flowchart
    let runningClass = ''

    // override class names for Full Page mode
    if (this.props.status === 'true') {
      mainClass = css.main + ' ' + this.props.className
      flowchartClass = css.flowchartList
    }
    if (this.props.fullPage === 'true') {
      mainClass = css.main + ' ' + css.mainFullPage + ' ' + this.props.className
      flowchartClass = '__fullPage'
      styleObj.minHeight = window.innerHeight - 195 + 'px'
      styleObj.marginBottom = -170
    }

    if (this.props.runningCardView === true) {
      runningClass = 'jtk-surface-running'
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
        progress.donePct = Math.round(propData.breakdown.success / propData.total * 100)
        progress.failedPct = Math.round(propData.breakdown.failed / propData.total * 100)
        progress.runningPct = 0
        break
    }
    // const sum = Math.round(progress.donePct + progress.failedPct + progress.runningPct)
    const mainProgressBar = <BreakdownProgress progress={progress} status={workflowStatus} className="__mainProgress" />

    let execSummaryBox = null
    if (this.props.status === 'true' && this.props.fullPage === 'true') {
      execSummaryBox = <ExecSummaryBox data={propData} />
    }

    return (
      <section className={mainClass}>
        {this.props.status && workflowStatus === 'RUNNING' ? mainProgressBar : null}
        <div
          ref="jsplumbContainer"
          id="canvas"
          className={`jtk-demo-canvas canvas-wide flowchart-demo jtk-surface
          jtk-surface-wings ${runningClass} ${flowchartClass}`}
          style={styleObj}
          onClick={this.props.onViewClick}
        >
          {nodes.map(node => this.renderNode(node))}
        </div>

        {execSummaryBox}

        <NodePopover
          data={this.state.popoverData}
          show={this.state.showPopover}
          target={() => ReactDOM.findDOMNode(this.state.popoverTarget)}
          container={this}
          onClose={this.closePopover}
          params={this.state.popoverParams}
        />
        <NodeDetailsModal
          data={this.state.modalData}
          show={this.state.showModal}
          onHide={Utils.hideModal.bind(this)}
          onShowActivity={this.onShowActivity}
        />
        {/* <ActivityModal
          activity={this.state.modalActivity}
          appId={this.appIdFromUrl}
          envId={this.envIdFromUrl}
          show={this.state.showActivityModal}
          onHide={Utils.hideModal.bind(this, 'showActivityModal')}
        /> */}
      </section>
    )
  }
}

export default WorkflowView



// WEBPACK FOOTER //
// ../src/containers/WorkflowView/WorkflowView.js