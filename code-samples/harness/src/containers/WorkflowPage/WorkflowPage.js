import React from 'react'
import {
  Confirm,
  WorkflowExecControlBar,
  asyncPoll,
  CompUtils,
  Utils,
  createPageContainer,
  PageBreadCrumbs
} from 'components'
import NotificationSystem from 'react-notification-system'
import scriptLoader from 'react-async-script-loader'
// import { Link } from 'react-router'
// import ActivityModal from '../ActivityPage/ActivityModal'
import NodeDetailsPanel from '../WorkflowView/NodeDetailsPanel'
// import WorkflowView from '../WorkflowView/WorkflowView'
import DeploymentDetailsView from '../WorkflowView/DeploymentDetailsView'
import apis from 'apis/apis'
import css from './WorkflowPage.css'
import StencilModal from '../WorkflowEditor/StencilModal.js'
import { WorkflowService } from 'services'
import 'split-view'

const getEndpoint = (envId, id, expandedGroupIdArr, action, targetId) => {
  // appId may be empty here => // TODO: fix "ERROR: uuid may not be empty"
  let endpoint = 'executions' + (id ? '/' + id : '') + '?'
  endpoint = envId ? `${endpoint}&appId=${Utils.appIdFromUrl()}&envId=${envId}&expandedGroupId=ALL` : endpoint
  if (expandedGroupIdArr instanceof Array) {
    for (const id of expandedGroupIdArr) {
      endpoint += id ? '&expandedGroupId=' + id : ''
    }
  }
  if (action && typeof action === 'string') {
    endpoint += `&nodeOps=${action}&requestedGroupId=${targetId}`
  }
  return endpoint
}
const fetchInitialData = (envId, id, expandedGroupIdArr, action, targetId) => {
  return apis.service.list(getEndpoint(envId, id, expandedGroupIdArr, action, targetId)).catch(error => {
    throw error
  })
}
const fragmentArr = [
  { data: [] } // will be set later
]

class WorkflowPage extends React.Component {
  // TODO: propTypes
  static contextTypes = {
    pubsub: React.PropTypes.object, // isRequired
    catalogs: React.PropTypes.object // isRequired
  }
  pubsubToken = null
  state = {
    workflowData: {},
    scriptsLoaded: false,
    data: {},
    catalogs: {},
    jsplumbLoaded: false,
    selectedNode: null,
    showActivityModal: false,
    autoUpdate: true,
    showAbortConfirm: false,
    stencilModalShow: false,
    stencilModalData: null,
    stencils: {},
    pollingInterval: 3 * 1000 // will be increased automatically when API's slow (previousFetchDuration).
  }
  expandedGroupIds = []
  autoSelectedNode = null
  lastSelectedNode = null
  lastStatus = ''
  pollingFetchDone = false
  firstFetchDone = false
  previousFetchDuration = 0
  isStencilModalRendered = false
  idFromUrl = this.props.urlParams.execId // Utils.getIdFromUrl()
  appIdFromUrl = this.props.urlParams.appId // Utils.appIdFromUrl()
  envIdFromUrl = this.props.urlParams.envId // Utils.envIdFromUrl()

  title = this.renderTitleBreadCrumbs()
  isTitleRendered = false
  pageName = 'Deployment Details'

  componentDidMount () {
    document.body.classList.add('fit-height', 'with-splitter', 'full-width-header')
  }

  componentWillUnmount () {
    document.body.classList.remove('fit-height', 'with-splitter', 'full-width-header')
    Utils.unsubscribeAllPubSub(this)
  }

  componentWillReceiveProps (newProps) {
    if (newProps.isScriptLoaded && !this.props.isScriptLoaded) {
      // load finished
      this.setState({ jsplumbLoaded: true })
    }
  }

  renderTitleBreadCrumbs () {
    const path = this.props.path
    const urlParams = this.props.urlParams
    let workflowName = ''
    const exec = Utils.getJsonValue(this, 'state.data.resource') || {}
    const app = Utils.findByUuid(this.props.dataStore.apps, urlParams.appId)
    if (exec) {
      workflowName = (exec.name || '') + ' (' + Utils.formatDate(exec.startTs) + ')'
      this.isTitleRendered = true
    }
    const bData = [
      { label: 'Deployments', link: path.toDeployments(urlParams) },
      { label: app ? app.name : '' },
      { label: workflowName }
    ]
    return <PageBreadCrumbs data={bData} />
  }

