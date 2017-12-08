import React from 'react'
import ReactDOM from 'react-dom'
import scriptLoader from 'react-async-script-loader'
import ReactTooltip from 'react-tooltip'

import css from './WorkflowPOCPage.css'

// import { Utils } from 'components'
// import apis from 'apis/apis'

// const fetchInitialData = () => {
//   return apis.service.browse('apps', {}).catch(error => { throw error })
// }
// const fragmentArr = [
//   { data: [fetchInitialData] }
// ]

const defaultEndpoint = {
  endpoint: 'Dot',
  style: { fillStyle: 'blue' },
  anchor: 'Continuous',
  endpointStyle: { fillStyle: 'lightblue', outlineColor: 'lightblue' },
  paintStyle: { strokeStyle: 'lightblue', lineWidth: 2 },
  isSource: true,
  isTarget: true,
  maxConnections: 1,
  connector: 'StateMachine', // 'Straight', 'Flowchart'
  connectorStyle: { strokeStyle: 'lightblue', lineWidth: 2 },
  connectorOverlays: [['PlainArrow', { location: 1, width: 15, length: 12 }]]
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
  endpoint: ['Image', { src: '/img/workflow/success.png', cssClass: 'iconEndpoint' }],
  endpointStyle: { fillStyle: 'lightblue', outlineColor: 'lightblue' },
  paintStyle: { strokeStyle: 'lightblue', lineWidth: 2 },
  hoverPaintStyle: { strokeStyle: '#1e8151', lineWidth: 2 },
  overlays: [
    ['PlainArrow', { location: 1, width: 15, length: 12 }]
    // ,[ 'Label', { label: 'FOO', id: 'label', cssClass: 'aLabel' }]
  ]
}

class WorkflowPOCPage extends React.Component {
  // TODO: propTypes
  state = { data: {}, nodes: [] }

  jsp = null // jsplumb instance
  jsplumbSetupDone = false
  placeholderEndpoint = null
  lastHoverNode = null

  componentWillMount () {
    // after routing back to this component, manually fetch data:
    // if (__CLIENT__ && !this.props.data) {
    //   Utils.fetchFragmentsToState(fragmentArr, this, () => {
    //   })
    //   this.state.data.resource = this.state.data.resource || { response: [] } // make sure we have 'response'
    // } else {
    //   this.setState(this.props)
    // }
  }

  componentWillReceiveProps ({ isScriptLoaded, isScriptLoadSucceed }) {
    if (isScriptLoaded && !this.props.isScriptLoaded) {
      // load finished
      if (isScriptLoadSucceed) {
        // this.initEditor()
        this.workflowData = {
          applicationUuid: '',
          environmentUuid: '',
          nodes: [
            {
              id: 'Pngk05QNTaStMQBaR3dr2w',
              name: null,
              type: 'GROUP',
              status: null,
              x: 30,
              y: 210,
              width: 240,
              height: 190,
              properties: {}
            },
            {
              id: 'oE6nvhQwQQC2kpzVtZfcRg',
              name: 'RepeatByInstances',
              type: 'REPEAT',
              status: 'failed',
              x: 50,
              y: 80,
              width: 200,
              height: 300,
              properties: {}
            },
            {
              id: 'gdnl9Z9iSBytZsq0zf2dIg',
              name: 'Command',
              type: 'COMMAND',
              status: 'failed',
              x: 0,
              y: 0,
              width: 0,
              height: 0,
              properties: {}
            },
            {
              id: 'zNqN5J5yR9WG9tnL7nWaqQ',
              name: 'host9.ec2.aws.com:catalog:8080',
              type: 'ELEMENT',
              status: 'failed',
              x: 50,
              y: 230,
              width: 200,
              height: 150,
              properties: {}
            }
          ],
          links: [
            {
              id: 'oE6nvhQwQQC2kpzVtZfcRg-zNqN5J5yR9WG9tnL7nWaqQ',
              from: 'oE6nvhQwQQC2kpzVtZfcRg',
              to: 'Pngk05QNTaStMQBaR3dr2w',
              type: 'repeat'
            }
          ]
        }
        const savedData = localStorage.getItem('workflowData')
        if (savedData) {
          this.workflowData = JSON.parse(savedData)
        }
        this.setState(this.workflowData)
      } else {
        this.props.onError()
      }
    }
  }

  componentDidUpdate () {
    this.setupWorkflow()
  }

  componentWillUnmount () {}

