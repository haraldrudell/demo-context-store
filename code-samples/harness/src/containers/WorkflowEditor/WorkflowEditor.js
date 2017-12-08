import React from 'react'
import ReactDOM from 'react-dom'
import ReactTooltip from 'react-tooltip'
import NotificationSystem from 'react-notification-system'
import { ButtonToolbar, Button } from 'react-bootstrap'
import { Confirm, Utils, SaveVersionsModal, BreadCrumbs, StencilConfigs, AppStorage } from 'components'
import { Tracker } from 'utils'
import StencilList from './StencilList'
import StencilModal from './StencilModal'
import WorkflowDetailsOverlay from './WorkflowDetailsOverlay'
// import PipelineWorkflowView from '../WorkflowView/PipelineWorkflowView'

import css from './WorkflowEditor.css'

// this is the default connector on nodeEl.onmouseover
const defaultEndpoint = {
  style: { fillStyle: 'blue' },
  anchor: ['Continuous', { faces: ['bottom', 'left', 'right'] }], // anchor: 'Continuous'
  endpointStyle: { fillStyle: '#c8cfd0', outlineColor: '#c8cfd0' },
  paintStyle: { strokeStyle: '#c8cfd0', lineWidth: 2 },
  isSource: true,
  isTarget: true,
  maxConnections: 1,
  connector: 'StateMachine', // 'Straight', 'Flowchart'
  connectorStyle: { strokeStyle: '#c8cfd0', lineWidth: 2 },
  connectorOverlays: [['PlainArrow', { location: 1, width: 15, length: 12 }]],
  endpoint: ['Image', { src: '/img/workflow/default-endpoint.png', cssClass: 'iconEndpoint', type: 'SUCCESS' }]
}

// const stateMachineConnector = {
//   connector: 'StateMachine',
//   paintStyle: { lineWidth: 3, strokeStyle: '#056' },
//   hoverPaintStyle: { strokeStyle: '#dbe300' },
//   endpoint: 'Blank',
//   anchor: 'Continuous',
//   overlays: [['PlainArrow', { location: 1, width: 15, length: 12 }]]
// }
const customLink = {
  connector: 'StateMachine', // 'Straight', 'Flowchart', 'StateMachine'
  // straight (Flowchart style) connectors:
  // connector: [ 'Flowchart', { stub: [40, 60], gap: 10, cornerRadius: 5, alwaysRespectStubs: true } ],
  anchor: 'Continuous', // 'AutoDefault'
  // Blank, Dot, Rectangle, Image, [ 'Dot', { radius: 1 } ]
  endpoint: ['Image', { src: '/img/workflow/default-endpoint.png', cssClass: 'iconEndpoint' }],
  endpointStyle: { fillStyle: '#c8cfd0', outlineColor: '#c8cfd0' },
  paintStyle: { strokeStyle: '#c8cfd0', lineWidth: 2 },
  hoverPaintStyle: { strokeStyle: '#1e8151', lineWidth: 2 },
  overlays: [
    ['PlainArrow', { location: 1, width: 15, length: 12 }]
    // ,[ 'Label', { label: 'FOO', id: 'label', cssClass: 'aLabel' }]
  ]
}