  fetchAllDoneCallback = (allData, apiStartTs) => {
    // if API slow (duration > pollingInterval) => increase "this.pollingInterval" +2 secs more.
    this.previousFetchDuration = new Date().getTime() - apiStartTs // in ms.
    if (this.previousFetchDuration > this.state.pollingInterval) {
      this.setState({ pollingInterval: this.state.pollingInterval + 2000 })
    }
    console.log('Fetch done ', this.previousFetchDuration / 1000, allData)
  }

  fetchData = (expandedGroupIdArr, action, targetId, callback) => {
    this.appIdFromUrl = this.props.urlParams.appId // Utils.appIdFromUrl()
    this.envIdFromUrl = this.props.urlParams.envId // Utils.envIdFromUrl()
    this.idFromUrl = this.props.urlParams.execId // Utils.getIdFromUrl()

    if (!this.appIdFromUrl || !this.envIdFromUrl || !this.idFromUrl) {
      return
    }
    fragmentArr[0].data = [fetchInitialData, this.envIdFromUrl, this.idFromUrl, expandedGroupIdArr, action, targetId]

    // fragmentArr[1].stencils = [apis.fetchOrchestrationStencils, this.appIdFromUrl, this.idFromUrl]
    // after routing back to this component, manually fetch data:
    if (__CLIENT__ && !this.props.data && this.appIdFromUrl && this.envIdFromUrl && this.idFromUrl) {
      const apiStartTs = new Date().getTime()
      Utils.fetchFragmentsToState(
        fragmentArr,
        this,
        (key, data) => {
          // TODO: TEMP Code, the app should auto select the running node, then continue to do so until user clicks.
          if (data.resource.graph) {
            this.showFinalStatus(data.resource.status)
            // this.expandedGroupIds = data.resource.expandedGroupIds

            // auto set selectedNode to the last RUNNING or FAILED command node
            let lastNode = data.resource.graph.nodes[data.resource.graph.nodes.length - 1] || {}
            let failedFound = false
            const nodes = data.resource.graph.nodes
            for (let i = nodes.length - 1; i >= 0; i--) {
              if (!failedFound && (nodes[i].status === 'FAILED' || nodes[i].status === 'WAITING')) {
                failedFound = true
                lastNode = nodes[i] // set to the last Failed Node, but keep looping.
              }
              if (nodes[i].status === 'RUNNING' || nodes[i].status === 'STARTING') {
                // set to the Running Node & exit the loop
                lastNode = nodes[i]
                break
              }
            }
            this.autoSelectedNode = lastNode

            // if (this.lastSelectedNode && selectedNode === this.lastSelectedNode) {
            //   // to avoid flickering, if it's the same selectedNode,
            //   // don't setState (will cause Activity Logs flicker)
            // }
            // after fetching data, if user hasn't selected a node => do auto-select
            if (this.lastSelectedNode) {
              this.setState({ selectedNode: this.lastSelectedNode })
            } else {
              this.setState({ selectedNode: this.autoSelectedNode })
            }
            this.pollingFetchDone = true
            if (!this.firstFetchDone) {
              this.firstFetchDone = true
              this.expandedGroupIds = data.resource.expandedGroupIds
            }
            if (callback) {
              callback()
            }
          }
          if (!this.isTitleRendered) {
            this.props.onPageWillMount(this.renderTitleBreadCrumbs(), 'Page: ' + this.pageName)
          }

          if (data.resource.executionNode) {
            this.showFinalStatus(data.resource.status)

            this.pollingFetchDone = true
            if (!this.firstFetchDone) {
              this.firstFetchDone = true
            }
          }
        }, (allData) => this.fetchAllDoneCallback(allData, apiStartTs)
      )
    } else {
      this.setState(this.props)
    }

    // get Context data (catalogs) & set to state
    if (this.context.catalogs) {
      this.setState({ catalogs: this.context.catalogs })
    } else {
      this.pubsubToken = this.context.pubsub.subscribe('appsEvent', (msg, appData) => {
        this.context.catalogs = appData.catalogs
        this.setState({ catalogs: this.context.catalogs })
      })
    }
  }