  setupWorkflow = () => {
    if (this.jsplumbSetupDone) {
      // ensure this runs once
      return
    }
    const { isScriptLoaded, isScriptLoadSucceed } = this.props

    if (isScriptLoaded && isScriptLoadSucceed) {
      this.jsplumbSetupDone = true
      const containerEl = ReactDOM.findDOMNode(this.refs.jsplumbContainer)

      if (this.jsp) {
        jsPlumb.reset()
        this.jsp.reset()
      }

      this.jsp = jsPlumb.getInstance()
      this.jsp.importDefaults({})
      const nodeEls = containerEl.querySelectorAll('.jsplumb-node')
      this.placeholderEndpoint = null
      this.lastHoverNode = null

      this.jsp.bind('connection', info => {
        // reset this.placeholderEndpoint because a real endpoint has been created on 'connection'
        this.placeholderEndpoint = null
        info.targetEndpoint.canvas.style.display = 'none'
      })

      this.jsp.bind('connectionDetached', (info, originalEv) => {
        this.jsp.deleteEndpoint(info.sourceEndpoint)
      })

      containerEl.onclick = ev => {
        this.jsp.deleteEndpoint(this.placeholderEndpoint)
        this.placeholderEndpoint = null
        this.jsp.repaint(this.lastHoverNode)

        this.refs.reactTooltip.globalHide()
        this.getWorkflowData()
      }

      Array.prototype.forEach.call(nodeEls, nodeEl => {
        // cross-browser loop (for Safari)
        this.setupNode(nodeEl)
      })

      // --- add Links & Endpoints
      for (const link of this.state.links) {
        const fromEl = containerEl.querySelector('#' + link.from)
        const toEl = containerEl.querySelector('#' + link.to)
        customLink.endpoint = [
          'Image',
          {
            src: `/img/workflow/${link.type}.png`,
            cssClass: 'iconEndpoint',
            type: link.type
          }
        ]
        const c = this.jsp.connect(
          {
            source: fromEl,
            target: toEl
          },
          customLink
        )
        const firstEndpointEl = c.endpoints[0].endpoint.canvas
        firstEndpointEl.setAttribute('data-event', 'click')
        firstEndpointEl.setAttribute('data-tip', 'tooltip')
        firstEndpointEl.setAttribute('data-for', 'happyFace')
        // firstEndpointEl.setAttribute('data-iscapture', 'false')
        firstEndpointEl.setAttribute('data-offset', '{ "top": "10", "left": "0"}')
        firstEndpointEl.onclick = ev => {
          this.refs.reactTooltip.showTooltip(ev)
          ev.stopPropagation()
        }
        c.endpoints[1].endpoint.canvas.style.display = 'none' // hide the target endpoint
      }
      this.jsp.repaintEverything()
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
      const nodeEl = this.getNodeEl(ev.target)
      this.workflowData.nodeInfo = nodeEl.id + ' - ' + nodeEl.innerText
      this.setState(this.workflowData)
    }
    nodeEl.ondblclick = ev => {
      this.enableEdit(this.getNodeEl(ev.target))
    }

    this.jsp.makeTarget(nodeEl, {
      dropOptions: { hoverClass: 'dragHover' },
      anchor: 'Continuous',
      allowLoopback: false
    })
  }

  addNode = (ev, fromNode) => {
    const containerEl = ReactDOM.findDOMNode(this.refs.jsplumbContainer)
    const newNodeData = {
      id: Utils.generateNodeId(),
      name: 'New',
      x: 50,
      y: 400,
      type: 'codepen'
      // ,shape: 'Ellipse'
    }
    if (fromNode) {
      newNodeData.name = fromNode.innerText
      newNodeData.x = fromNode.offsetLeft + 50
      newNodeData.y = fromNode.offsetTop + 50
    }
    this.workflowData.nodes.push(newNodeData)
    this.setState(this.workflowData)
    // state is changed but it doesn't reflect in DOM yet => use setTimeout
    setTimeout(() => {
      const allNodes = containerEl.querySelectorAll('.jsplumb-node')
      const nodeEl = allNodes[allNodes.length - 1]
      this.setupNode(nodeEl)
      this.enableEdit(nodeEl)
    }, 100)
  }

  // onToolbarMouseOut = (ev) => {
  //   if (ev.target.tagName === 'BUTTON') {
  //     // ev.preventDefault()
  //     ev.stopPropagation()
  //   }
  //   const nodeToolbarEl = ReactDOM.findDOMNode(this.refs.nodeToolbar)
  //   nodeToolbarEl.style.display = 'none'
  // }