class WorkflowEditor extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }
  // TODO: propTypes
  state = {
    data: {},
    modalData: {},
    showModal: false,
    nodes: [],
    links: [],
    showDisconnectedError: false,
    nodeDetailsShow: false,
    nodeDetailsTarget: null,
    nodeDetailsData: { workflow: null },
    showSaveVersionsModal: false
  }
  accountIdFromUrl = Utils.accountIdFromUrl()
  appIdFromUrl = Utils.appIdFromUrl()
  idFromUrl = Utils.getIdFromUrl()
  setupWorkflowDone = false
  jsp = null // jsplumb instance
  jsplumbSetupDone = false
  placeholderEndpoint = null
  lastHoverNode = null
  lastSavedDataStr = null

  componentWillMount () {
    let graphData = Utils.getJsonValue(this, 'props.data.graph')
    if (graphData) {
      this.setNodesToState(graphData)
    } else {
      // const originNode = { id: Utils.generateNodeId(), name: 'ORIGIN', x: 20, y: 20, type: 'ORIGIN' }
      // const nodes = [ originNode ]
      const nodes = []
      graphData = {
        nodes: nodes,
        links: []
      }
      this.setNodesToState(graphData)
    }
    setTimeout(() => {
      this.setupWorkflow(graphData)
    }, 100)
  }

  componentDidMount () {
    // setup Stencil Sidebar
    const left = '0px'
    const sidebarEl = ReactDOM.findDOMNode(this.refs.sidebar)
    const sidebarBgEl = ReactDOM.findDOMNode(this.refs.sidebarBg)
    if (sidebarEl) {
      sidebarEl.style.right = left
      sidebarBgEl.style.right = left
    }
    window.scrollTo(0, 0)

    this.context.router.setRouteLeaveHook(this.props.route, this.routerWillLeave.bind(this))
  }

  setNodesToState = (graphData, newProps) => {
    const _props = newProps ? newProps : this.props
    let nodes = graphData.nodes
    const { links } = graphData
    const rollbackPhases = _props.data.rollbackWorkflowPhaseIdMap
    // let isAllZeroes = true
    // for (const node of nodes) {
    //   if (node.x) {
    //     isAllZeroes = false
    //   }
    // }
    // if (isAllZeroes) {

    nodes = Utils.reorderNodesByLinks({ nodes, links })
    Utils.autoPlaceNodes(nodes) // auto place nodes from left to right
    console.log('- nodes in order: ', nodes)
    for (let i = 0; i < nodes.length; i++) {
      // try to get Rollback Phase for this Phase Node to set X and Y:
      if (nodes[i].type === 'PHASE' && rollbackPhases && rollbackPhases[nodes[i].id]) {
        const rollbackPhase = rollbackPhases[nodes[i].id] // rollback phase for this nodes[i]
        const rollbackNode = nodes.find(n => n.id === rollbackPhase.uuid)
        if (rollbackNode) {
          rollbackNode.isRollbackPhase = true
          if (_props.showRollbackPhases === true) {
            rollbackNode.x = nodes[i].x
            rollbackNode.y = nodes[i].y + 200
          } else {
            rollbackNode.x = -1000 // hide it
          }
        }
      }
    }
    this.setState({ nodes })
  }

  routerWillLeave (nextLocation) {
    const currentDataStr = JSON.stringify(this.getWorkflowData())
    if (currentDataStr !== this.lastSavedDataStr) {
      return 'Your have unsaved changes. Are you sure you want to leave?'
    }
    return true
  }

  componentWillReceiveProps (newProps) {
    if (newProps.data.graph) {
      // this.setState({ nodes: newProps.data.graph.nodes })
      console.log('newProps.data.graph: ', newProps.data.graph)
      this.setNodesToState(newProps.data.graph, newProps)
      setTimeout(() => {
        this.setupWorkflow(newProps.data.graph)
      }, 100)
    }
  }

  setupWorkflow = graphData => {
    if (!this.jsplumbSetupDone) {
      // ensure this runs once
      this.jsp = jsPlumb.getInstance()
      this.jsp.importDefaults({})
    }
    this.jsplumbSetupDone = true
    this.setupWorkflowDone = false

    if (this.jsp) {
      jsPlumb.reset()
      this.jsp.reset()
    }
    const containerEl = ReactDOM.findDOMNode(this.refs.jsplumbContainer)
    if (!containerEl) {
      return
    }

    const nodeEls = containerEl.querySelectorAll('.jsplumb-node')
    this.placeholderEndpoint = null
    this.lastHoverNode = null

    this.jsp.bind('connection', conn => {
      // reset this.placeholderEndpoint because a real endpoint has been created on 'connection'
      this.placeholderEndpoint = null
      conn.sourceEndpoint.canvas.setAttribute('data-type', 'success')
      conn.sourceEndpoint.canvas.src = '/img/workflow/success.png'
      conn.targetEndpoint.canvas.style.display = 'none'

      this.setupSourceEndpoint(conn.sourceEndpoint.canvas, conn.connection)
      // if (this.setupWorkflowDone) {
      //   conn.sourceEndpoint.canvas.click() // trigger click event of "conn.sourceEndpoint" to show Context Menu.
      // }
    })

    this.jsp.bind('connectionDetached', (info, originalEv) => {
      this.jsp.deleteEndpoint(info.sourceEndpoint)
      this.autoSetOriginNode()
    })

    containerEl.onclick = ev => {
      this.refs.linkTypeTooltip.hideTooltip(ev)

      this.jsp.deleteEndpoint(this.placeholderEndpoint)
      this.placeholderEndpoint = null
      this.jsp.repaint(this.lastHoverNode)
    }

    Array.prototype.forEach.call(nodeEls, nodeEl => {
      // cross-browser loop on elements (for Safari)
      this.setupNode(nodeEl)
    })

    // --- add Links & Endpoints
    for (const link of graphData.links) {
      const linkTypeStr = (link.type || 'blank').toLowerCase()
      const linkTypeImgSrc = `/img/workflow/linkTypes/${linkTypeStr}.png`
      customLink.endpoint = [
        'Image',
        {
          src: linkTypeImgSrc,
          cssClass: `iconEndpoint iconEndpoint-${linkTypeStr}`,
          type: link.type
        }
      ]
      const conn = this.jsp.connect(
        {
          source: link.from,
          target: link.to
        },
        customLink
      )
      if (conn && conn.canvas) {
        conn.canvas.setAttribute('data-type', link.type)
      }
      if (conn && conn.endpoints) {
        this.setupSourceEndpoint(conn.endpoints[0].endpoint.canvas, conn)
        // c.endpoints[1].endpoint.canvas.style.display = 'none' // hide the target endpoint
      }
    }
    this.jsp.repaintEverything()
    this.setupWorkflowDone = true

    setTimeout(() => {
      this.lastSavedDataStr = JSON.stringify(this.getWorkflowData())
    }, 500) // give it sometime so we can get a reliable graph data
  }

  setupSourceEndpoint = (sourceEndpointEl, connection) => {
    const _this = this
    sourceEndpointEl.dataset.linkId = connection.id
    sourceEndpointEl.dataset.sourceId = connection.sourceId
    // setup Popover for Link Types
    sourceEndpointEl.setAttribute('data-event', 'click')
    sourceEndpointEl.setAttribute('data-tip', 'tooltip')
    sourceEndpointEl.setAttribute('data-for', 'linkTypeTooltip')
    // firstEndpointEl.setAttribute('data-iscapture', 'false')
    sourceEndpointEl.setAttribute('data-offset', '{ "top": "10", "left": "0"}')
    sourceEndpointEl.onclick = function endpointClick (ev) {
      // initially, show all menu items, but hide Fork, Repeat menu items.
      const el = ReactDOM.findDOMNode(_this.refs.linkTypeTooltip)
      const liEls = el.querySelectorAll('li')
      for (const liEl of liEls) {
        liEl.style.display = 'block'
        if (liEl.dataset.type === 'FORK' || liEl.dataset.type === 'REPEAT') {
          liEl.style.display = 'none'
        }
      }
      // if clicking on Repeat / Fork, show menu items accordingly.
      const nodeId = this.dataset.sourceId // ev.target.getAttribute('elid')
      const nodeData = _this.state.nodes.find(n => n.id === nodeId)
      if (nodeData) {
        if (nodeData.type === 'REPEAT') {
          for (const liEl of liEls) {
            if (liEl.dataset.type === 'REPEAT') {
              liEl.style.display = 'block'
            }
          }
        } else if (nodeData.type === 'FORK') {
          for (const liEl of liEls) {
            if (liEl.dataset.type === 'FORK') {
              liEl.style.display = 'block'
            }
          }
        }
      }
      el.dataset.linkId = connection.id
      // _this.refs.linkTypeTooltip.showTooltip(ev) // show Context Menu
      ev.stopPropagation()
    }
  }

  getNodeEl = el => {
    let nodeEl = el
    while (nodeEl.className.indexOf('jsplumb-node') < 0) {
      nodeEl = nodeEl.parentNode
      if (!nodeEl) {
        break
      }
    }
    return nodeEl
  }

  setupNode = nodeEl => {
    if (this.props.readOnly === true) {
      return
    }
    this.jsp.draggable(nodeEl, { grid: [10, 10] })

    nodeEl.onmouseover = ev => {
      if (ev.buttons > 0) {
        return
      }
      const nodeEl = this.getNodeEl(ev.target)

      if (this.placeholderEndpoint && nodeEl.id !== this.lastHoverNode.id) {
        this.jsp.deleteEndpoint(this.placeholderEndpoint)
        this.placeholderEndpoint = null
        this.jsp.repaint(this.lastHoverNode)
      }
      // on mouse over: add a place-holder endpoint
      if (!this.placeholderEndpoint) {
        this.placeholderEndpoint = this.jsp.addEndpoint(nodeEl, defaultEndpoint)
        this.jsp.repaint(nodeEl)
      }
      this.lastHoverNode = nodeEl
    }
    nodeEl.onmouseout = ev => {
      // if (ev.toElement.className.indexOf('nodeToolbar') >= 0) {
      //   return
      // }
      // const nodeToolbarEl = ReactDOM.findDOMNode(this.refs.nodeToolbar)
      // nodeToolbarEl.style.display = 'none'
      // if (this.placeholderEndpoint) {
      // }
    }
    nodeEl.onclick = ev => {
      // const nodeEl = this.getNodeEl(ev.target)
      // this.props.data.nodeInfo = nodeEl.id + ' - ' + nodeEl.innerText
    }
    // nodeEl.ondblclick = ev => {
    //   this.enableEdit(this.getNodeEl(ev.target))
    // }

    this.jsp.makeTarget(nodeEl, {
      dropOptions: { hoverClass: 'dragHover' },
      anchor: 'Continuous',
      allowLoopback: false
    })
  }

  addNode = (ev, fromNode, nodeData) => {
    let newNodeData = {
      id: Utils.generateNodeId(),
      name: 'New',
      x: 50,
      y: 400,
      type: 'COMMAND'
      // ,shape: 'Ellipse'
    }
    if (nodeData && nodeData.id) {
      newNodeData = nodeData
    }
    if (fromNode) {
      newNodeData.name = fromNode.innerText
      newNodeData.x = fromNode.offsetLeft + 50
      newNodeData.y = fromNode.offsetTop + 50
      newNodeData.type = fromNode.dataset.type
    }
    const nodesData = this.state.nodes
    nodesData.push(newNodeData)
    this.setState({ nodes: nodesData }) // state changed => renderNode() will be called.

    // state is changed but it doesn't reflect in DOM yet => use setTimeout
    setTimeout(() => {
      const containerEl = ReactDOM.findDOMNode(this.refs.jsplumbContainer)
      const allNodes = containerEl.querySelectorAll('.jsplumb-node')
      const nodeEl = allNodes[allNodes.length - 1]
      this.setupNode(nodeEl)
      // if not overriding newNodeData (ex: adding origin node) => enable Edit name
      if (!(nodeData && nodeData.id)) {
        this.enableEdit(nodeEl)
      }
    }, 100)
  }

  enableEdit = nodeEl => {
    const labelEl = nodeEl.querySelector('.' + css.nodeLabel)
    const inputEl = document.createElement('input')
    const originalValue = labelEl.innerText
    let valueSetFlag = false
    const closeFn = setValue => {
      // labelEl.innerHTML = setValue.replace(/\s/g, '-')
      labelEl.innerHTML = setValue
      inputEl.remove()
    }
    inputEl.value = originalValue
    inputEl.className = css.editInput + ' ' + css.nodeLabel
    inputEl.onkeyup = ev => {
      if (ev.keyCode === 13) {
        valueSetFlag = true
        closeFn(inputEl.value)
      } else if (ev.keyCode === 27) {
        valueSetFlag = true
        closeFn(originalValue)
      }
    }
    inputEl.onblur = ev => {
      if (!valueSetFlag && inputEl) {
        closeFn(inputEl.value)
      }
      valueSetFlag = false // reset flag
    }
    labelEl.innerHTML = ''
    labelEl.appendChild(inputEl)

    inputEl.focus()
    inputEl.setSelectionRange(0, inputEl.value.length)
  }

  nodeToolbarBtnClick = ev => {
    const action = ev.target.getAttribute('data-action')
    // const id = ev.target.getAttribute('data-id')
    const nodeEl = Utils.findParentByChild(ev.target, '.__node')
    const nodeData = this.state.nodes.find(n => n.id === nodeEl.dataset.id)

    if (action === 'EDIT') {
      if (nodeData && nodeData.properties && nodeData.properties.tailPatterns === null) {
        nodeData.properties.tailPatterns = []
      }

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

  showDetailsOverlay = (target, clickedFromOverlay, subworkflowIdStr) => {
    if (!(this.props.readOnly === true)) {
      return
    }
    let subworkflowId = subworkflowIdStr
    let nodeEl
    if (target) {
      nodeEl = Utils.findParentByChild(target, '.jsplumb-node')
      subworkflowId = nodeEl.id
    }
    // const nodeData = this.state.nodes.find(n => n.id === nodeEl.id)

    // #TODO: remove hard-code Ids once backend supports sub-workflow
    // const appId = '17JFxlFyQf2bUU53xd-fsw'
    // let workflowId = ''
    // if (nodeEl.dataset.name === 'Pre-Deploy Steps') {
    //   workflowId = '3jUFSE6jTTuczE-01c1r4g'
    // } else if (nodeEl.dataset.name === 'Deployment Steps') {
    //   workflowId = '04g9P4lbT2uYKXfyi0cSlA'
    // } else if (nodeEl.dataset.name === 'Phase 1') {
    //   workflowId = 'RjOMhvB9TCa149PGMxE_WQ'
    // } else if (nodeEl.dataset.name === 'Post-Deploy Steps') {
    //   workflowId = 'I8wk4kpHSgKcyqY1-P0TAw'
    // }
    // apis.service.list(apis.getOrchestrationEndpoint(appId, workflowId))
    //   .then((res) => {
    //     let workflowData = res.resource
    //     if (clickedFromOverlay === true) {
    //       this.setState({
    //         nodeDetailsShow: true,
    //         nodeDetailsData: { workflow: workflowData, clickedFromOverlay: true }
    //       })
    //     } else {
    //       this.setState({
    //         nodeDetailsShow: true,
    //         nodeDetailsTarget: nodeEl,
    //         nodeDetailsData: { workflow: workflowData }
    //       })
    //     }
    //   })
    const workflowData = {
      workflowId: this.props.data.uuid,
      subworkflowId: subworkflowId,
      clickedFromOverlay: clickedFromOverlay,
      graph: this.props.data.graph.subworkflows[subworkflowId]
    }
    if (clickedFromOverlay === true) {
      this.setState({
        nodeDetailsShow: true,
        nodeDetailsData: { workflow: workflowData, clickedFromOverlay: true }
      })
    } else {
      this.setState({
        nodeDetailsShow: true,
        nodeDetailsTarget: nodeEl,
        nodeDetailsData: { workflow: workflowData }
      })
    }
  }

  hideDetailsOverlay = () => {
    this.setState({ nodeDetailsShow: false, nodeDetailsData: null })
  }

  detailsOverlayEditClick = () => {
    const workflow = this.state.nodeDetailsData.workflow
    Utils.redirect({ appId: workflow.appId, workflowId: workflow.uuid, page: 'editor' })
  }

  removeNode = nodeEl => {
    // TODO: improve this: manually delete links because this.jsp.detach(conn) has infinite loop for some reason.
    for (const conn of this.jsp.getAllConnections()) {
      if (conn.source.id === nodeEl.id || conn.target.id === nodeEl.id) {
        for (const endpoint of conn.endpoints) {
          endpoint.canvas.remove()
        }
        conn.canvas.remove()
        conn.isRemoved = true
      }
    }
    const foundIdx = this.state.nodes.map(o => o.id).indexOf(nodeEl.dataset.id)
    this.setState({
      nodes: this.state.nodes.filter((_, i) => i !== foundIdx)
    })
    setTimeout(() => {
      this.autoSetOriginNode()
    }, 50)
  }

  getWorkflowData = () => {
    const containerEl = ReactDOM.findDOMNode(this.refs.jsplumbContainer)
    const nodeEls = containerEl.querySelectorAll('.jsplumb-node')
    // const data = (this.props.data.graph ? JSON.parse(JSON.stringify(this.props.data.graph)) : {
    //   nodes: this.state.nodes
    // })
    const data = {
      nodes: this.state.nodes
    }
    data.links = [] // rebuilding data.links

    Array.prototype.forEach.call(nodeEls, nodeEl => {
      // cross-browser loop (for Safari)
      const nodeData = data.nodes.find(n => n.id === nodeEl.id)
      nodeData.x = nodeEl.offsetLeft
      nodeData.y = nodeEl.offsetTop
      nodeData.origin = nodeEl.dataset.origin === 'true' ? true : false
      nodeData.name = nodeEl.querySelector('.' + css.nodeLabel).innerText
    })
    for (const conn of this.jsp.getAllConnections()) {
      if (conn.isRemoved !== true) {
        const link = {}
        link.id = conn.id
        link.from = conn.source.id
        link.to = conn.target.id
        // if (conn.endpoints[0].canvas.src) {
        //   link.type = conn.endpoints[0].canvas.src.split('/').slice(-1).toString().replace(/\.png/, '')
        // }
        link.type = (conn.canvas.getAttribute('data-type') || 'SUCCESS').toUpperCase()
        data.links.push(link)
      }
    }
    console.log('Graph data = ', data)
    return data
  }

  saveData = (versionData = {}) => {
    const updatedNodes = this.autoSetOriginNode()
    if (!this.checkConnectedGraph(updatedNodes)) {
      this.setState({ showDisconnectedError: true })
      return
    }
    ReactTooltip.hide()
    const data = Object.assign({}, this.getWorkflowData(), versionData)
    data.nodes = updatedNodes

    this.props.onSave(data, (serviceCommand, name, version) => {
      let notification = 'Workflow saved!'
      if (name && version) {
        notification = (
          <div>
            {name} Saved! <br /> Version: {version}
          </div>
        )
      }

      Utils.addNotification(this.refs.notif, 'success', notification)
      this.lastSavedDataStr = JSON.stringify(data)
      Tracker.log('Workflow Saved', { appId: Utils.appIdFromUrl(), id: Utils.getIdFromUrl() })
    })
  }

  onSaveClick = () => {
    Tracker.log('Click: Save Workflow', { appId: Utils.appIdFromUrl(), id: Utils.getIdFromUrl() })
    this.saveData()
  }

  onSaveVersionSubmit = versionData => {
    this.setState({ showSaveVersionsModal: false })
    this.saveData(versionData)
  }

  onSaveOptionsClick = () => {
    this.setState({ showSaveVersionsModal: true })
  }

  autoSetOriginNode = () => {
    // logic to automatically find & set origin node (node.origin = true)
    // - find current origin node, check if it's still eligible for origin, if not => reset origin to false
    // - if there is no origin node: find the first node with no incoming link & at least 1 outgoing link
    const graphData = this.getWorkflowData()
    let updatedNodes = graphData.nodes
    const currentOrigin = graphData.nodes.find(node => node.origin === true)
    if (currentOrigin) {
      const linkTo = graphData.links.find(link => link.to === currentOrigin.id)
      const linkFrom = graphData.links.find(link => link.to === currentOrigin.id)
      if (linkTo || (!linkTo && !linkFrom)) {
        currentOrigin.origin = false
        updatedNodes = Utils.clone(graphData.nodes)
        this.setState({ nodes: updatedNodes })
      }
    }
    if (!currentOrigin || currentOrigin.origin === false) {
      // there is no (or no more) origin node
      if (graphData.nodes.length === 1) {
        graphData.nodes[0].origin = true
      } else {
        for (const node of graphData.nodes) {
          const linkToThis = graphData.links.find(link => link.to === node.id)
          const linkFromThis = graphData.links.find(link => link.from === node.id)
          if (!linkToThis && linkFromThis) {
            node.origin = true
            console.log('- New Origin Node: ', node)
            break
          }
        }
      }
      updatedNodes = Utils.clone(graphData.nodes)
      console.log('- Updated nodes: ', updatedNodes)
      this.setState({ nodes: updatedNodes })
    }
    return updatedNodes
  }

  checkConnectedGraph = updatedNodes => {
    const graphData = this.getWorkflowData() // to use graphData.links only
    // for each node, if there is a node without incoming && outgoing link => orphan node => graph is not connected.
    if (updatedNodes.length > 1) {
      for (const node of updatedNodes) {
        const linkToThis = graphData.links.find(link => link.to === node.id)
        const linkFromThis = graphData.links.find(link => link.from === node.id)
        if (!linkToThis && !linkFromThis) {
          return false
        }
      }
    }
    return true
  }

  onStencilDrop = (ev, ui) => {
    let nodeX = 50
    let nodeY = 50
    const containerEl = ReactDOM.findDOMNode(this.refs.jsplumbContainer)

    if (ev.clientX > window.innerWidth - 200) {
      // detect if 'clicking' on a Stencil (instead of dragging) => auto plot nodeX
      nodeX += 100 * this.state.nodes.length
      // nodeY += 50 * this.state.nodes.length
    } else {
      // dropped => calculate nodeX
      nodeX = ev.pageX - 280 + containerEl.scrollLeft
      // adjust nodeX when user dropped it out of the containerEl
      if (ev.pageX < 50) {
        nodeX = containerEl.scrollLeft
      }
      if (ev.pageX > containerEl.clientWidth - 100) {
        nodeX -= 60
      }
      nodeX += 250
      nodeY = ev.pageY - 125 + containerEl.scrollTop
    }

    let newNodeName = ui.node.dataset.name + '-' + this.state.nodes.length
    if (window.location.href.indexOf('/pipeline/') > 0) {
      newNodeName = ui.node.dataset.name
    }
    const newNodeData = {
      id: Utils.generateNodeId(),
      name: newNodeName,
      x: nodeX,
      y: nodeY,
      type: ui.node.dataset.type
    }
    this.addNode(null, null, newNodeData)

    const stencilData = this.props.stencils.find(s => s.name === ui.node.dataset.name)
    if (stencilData.jsonSchema.properties) {
      Utils.showModal.bind(this)({ nodeData: newNodeData, stencilData })
    }
  }

  onStencilModalSubmit = (nodeId, formData) => {
    if (formData.newName) {
      // user did Inline-Editing on the Name => update node.name
      const containerEl = ReactDOM.findDOMNode(this.refs.jsplumbContainer)
      const nodeEls = containerEl.querySelectorAll('.jsplumb-node')
      for (const el of nodeEls) {
        if (el.id === nodeId) {
          const nodeLabelEl = el.querySelector('.__nodeLabel span')
          nodeLabelEl.innerHTML = formData.newName
        }
      }
      delete formData.newName
    }

    const nodeData = this.state.nodes.find(n => n.id === nodeId)
    if (formData && formData.stencilData) {
      delete formData.stencilData
    }
    nodeData.properties = formData
    // this.saveData()
    Utils.hideModal.bind(this)()
  }

  onLinkTypeTooltipClick = ev => {
    ReactTooltip.hide()
    // const tooltipDivEl = Utils.findParentByChild(ev.target, 'div')
    // set "data-type" to connection (link) => This works:
    // const newType = ev.target.dataset.type
    // if (newType) {
    //   for (const conn of this.jsp.getAllConnections()) {
    //     if (conn.id === tooltipDivEl.dataset.linkId) {
    //       conn.canvas.setAttribute('data-type', newType)
    //       const linkImgEl = conn.canvas.parentElement.querySelector(`img[data-link-id="${conn.id}"]`)
    //       linkImgEl.src = `/img/workflow/${newType.toLowerCase()}.png`
    //     }
    //   }
    // }

    // Delete a link (connection) => works but cause issue after Saving
    // const allConns = this.jsp.getAllConnections()
    // for (const conn of allConns) {
    //   if (conn.id === tooltipDivEl.dataset.linkId) {
    //     // this.jsp.deleteEndpoint(conn.endpoints[0]) // doesn't work - causes infinite loop.
    //     // this.jsp.detach(conn) // doesn't work - causes infinite loop.
    //     for (const endpoint of conn.endpoints) {
    //       endpoint.canvas.remove()
    //     }
    //     conn.canvas.remove()
    //     conn.isRemoved = true
    //     setTimeout(() => {
    //       this.lastSavedDataStr = JSON.stringify(this.getWorkflowData())
    //     }, 500) // give it sometime so we can get a reliable graph data
    //     return
    //   }
    // }
  }

  renderNode = node => {
    const iconClass = StencilConfigs.getNodeIconClass(node.type, node.name)
    const nodeStyles = {
      left: node.x + 'px',
      top: node.y + 'px'
    }
    if (node.type === 'REPEAT' || node.type === 'FORK') {
      nodeStyles.width = 45
      nodeStyles.height = 45
    }

    return (
      <div
        id={node.id}
        key={node.id}
        className={
          node.shape
            ? 'jsplumb-node shape'
            : 'jsplumb-node __node __nodeGroup_' + StencilConfigs.getCategoryByNodeType(node.type)
        }
        data-id={node.id}
        data-shape={node.shape}
        data-type={node.type}
        data-origin={node.origin}
        data-name={node.name}
        style={nodeStyles}
        onClick={ev => this.showDetailsOverlay(ev.target)}
      >
        <div className="__nodeIcon">
          <i className={iconClass} style={{ display: typeof node.type !== 'undefined' ? 'inline-block' : 'none' }} />
        </div>
        {node.isRollbackPhase === true && <div className="__rollbackLink" />}
        <div className={css.nodeLabel + ' __nodeLabel'}>
          {/* node.type === 'PHASE' || node.type === 'PHASE_STEP' ? (
            <span>
              {node.name}
              <i className="icons8-zoom-in __detailsIcon" onClick={(ev) => this.showDetailsOverlay(ev.target)} />
            </span>
          ) : node.name */}
          <span>{node.name}</span>
        </div>
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
        </ul>
        <span className="__origin-label">ORIGIN</span>
      </div>
    )
  }

  goBack = () => {
    history.go(-1)
  }

  closeError = () => {
    this.setState({ showDisconnectedError: false })
  }

  onContainerClick = ev => {
    if (ev.target.id === 'canvas') {
      this.hideDetailsOverlay()
    }
  }

  renderBreadCrumbs () {
    const accountId = AppStorage.get('acctId') // To be fixed
    let bData = [{ label: this.props.headingName || this.props.data.name || '' }]
    if (Utils.isCommandEditor()) {
      const queryParam = {}
      queryParam.appId = [this.appIdFromUrl]
      queryParam.serviceId = this.props.service.uuid
      // const urlToService = Utils.buildUrl(accountId, queryParam, 'application-details/services/detail').slice(1)

      // Utils.redirect({ appId: true, serviceId: this.props.service.uuid, page: 'detail' }, true).slice(1)
      bData = [{ label: this.props.headingName || '' }]
    }
    if (Utils.isWorkflowEditor()) {
      bData = [
        { label: 'Setup', link: `/account/${accountId}/setup` },
        {
          label: 'Services',
          link: `/account/${accountId}/application-details/setup-services?appId=${this.appIdFromUrl}`
        },
        {
          label: this.props.headingName || this.props.data.name || '',
          link: `/app/${this.appIdFromUrl}/workflow/${this.idFromUrl}/canary-questions`
        },
        { label: 'Preview' }
      ]
    }
    return <BreadCrumbs className="editor-breadcrumbs" data={bData} />
  }

  render () {
    const onSave = this.props.showSaveOptions ? this.onSaveOptionsClick : this.onSaveClick
    const serviceId = Utils.getJsonValue(this, 'props.service.uuid') || ''

    return (
      <section className={css.main}>
        <div>
          {this.renderBreadCrumbs()}
          {this.props.readOnly !== true && (
            <ButtonToolbar className={css.buttonBar}>
              <Button bsStyle="primary" className="submit-button" onClick={onSave.bind(this)}>
                Save
              </Button>
            </ButtonToolbar>
          )}
        </div>
        <div
          ref="jsplumbContainer"
          id="canvas"
          className="jtk-demo-canvas canvas-wide flowchart-demo jtk-surface jtk-surface-nopan wings-workflow-editor"
          onClick={this.onContainerClick}
        >
          {this.state.nodes.map(node => this.renderNode(node))}
        </div>

        <ReactTooltip
          ref="linkTypeTooltip"
          id="linkTypeTooltip"
          type="info"
          place="bottom"
          effect="solid"
          event="click"
          class={css.linkTypeBox}
        >
          <ul onClick={this.onLinkTypeTooltipClick}>
            {/* <li data-type="SUCCESS">
              <img src="/img/workflow/success.png" />Success
            </li>
            <li data-type="FAILURE">
              <img src="/img/workflow/failure.png" />Failure
            </li>
            <li data-type="FORK">
              <img src="/img/workflow/fork.png" />Fork
            </li>
            <li data-type="REPEAT">
              <img src="/img/workflow/repeat.png" />Repeat
            </li> */}
            <li data-type="DELETE_LINK">Delete Link</li>
          </ul>
        </ReactTooltip>

        <aside ref="sidebar" className="control-sidebar control-sidebar-dark">
          <StencilList catalogs={this.props.catalogs} stencils={this.props.stencils} onDrop={this.onStencilDrop} />
        </aside>
        {/* /.control-sidebar */}
        <div ref="sidebarBg" className="control-sidebar-bg" />

        <StencilModal
          data={this.state.modalData}
          stencils={this.props.stencils}
          show={this.state.showModal}
          onHide={Utils.hideModal.bind(this)}
          onSubmit={this.onStencilModalSubmit}
          enableExpressionBuilder={true}
          appId={this.appIdFromUrl}
          service={this.props.service}
          entityId={serviceId}
          entityType="SERVICE"
          context="SERVICE-COMMAND-EDITOR"
        />
        <NotificationSystem ref="notif" />
        <Confirm
          visible={this.state.showDisconnectedError}
          onConfirm={this.closeError}
          onClose={this.closeError}
          body="One or more nodes are unreachable. Please connect all nodes."
          confirmText="OK"
          hideCancel={true}
          title="Error"
        >
          <button style={{ display: 'none' }} />
        </Confirm>
        <SaveVersionsModal
          show={this.state.showSaveVersionsModal}
          onHide={Utils.hideModal.bind(this, 'showSaveVersionsModal')}
          onSubmit={this.onSaveVersionSubmit}
        />

        <WorkflowDetailsOverlay
          className={css.detailsPopover}
          show={this.state.nodeDetailsShow}
          target={this.state.nodeDetailsTarget}
          data={this.state.nodeDetailsData}
          stencils={this.props.stencils}
          onHide={this.hideDetailsOverlay}
          onHeaderClick={this.showDetailsOverlay}
          onDetailsIconClick={this.showDetailsOverlay}
          onEditClick={this.detailsOverlayEditClick}
        />
      </section>
    )
  }
}

export default WorkflowEditor



// WEBPACK FOOTER //
// ../src/containers/WorkflowEditor/WorkflowEditor.js