  showFinalStatus = currentStatus => {
    if (this.lastStatus === 'RUNNING' && currentStatus === 'FAILED') {
      this.refs.notif.addNotification({
        message: 'Execution not completed',
        level: 'info',
        position: 'bc'
      })
      this.fetchData(this, this.expandedGroupIds) // do the last fetching to make sure it's the latest.
    }
    if (this.lastStatus === 'RUNNING' && currentStatus === 'SUCCESS') {
      this.refs.notif.addNotification({
        message: 'Execution completed',
        level: 'info',
        position: 'bc'
      })
      this.fetchData(this, this.expandedGroupIds) // do the last fetching to make sure it's the latest.
    }
    this.lastStatus = currentStatus
  }

  onSave = data => {
    const body = this.state.data.resource
    body.graph = {
      nodes: data.nodes,
      links: data.links
    }
    apis.service
      .fetch(getEndpoint(this.envIdFromUrl, this.idFromUrl), {
        method: 'PUT',
        body
      })
      .then(() => this.fetchData())
  }

  onGroupClick = (id, expanded) => {
    const action = expanded === true || expanded === 'true' ? 'COLLAPSE' : 'EXPAND'
    const idx = this.expandedGroupIds.indexOf(id)
    if (idx < 0 && action === 'EXPAND') {
      this.expandedGroupIds.push(id)
    } else {
      delete this.expandedGroupIds[idx]
    }
    this.setState({ autoUpdate: false })

    this.fetchData(this.expandedGroupIds, action, id, () => {
      this.setState({ key: Math.random(), autoUpdate: false }) // force refresh current component
    })
  }

  onResumeNode = nodeUuid => {
    apis.service
      .fetch(getEndpoint(this.envIdFromUrl, this.idFromUrl), {
        method: 'PUT',
        body: {
          executionInterruptType: 'RESUME',
          stateExecutionInstanceId: nodeUuid
        }
      })
      .then(() => this.fetchData(this.expandedGroupIds))
  }

  onNodeActionClick = async (action, node) => {
    const nodeUuid = node.id
    const nodeType = node.type

    if (action === 'ABORT_ALL') {
      // Abort Workflow
      this.onAbortClick()
    } else if (action === 'ROLLBACK') {
      // Rollback Workflow
      this.onRollbackClick()
    } else if (action === 'RETRY_WITH_PARAMETERS') {
      const stencils = await this.getStencils()

      if (stencils) {
        const stencilData = stencils.find(s => s.type === nodeType)

        if (stencilData && stencilData.jsonSchema && stencilData.jsonSchema.properties) {
          const stencilModalData = { stencilData, nodeData: node }
          this.action = action

          await this.setState({ stencilModalShow: true, stencilModalData })
        } else {
          // No Stencils Available case
        }
      }
    } else {
      apis.service
        .fetch(getEndpoint(this.envIdFromUrl, this.idFromUrl), {
          method: 'PUT',
          body: {
            executionInterruptType: action,
            stateExecutionInstanceId: nodeUuid
          }
        })
        .then(() => this.fetchData(this.expandedGroupIds))
    }
  }

  getStencils = async () => {
    const { stencils } = await WorkflowService.getStencils({
      appId: this.appIdFromUrl,
      workflowId: this.idFromUrl
    })
    this.setState({ stencils })
    return stencils
  }
  onSubmitForRetryWithParameter = (nodeUuid, formData) => {
    const properties = this.getPropertiesFromFromData(formData)
    apis.service
      .fetch(getEndpoint(this.envIdFromUrl, this.idFromUrl), {
        method: 'PUT',
        body: {
          executionInterruptType: 'RETRY',
          stateExecutionInstanceId: nodeUuid,
          properties
        }
      })
      .then(async () => {
        this.fetchData(this.expandedGroupIds)
        await this.setState({ stencilModalShow: false })
      })
  }
  getPropertiesFromFromData = formData => {
    const properties = {}
    Object.keys(formData).map(property => {
      const value = formData[property]
      if (value && typeof value !== 'object') {
        properties[property] = value
      }
    })
    return properties
  }
  onViewLogs = nodeUuid => {}

