import React from 'react'
import ReactDOM from 'react-dom'
import { BreakdownProgress, NodePopover, StencilConfigs, Utils } from 'components'
import NodeDetailsModal from './NodeDetailsModal'
import StencilModal from '../WorkflowEditor/StencilModal'

import apis from 'apis/apis'
import css from './WorkflowView.css'

const customLink = {
  connector: 'StateMachine', // 'Straight', 'Flowchart', 'StateMachine'
  // straight (Flowchart style) connectors:
  // connector: [ 'Flowchart', { stub: [40, 60], gap: 10, cornerRadius: 5, alwaysRespectStubs: true } ],
  anchor: 'Continuous', // 'AutoDefault'
  // Blank, Dot, Rectangle, Image, [ 'Dot', { radius: 1 } ]
  endpoint: [], // will be set later
  endpointStyle: { fillStyle: '#c8cfd0', outlineColor: '#c8cfd0' },
  paintStyle: { strokeStyle: '#c8cfd0', lineWidth: 2 },
  hoverPaintStyle: { strokeStyle: '#1e8151', lineWidth: 2 },
  overlays: [
    ['PlainArrow', { location: 1, width: 15, length: 12 }]
    // ,[ 'Label', { label: 'FOO', id: 'label', cssClass: 'aLabel' }]
  ]
}

// created from "PipelineWorkflowView"
class SubworkflowView extends React.Component {
  // TODO: propTypes
  state = {
    data: {},
    modalData: {},
    showModal: false,
    showPopover: false,
    popoverParams: { left: 0, top: 0 },
    popoverTarget: null,
    popoverData: {},
    graphData: {
      nodes: [],
      links: []
    }
  }

  jsp = null // jsplumb instance
  jsplumbSetupDone = false