  enableEdit = nodeEl => {
    const labelEl = nodeEl.querySelector('.' + css.nodeLabel)
    const inputEl = document.createElement('input')
    const originalValue = nodeEl.innerText
    let valueSetFlag = false
    const closeFn = setValue => {
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
    const nodeEl = ev.target.parentNode.parentNode.parentNode
    if (action === 'DELETE') {
      this.removeNode(nodeEl)
    } else if (action === 'CLONE') {
      this.addNode(null, nodeEl)
    }
  }

  removeNode = nodeEl => {
    for (const conn of this.jsp.getAllConnections()) {
      if (conn.source.id === nodeEl.id || conn.target.id === nodeEl.id) {
        for (const endpoint of conn.endpoints) {
          endpoint.canvas.remove()
        }
        conn.canvas.remove()
      }
      const linkFromThisNode = this.workflowData.links.find(n => n.from === nodeEl.id)
      const linkToThisNode = this.workflowData.links.find(n => n.to === nodeEl.id)
      this.workflowData.links = this.deleteArrayItemById(this.workflowData.links, linkFromThisNode)
      this.workflowData.links = this.deleteArrayItemById(this.workflowData.links, linkToThisNode)
    }
    nodeEl.remove()
    this.workflowData.nodes = this.deleteArrayItemById(this.workflowData.nodes, nodeEl)
  }

  deleteArrayItemById = (arr, item) => {
    if (!item) {
      return arr
    }
    let foundIndex
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id === item.id) {
        foundIndex = i
        break
      }
    }
    if (foundIndex) {
      delete arr[foundIndex]
      arr = arr.filter(n => n)
    }
    return arr
  }

  getWorkflowData = () => {
    const containerEl = ReactDOM.findDOMNode(this.refs.jsplumbContainer)
    const nodeEls = containerEl.querySelectorAll('.jsplumb-node')
    const data = this.workflowData
    data.links = []
    Array.prototype.forEach.call(nodeEls, nodeEl => {
      // cross-browser loop (for Safari)
      const nodeData = data.nodes.find(n => n.id === nodeEl.id)
      nodeData.x = nodeEl.offsetLeft
      nodeData.y = nodeEl.offsetTop
      nodeData.name = nodeEl.innerText
    })
    for (const conn of this.jsp.getAllConnections()) {
      if (conn.canvas.isConnected) {
        const link = {}
        link.id = conn.id
        link.from = conn.source.id
        link.to = conn.target.id
        if (conn.endpoints[0].canvas.src) {
          link.type = conn.endpoints[0].canvas.src.split('/').slice(-1).toString().replace(/\.png/, '')
        }
        data.links.push(link)
      }
    }
    localStorage.setItem('workflowData', JSON.stringify(data))
  }

  clearData = () => {
    localStorage.removeItem('workflowData')
    window.location.reload(true)
  }

  renderNode = node => {
    const nodeStyles = { left: node.x + 'px', top: node.y + 'px' }
    if (node.type === 'GROUP') {
      nodeStyles.width = node.width + 'px'
      nodeStyles.height = node.height + 'px'
    }
    return (
      <div
        id={node.id}
        key={node.id}
        className={node.type === 'GROUP' ? 'jsplumb-node wings-group-node' : 'jsplumb-node'}
        data-shape={node.shape}
        style={nodeStyles}
      >
        <div className={css.nodeIcon} style={{ display: node.type === 'GROUP' ? 'none' : 'inline-block' }}>
          <i
            className={`fa fa-${node.type}`}
            style={{ display: typeof node.type !== 'undefined' ? 'inline-block' : 'none' }}
          />
        </div>
        <div className={css.nodeLabel} style={{ display: node.type === 'GROUP' ? 'none' : 'inline-block' }}>
          {node.name}
        </div>
        <ul className="nodeToolbar">
          <li>
            <i className="fa fa-clone" data-action="CLONE" onClick={this.nodeToolbarBtnClick} data-id={node.id} />
          </li>
          <li>
            <i className="icons8-waste" data-action="DELETE" onClick={this.nodeToolbarBtnClick} data-id={node.id} />
          </li>
        </ul>
      </div>
    )
  }

  render () {
    return (
      <section>
        <div
          ref="jsplumbContainer"
          className="jtk-demo-canvas canvas-wide flowchart-demo jtk-surface jtk-surface-nopan"
          id="canvas"
        >
          <div>
            <button onClick={this.addNode} style={{ margin: '5px' }}>
              New
            </button>
            <button onClick={this.clearData} style={{ margin: '5px' }}>
              Clear
            </button>
          </div>
          {this.state.nodes.map(node => this.renderNode(node))}
        </div>
        {/* <div className={css.infoPanel}>
          <strong>NODE</strong>
          <div>
            {this.state.nodeInfo}
          </div>
        </div> */}

        <ReactTooltip
          ref="reactTooltip"
          id="happyFace"
          type="info"
          place="bottom"
          effect="solid"
          event="click"
          class={css.linkTypeBox}
        >
          <ul>
            <li>
              <img src="/img/workflow/success.png" />Success
            </li>
            <li>
              <img src="/img/workflow/failure.png" />Failure
            </li>
            <li>
              <img src="/img/workflow/fork.png" />Fork
            </li>
            <li>
              <img src="/img/workflow/repeat.png" />Repeat
            </li>
          </ul>
        </ReactTooltip>
      </section>
    )
  }
}

// <div ref="nodeToolbar" className={css.nodeToolbar} onMouseLeave={this.onToolbarMouseOut}>
//   <div><button>X</button></div>
//   <div><button>C</button></div>
// </div>

const rootPath = location.pathname.split('/').slice(0, -1).join('/') + '/'
const PageWithScripts = scriptLoader(rootPath + 'libs/jsplumb/jsplumb-all.min.js')(WorkflowPOCPage)

export default PageWithScripts



// WEBPACK FOOTER //
// ../src/containers/WorkflowPage/WorkflowPOCPage.js