  onNodeClick = selectedNode => {
    // if (selectedNode.id === this.autoSelectedNode.id) {
    //   // user clicked back to the auto-selected node => reset the manually selected node => auto play should return.
    //   this.lastSelectedNode = null
    // } else {
    //   this.lastSelectedNode = selectedNode
    // }
    // this.setState({ selectedNode, autoUpdate: false })
    this.lastSelectedNode = selectedNode
    this.setState({ selectedNode })
  }

  onPauseClick = () => {
    const workflow = Utils.getJsonValue(this, 'state.data.resource') || {}
    apis
      .interruptWorkflow(this.props.urlParams.appId, this.props.urlParams.envId, workflow.uuid, 'PAUSE_ALL')
      .then(res => {
        Utils.addNotification(this.refs.notif, 'success', 'Workflow paused!')
        this.fetchData()
      })
  }

  onResumeClick = () => {
    const workflow = Utils.getJsonValue(this, 'state.data.resource') || {}
    apis
      .interruptWorkflow(this.props.urlParams.appId, this.props.urlParams.envId, workflow.uuid, 'RESUME_ALL')
      .then(res => {
        this.workflowStatus = 'RUNNING'
        Utils.addNotification(this.refs.notif, 'success', 'Workflow resumed!')
        this.fetchData()
      })
  }

  onRollbackClick = () => {
    const workflow = Utils.getJsonValue(this, 'state.data.resource') || {}
    apis
      .interruptWorkflow(this.props.urlParams.appId, this.props.urlParams.envId, workflow.uuid, 'ROLLBACK')
      .then(res => {
        Utils.addNotification(this.refs.notif, 'success', 'Workflow rolled back!')
        this.fetchData()
      })
  }

  onAbortClick = () => {
    this.setState({ showAbortConfirm: true })
  }

  onAbortConfirm = () => {
    this.setState({ showAbortConfirm: false })
    const workflow = Utils.getJsonValue(this, 'state.data.resource') || {}
    apis
      .interruptWorkflow(this.props.urlParams.appId, this.props.urlParams.envId, workflow.uuid, 'ABORT_ALL')
      .then(res => {
        Utils.addNotification(this.refs.notif, 'success', 'Workflow aborted!')
        this.fetchData()
      })
  }

  onShowActivity = activityUuid => {
    Utils.hideModal.bind(this)()
    const modalActivity = {
      uuid: activityUuid
    }
    this.setState({ showActivityModal: true, modalActivity })
  }

  pollingCounter = 0
  onPollInterval = Utils.debounce(() => {
    // if (this.workflowStatus === 'RUNNING' && this.state.autoUpdate === true) {
    if (
      this.state.autoUpdate === true &&
      (this.workflowStatus !== 'SUCCESS' &&
        this.workflowStatus !== 'FAILED' &&
        this.workflowStatus !== 'ABORTED' &&
        this.workflowStatus !== 'WAITING')
    ) {
      this.pollingCounter++
      if (this.pollingFetchDone) {
        // console.log('Polling (fetching)... ' + this.pollingCounter)
        this.pollingFetchDone = false
        this.fetchData(this, this.expandedGroupIds)
      } else {
        // console.log('Polling... Last fetching has not been done! ' + this.pollingCounter)
      }
    }
  }, 500)

  // autoUpdateClick = () => {
  //   if (this.state.autoUpdate === false) { // changing to true
  //     this.lastSelectedNode = null
  //   }
  //   this.setState({ autoUpdate: !this.state.autoUpdate })
  // }

  // WorkflowViewWithPolling = asyncPoll(3 * 1000, this.onPollInterval)(WorkflowView)
  DeploymentDetailsViewWithPolling = asyncPoll(this.state.pollingInterval, this.onPollInterval)(DeploymentDetailsView)
  workflowStatus = ''