  componentWillMount () {
    let graphData = Utils.getJsonValue(this, 'props.data.graph')
    if (graphData) {
      this.setNodesToState(graphData.nodes, graphData.links)
    } else {
      const originNode = { id: Utils.generateNodeId(), name: 'ORIGIN', x: 50, y: 50, type: 'ORIGIN' }
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

  componentWillReceiveProps (newProps) {
    if (newProps.data.graph) {
      this.setNodesToState(newProps.data.graph.nodes, newProps.data.graph.links)
    }
    if (newProps.jsplumbLoaded) {
      this.invokeSetupWorkflow()
    }
  }

  setNodesToState = (nodes, links) => {
    // let isAllZeroes = true
    // for (const node of nodes) {
    //   if (node.x) {
    //     isAllZeroes = false
    //   }
    // }
    // if (isAllZeroes) {
    //   // auto generate "x"
    //   for (let i = 0; i < nodes.length; i++ ) {
    //     nodes[i].x = 150 * i
    //     nodes[i].y = 40
    //   }
    // }
    // auto generate "x"
    for (let i = 0; i < nodes.length; i++) {
      nodes[i].x = 40 + 150 * i
      nodes[i].y = 10
    }
    this.setState({
      graphData: {
        nodes,
        links
      }
    })
  }

  invokeSetupWorkflow = () => {
    // wait for state & node rendering
    setTimeout(() => {
      this.setupWorkflow(this.state.graphData)
    }, 100)
  }

  setupWorkflow = graphData => {
    if (!this.jsplumbSetupDone) {
      // ensure this runs once
      this.jsp = jsPlumb.getInstance()
      this.jsp.importDefaults({})
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
    if (graphData.links && graphData.links.length > 0) {
      for (const link of graphData.links) {
        const nodeData = graphData.nodes.find(n => n.id === link.from)
        if (nodeData.type === 'ORIGIN') {
          continue
        }
        customLink.endpoint = [
          'Image',
          {
            src: `/img/workflow/${link.type.toLowerCase()}.png`,
            cssClass: 'iconEndpoint',
            type: link.type
          }
        ]
        const c = this.jsp.connect(
          {
            source: link.from,
            target: link.to
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
    }
    this.jsp.repaintEverything()
  }

  setupNode = nodeEl => {
    const that = this
    // this.jsp.draggable(nodeEl, { grid: [10, 10] })

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
          if (that.props.fullPage === 'true') {
            popoverParams = {
              left: parseInt(el.style.left || 0) - 165 + 'px',
              top: parseInt(el.style.top || 0) + 80 + 'px'
            }
          } else {
            popoverParams = {
              left: parseInt(el.style.left || 0) - 165 + 'px',
              top: parseInt(el.style.top || 0) + 80 + 'px'
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
      // 'this' is nodeEl
      if (ev.target.dataset.action) {
      } else if (that.props.status) {
        const nodeData = that.state.graphData.nodes.find(n => n.id === nodeEl.dataset.id)
        that.setState({ modalData: nodeData, showModal: true })

        if (ev.target.className.indexOf('__expanded') >= 0 || ev.target.className.indexOf('__collapsed') >= 0) {
          if (that.props.onGroupClick) {
            that.props.onGroupClick(this)
          }
        }
      }
    }
  }

  closePopover = () => {
    this.setState({ showPopover: false })
  }

  getToolTip = nodeEl => {
    const tooltip = [nodeEl.name]

    if (nodeEl.properties) {
      Object.keys(nodeEl.properties).map(key => {
        tooltip.push(key + ' : ' + nodeEl.properties[key])
      })
    }
    return tooltip.join('\n')
  }

  // find the minimums of nodes' x, y => set to margins
  getMargins = () => {
    const nodes = Utils.getJsonValue(this, 'state.graphData.nodes')
    let margins = { x: Number.MAX_VALUE, y: Number.MAX_VALUE }
    let found = false
    if (nodes && nodes.length > 1) {
      for (const node of nodes) {
        if (node && node.type !== 'ORIGIN') {
          margins.x = node.x < margins.x ? node.x : margins.x
          margins.y = node.y < margins.y ? node.y : margins.y
          found = true
        }
      }
    }
    margins = found ? margins : { x: 20, y: 10 }
    margins.x -= 30 // add default margin
    return margins
  }

  nodeToolbarBtnClick = ev => {
    const action = ev.target.getAttribute('data-action')
    // const id = ev.target.getAttribute('data-id')
    const nodeEl = Utils.findParentByChild(ev.target, '.__node')
    const nodeData = this.state.graphData.nodes.find(n => n.id === nodeEl.dataset.id)

    if (action === 'EDIT') {
      const stencilData = this.props.stencils.find(s => s.type === nodeEl.dataset.type)
      if (stencilData.jsonSchema.properties) {
        Utils.showModal.bind(this)({ nodeData: nodeEl.dataset, ...nodeData.properties })
      }
    } else if (action === 'DELETE') {
      this.removeNode(nodeEl)
    } else if (action === 'CLONE') {
      this.addNode(null, nodeEl)
    }
  }

  renderNode = node => {
    const margins = this.getMargins()
    const nodeStyles = { left: node.x - margins.x + 'px', top: node.y - margins.y + 'px' }

    const progress = Utils.getProgressPercentages(node)
    let progressBar = null
    if (this.props.status && node.type !== 'GROUP') {
      progressBar = (
        <BreakdownProgress
          className="__nodeProgress __nodeProgressPipeline"
          progress={progress}
          status={node.status}
          hidePct={true}
        />
      )
    }

    let nodeClass = 'jsplumb-node wings-mini-node ' + css.node
    // for multi-step Command, if initialization failed (ssh, etc.) (status = FAILED) & progress sum = 0:
    if (node.status === 'FAILED' && progress.sumPct === 0) {
      nodeClass += ' ' + nodeStatusClass
      progressBar = null
    }
    const iconClass = StencilConfigs.getNodeIconClass(node.type, node.name)

    return (
      <div
        id={node.id}
        key={node.id}
        className={
          node.shape
            ? 'jsplumb-node shape'
            : nodeClass + ' __node __nodeGroup_' + StencilConfigs.getCategoryByNodeType(node.type)
        }
        data-id={node.id}
        data-shape={node.shape}
        data-type={node.type}
        data-name={node.name}
        style={nodeStyles}
        onClick={ev => this.props.onDetailsIconClick(ev.target, true)}
      >
        <div
          className="__nodeIcon __nodeIconPipeline"
          data-toggle="tooltip"
          data-placement="bottom"
          title={this.getToolTip(node)}
        >
          <i className={iconClass} style={{ display: typeof node.type !== 'undefined' ? 'inline-block' : 'none' }} />
        </div>
        {progressBar}
        <div className="__nodeLabel __nodeLabelPipeline">
          <span>
            {node.name}
          </span>
        </div>
        {node.type !== 'PHASE' &&
          node.type !== 'PHASE_STEP' &&
          <ul className={`nodeToolbar ${node.type === 'ORIGIN' || this.props.readOnly === true ? 'wings-hide' : ''}`}>
            <li>
              <i
                className="icons8-create-new"
                title="Edit"
                data-action="EDIT"
                onClick={this.nodeToolbarBtnClick}
                data-id={node.id}
              />
            </li>
            <li>
              <i
                className="icons8-copy"
                title="Clone"
                data-action="CLONE"
                onClick={this.nodeToolbarBtnClick}
                data-id={node.id}
              />
            </li>
            <li>
              <i
                className="icons8-waste"
                title="Delete"
                data-action="DELETE"
                onClick={this.nodeToolbarBtnClick}
                data-id={node.id}
              />
            </li>
          </ul>}
      </div>
    )
  }

  onStencilModalSubmit = (nodeId, formData) => {
    const nodeData = this.state.graphData.nodes.find(n => n.id === nodeId)
    nodeData.properties = formData
    const context = this.props.metaData.workflow
    apis
      .updateSubworkflowNode(Utils.appIdFromUrl(), context.workflowId, context.subworkflowId, nodeData.id, nodeData)
      .then(data => {})
    Utils.hideModal.bind(this)()
  }

  render () {
    return (
      <section className={css.main}>
        <div
          ref="jsplumbContainer"
          className="jtk-demo-canvas canvas-wide flowchart-demo jtk-surface jtk-surface-wings"
          id="canvas"
        >
          {this.state.graphData.nodes.map(node => this.renderNode(node))}
        </div>

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

        <StencilModal
          data={this.state.modalData}
          stencils={this.props.stencils}
          show={this.state.showModal}
          onHide={Utils.hideModal.bind(this)}
          onSubmit={this.onStencilModalSubmit}
        />
      </section>
    )
  }
}

export default SubworkflowView



// WEBPACK FOOTER //
// ../src/containers/WorkflowView/SubworkflowView.js