  toAppSetup = () => {
    // Utils.redirectToApplicationSetupPage.bind(this, this.props.path, this.props.urlParams, workflow.appId)
    const { accountId, appId } = this.props.urlParams
    this.props.router.push(this.props.path.toSetupServices({ accountId, appId }))
  }

  toServiceDetails = service => {
    // Utils.redirectToServiceDetail.bind(this, this.props.path, this.props.urlParams, workflow.appId, service.uuid)
    const { accountId, appId } = this.props.urlParams
    this.props.router.push(this.props.path.toSetupServiceDetails({ accountId, appId, serviceId: service.uuid }))
  }

  getServiceNames = (workflowType, serviceNames) => {
    if (serviceNames && workflowType !== Utils.workflowTypes.BUILD) {
      return serviceNames.map((service, idx) => {
        return (
          <a key={idx} className="value link-color" onClick={() => this.toServiceDetails(service)}>
            {service.name}
            {idx === serviceNames.length - 1 ? '' : <span>{', '}</span>}
          </a>
        )
      })
    } else {
      return <span> N/A </span>
    }
  }

  renderWorkflowHeader = workflow => {
    const serviceNames = []
    // Get service names
    if (workflow.serviceExecutionSummaries) {
      workflow.serviceExecutionSummaries.map(service => {
        serviceNames.push(service.contextElement)
      })
    }

    return (
      <div className="__header" data-name={workflow.name} fill>
        <div className="summary-box-header-kv-pair">
          <span className="key"> Services Deployed: </span>
          {this.getServiceNames(workflow.orchestrationType, serviceNames)}
        </div>

        {/* <span> {workflow.name || workflow.workflowType} </span> */}

        {/* <span>
          {(this.workflowStatus !== 'SUCCESS' && this.workflowStatus !== 'FAILED') && (
            <span className={'light ' + css.topHeaderPipe}> | </span>
          )}
          {this.workflowStatus === 'RUNNING' && (
            <TooltipOverlay tooltip="Pause">
              <i className="lightClickable icons8-pause-filled icon" onClick={this.onPauseClick}></i>
            </TooltipOverlay>
          )}
          {this.workflowStatus === 'PAUSED' && (
            <TooltipOverlay tooltip="Resume">
              <i className="lightClickable icons8-play-filled icon" onClick={this.onResumeClick}></i>
            </TooltipOverlay>
          )}
          {(this.workflowStatus !== 'SUCCESS' && this.workflowStatus !== 'FAILED') && (
            <TooltipOverlay tooltip="Abort">
              <i className="lightClickable icons8-stop-2" onClick={this.onAbortClick}></i>
            </TooltipOverlay>
          )}
        </span> */}
        <WorkflowExecControlBar
          status={this.workflowStatus}
          onPauseClick={this.onPauseClick}
          onResumeClick={this.onResumeClick}
          onAbortClick={this.onAbortClick}
          execWorkflowType={workflow.orchestrationType}
        />
        {/* <button className="btn btn-link" onClick={this.fetchData.bind(this, this.expandedGroupIds)}>
          <i className="icons8-synchronize"></i> Refresh
        </button> */}
      </div>
    )
  }

  renderStencilModal = () => {
    if (!this.isStencilModalRendered) {
      this.isStencilModalRendered = true
      return (
        <StencilModal
          data={this.state.stencilModalData}
          stencils={this.state.stencils}
          show={this.state.stencilModalShow}
          onHide={Utils.hideModal.bind(this, 'stencilModalShow')}
          appId={this.appIdFromUrl}
          // serviceId={} // not sending service id for canary workflow
          enableExpressionBuilder={true}
          context="Execution-RetryWithParams"
          atRunTime={true}
          entityId={this.idFromUrl}
          entityType="WORKFLOW"
          onSubmit={this.onSubmitForRetryWithParameter}
        />
      )
    } else {
      return null
    }
  }

  onToggleFullscreen = nodeDetailsPanelInFullScreen => {
    this.setState({ nodeDetailsPanelInFullScreen })
  }

  render () {
    const workflow = Utils.getJsonValue(this, 'state.data.resource') || {}
    // const WorkflowViewWithPolling = this.WorkflowViewWithPolling
    const DeploymentDetailsViewWithPolling = this.DeploymentDetailsViewWithPolling
    this.workflowStatus = workflow.status

    return (
      <section key={this.state.key} className={css.main}>
        {/* This is being commented out because it does not match the invision design.  */}
        {/* false &&
          <div>
            <div className={css.topHeader}>
              <h5 className={css.header}>
                <Link to={`/app/${this.appIdFromUrl}/env/${this.envIdFromUrl}/executions`}>
                  <span>Deployments</span>
                </Link>
                &nbsp; &#8250; Workflow
              </h5>
            </div>
          </div> */}

        {this.firstFetchDone
          ? null
          : CompUtils.renderLoadingStatus(this, this.state.data.resource, null, 'spinnerLeftMargin32')}
        <split-view vertical full-screen-panel={this.state.nodeDetailsPanelInFullScreen ? 'node-details' : ''}>
          {/* <WorkflowViewWithPolling jsplumbLoaded={this.state.jsplumbLoaded}
                        status="true"
                        fullPage="true"
                        data={workflow}
                        pipeline={workflow}
                        onGroupClick={this.onGroupClick}
                        onResumeNode={this.onResumeNode}
                        onViewLogs={this.onViewLogs}
                        onNodeClick={this.onNodeClick}
                        selectedNode={this.state.selectedNode}
                        autoUpdate={this.state.autoUpdate}
          /> */}
          <DeploymentDetailsViewWithPolling
            data={workflow}
            fullPage={true}
            onNodeClick={this.onNodeClick}
            onResumeNode={this.onResumeNode}
            onNodeActionClick={this.onNodeActionClick}
            header={this.renderWorkflowHeader(workflow)}
            pollingInterval={this.state.pollingInterval}
          />
          <split-divider thin />
          <NodeDetailsPanel
            {...this.props}
            data={this.state.selectedNode}
            onHide={Utils.hideModal.bind(this)}
            onShowActivity={this.onShowActivity}
            onToggleFullscreen={this.onToggleFullscreen}
            appId={this.props.params.appId}
            envId={this.props.params.envId}
          />
        </split-view>
        {/* <ActivityModal
          activity={this.state.modalActivity}
          appId={this.appIdFromUrl}
          envId={this.envIdFromUrl}
          show={this.state.showActivityModal}
          onHide={Utils.hideModal.bind(this, 'showActivityModal')}
        /> */}

        {/* <div className="__autoUpdate">
          <label>
            <input type="checkbox" checked={this.state.autoUpdate} onChange={this.autoUpdateClick} /> Auto refresh
          </label>
        </div> */}

        <Confirm
          visible={this.state.showAbortConfirm}
          onConfirm={this.onAbortConfirm}
          onClose={Utils.hideModal.bind(this, 'showAbortConfirm')}
          body="Are you sure you want to abort this?"
          confirmText="Confirm Abort"
          title="Aborting"
        >
          <button style={{ display: 'none' }} />
        </Confirm>
        {
          <StencilModal
            data={this.state.stencilModalData}
            stencils={this.stencils}
            show={this.state.stencilModalShow}
            onHide={Utils.hideModal.bind(this, 'stencilModalShow')}
            appId={this.appIdFromUrl}
            // serviceId={} // not sending service id for canary workflow
            enableExpressionBuilder={true}
            context="Execution-RetryWithParams"
            atRunTime={true}
            entityId={this.idFromUrl}
            entityType="WORKFLOW"
            onSubmit={this.onSubmitForRetryWithParameter}
          />
        }
        <NotificationSystem ref="notif" />
      </section>
    )
  }
}

const WrappedPage = createPageContainer()(WorkflowPage)
const PageWithScripts = scriptLoader(Utils.getRootUrl() + 'libs/jsplumb/jsplumb-all.min.js')(WrappedPage)
const Page = Utils.createTransmitContainer(PageWithScripts, fragmentArr)

export default Page



// WEBPACK FOOTER //
// ../src/containers/WorkflowPage/WorkflowPage.js