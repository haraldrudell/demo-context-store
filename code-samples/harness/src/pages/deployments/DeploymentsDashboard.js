import css from './DeploymentsDashboard.css'

import React from 'react'
import {
  UIButton,
  PageBreadCrumbs,
  RecordsFilter,
  createPageContainer,
  WingsModal,
  NoDataCard,
  Utils,
  InfiniteScrollingSpinner
} from 'components'
import { ExecutionService, PipelinesService } from 'services'
import PipelineCardView from '../pipelines/PipelineCardView'
import DeploymentCardViewCard from '../../containers/DeploymentPage/views/DeploymentCardViewCard'
import StartDeploymentModal from '../../containers/ExecutionModal/StartDeploymentModal'
import { Modal } from 'react-bootstrap'
import ExecPipelineModalV2 from '../../containers/ArtifactPage/ExecPipelineModalV2'
import { Intent } from '@blueprintjs/core'
import cache from 'plain-cache'
import { FiltersDataStore, Logger } from 'utils'
import ABTest from '../../utils/ABTest'
import xhr from 'xhr-async'
import { ExecutionType } from '../../utils/Constants'

const POLLING_INTERVAL = 15000 // TODO Do streaming/websocket instead of polling
const POLLING_FOR_RUNNING_INTERVAL = 3000
const { PIPELINE, WORKFLOW } = ExecutionType
const LIMIT = 50
const XHR_GROUP_EXECUTIONS = 'DeploymentsDashboard'
const XHR_GROUP_RUNNING_EXECUTIONS = 'DeploymentsDashboard-running'
const XHR_GROUP_UNRESOLVED = 'DeploymentsDashboard-unresolved'

class DeploymentsDashboard extends React.Component {
  title = <PageBreadCrumbs data={[{ label: 'Deployments' }]} />
  pageName = 'Deployments'
  state = {
    pipelines: [],
    executions: [],
    newDeploymentType: PIPELINE,
    showFilters: false,
    numFiltersApplied: 0,
    selectedExecutionName: null
  }
  pollingTimeoutId
  pollingForRunningTimeoutId
  runningExecIds = [] // used by the polling function to fetch data for Running Execs
  nonEndStateExecUUIDs = []

  async fetchNonEndStateExecutionIds ({ accountId }) {
    xhr.abort(XHR_GROUP_UNRESOLVED)
    this.nonEndStateExecUUIDs = await ExecutionService.fetchNonEndStateExecutionIds({
      accountId,
      group: XHR_GROUP_UNRESOLVED
    })
  }

  async fetchPipelines ({ accountId }) {
    const { pipelines, error, status } = await PipelinesService.getPipelines(accountId)

    if (status !== 401 && error) {
      Logger.error('Failed to fetch pipelines.', { status, error })
    } else {
      this.setState({ pipelines })
    }
  }

  async fetchExecutions ({ accountId, appId, execId }) {
    xhr.abort(XHR_GROUP_EXECUTIONS)

    const filter = `limit=${this.limit}${this.apiFilterParams || ''}`
    const { response, executions, error } = await ExecutionService.fetchExecutions({
      accountId,
      appId,
      execId,
      filter,
      group: XHR_GROUP_EXECUTIONS
    })

    if (error) {
      console.error(`Failed to fetch executions. ${error}`)
    } else {
      const runningExecs = executions.filter(exec => ExecutionService.isExecutionOnGoing(exec.status)) || []
      this.runningExecIds = runningExecs.map(exec => exec.uuid)

      this.setState({ executions })

      if (!this.isFirstFetchDone) {
        this.isFirstFetchDone = true
        this.totalDeployments = response.total
      }
    }
  }

  async fetchRunningExecutions ({ accountId, appId }) {
    xhr.abort(XHR_GROUP_RUNNING_EXECUTIONS)

    if (!this.runningExecIds || this.runningExecIds.length === 0) {
      return {}
    }
    let runningFilter = 'search[0][field]=uuid&search[0][op]=IN'
    for (const execId of this.runningExecIds) {
      runningFilter += '&search[0][value]=' + execId
    }

    const { executions, error } = await ExecutionService.fetchExecutions({
      accountId,
      appId,
      filter: runningFilter,
      group: XHR_GROUP_RUNNING_EXECUTIONS
    })

    if (error) {
      console.error(`Failed to fetch running executions. ${error}`)
    } else {
      for (const exec of executions) {
        // update "state.executions" with the new Running Exec:
        let index = -1
        this.state.executions.map((item, i) => {
          if (item.uuid === exec.uuid) {
            index = i
            return {}
          }
        })
        if (index >= 0) {
          const stateExecs = this.state.executions
          stateExecs[index] = exec
          this.setState({ executions: stateExecs })
        }
      }
      this.setState({ runningExecutions: executions })
    }

    return { error }
  }

  closeFilter = () => this.setState({ showFilters: false })
  toggleFilter = () => this.setState({ showFilters: !this.state.showFilters })

  updateNumFiltersApplied = ({ numFiltersApplied }) => {
    this.setState({ numFiltersApplied })
  }

  infiniteScrollHandler = async done => {
    // Only handle infinite scrolling after first fetch is done, and there's more data on server
    if (!this.isFirstFetchDone || this.limit >= this.totalDeployments) {
      return
    }

    this.setState({ showInfiniteScrollingSpinner: true })
    this.limit += LIMIT

    await this.pollImmediately()
    done()
  }

  startNewDeployment = () => {
    this.setState({ showStartDeploymentModal: true })
    this.pausePolling()
  }

  async fetchData () {
    const { props: { spinner, routeParams: { accountId, appId, execId } } } = this

    if (!this.state.initialized) {
      spinner.show()
      await Promise.all([
        this.fetchExecutions({ accountId, appId, execId }),
        this.fetchPipelines({ accountId })
        // this.fetchNonEndStateExecutionIds({ accountId }) TODO: Optimize this call
      ])
      spinner.hide()
      this.setState({ initialized: true })
      this.startPolling()
      this.startRunningExecsPolling()
    }
  }

  async componentWillMount () {
    /*
    Adding to refetch apps data
    because when there is a new service created it is not
    showing the new one - we have to refresh
    to avoid that refetching apps
    */
    await this.props.dataStore.fetchAllApps()
    const { props: { routeParams: { accountId, appId, execId } } } = this
    const key = `deployments-${accountId}-${appId}-${execId}`
    const cachedData = cache.get(key)

    this.isDetailedPage = !!appId && !!execId

    if (cachedData) {
      this.isFirstFetchDone = true
      this.limit = cachedData.limit
      this.totalDeployments = cachedData.totalDeployments
      this.setState(cachedData.states)
      cache.del(key)
    } else {
      this.isFirstFetchDone = false
      this.limit = LIMIT
    }
  }

  componentWillUnmount () {
    const { props: { routeParams: { accountId, appId, execId } } } = this
    const key = `deployments-${accountId}-${appId}-${execId}`

    clearTimeout(this.pollingTimeoutId)
    clearTimeout(this.pollingForRunningTimeoutId)
    xhr.abort(XHR_GROUP_EXECUTIONS)
    xhr.abort(XHR_GROUP_UNRESOLVED)
    xhr.abort(XHR_GROUP_RUNNING_EXECUTIONS)

    this.scrollEvents.off('scroll:progress')

    const { pipelines, executions } = this.state
    cache.set(
      key,
      {
        states: { pipelines, executions },
        limit: this.limit,
        totalDeployments: this.totalDeployments
      },
      cache.VALID_FOR_30_MINUTES
    )
  }

  componentDidMount () {
    this.scrollEvents = Utils.onScrollDownEvent({
      handler: this.infiniteScrollHandler
    })
  }

  startPolling = () => {
    const { props: { routeParams: { accountId, appId, execId } } } = this
    clearTimeout(this.pollingTimeoutId)

    // No polling if in detailed page, and execution is in resolved/ended state
    if (appId) {
      const { executions } = this.state

      if (executions && executions[0] && ExecutionService.isExecutionEnded(executions[0].status)) {
        return
      }
    }

    this.pollingTimeoutId = setTimeout(async () => {
      await this.fetchExecutions({ accountId, appId, execId })
      this.startPolling()
    }, POLLING_INTERVAL)
  }

  runningExecPollingTimeoutRatio = 1

  startRunningExecsPolling = () => {
    const { props: { routeParams: { accountId, appId, execId } } } = this
    clearTimeout(this.pollingForRunningTimeoutId)

    this.pollingForRunningTimeoutId = setTimeout(async () => {
      const startTime = +new Date()
      const { error } = await this.fetchRunningExecutions({ accountId, appId, execId })
      const fetchTime = +new Date() - startTime

      if (error) {
        this.runningExecPollingTimeoutRatio += 1
      } else if (fetchTime >= POLLING_FOR_RUNNING_INTERVAL) {
        this.runningExecPollingTimeoutRatio = Math.ceil(fetchTime / POLLING_FOR_RUNNING_INTERVAL)
      } else {
        this.runningExecPollingTimeoutRatio = 1
      }

      this.startRunningExecsPolling()
    }, POLLING_FOR_RUNNING_INTERVAL * this.runningExecPollingTimeoutRatio)
  }

  pausePolling = () => {
    clearTimeout(this.pollingTimeoutId)
  }

  pollImmediately = async () => {
    clearTimeout(this.pollingTimeoutId)
    const { props: { routeParams: { accountId, appId, execId } } } = this
    await this.fetchExecutions({ accountId, appId, execId })
    this.setState({ showInfiniteScrollingSpinner: false })
    this.startPolling()
  }

  renderNoData () {
    return (
      <NoDataCard
        message="There are no Deployments."
        buttonText="Start New Deployment"
        onClick={this.startNewDeployment}
      />
    )
  }

  fetchDataAfterFitler = ({ urlParams = '' }) => {
    this.closeFilter()
    this.apiFilterParams = urlParams
    const { props: { routeParams: { accountId, appId, execId } } } = this
    this.fetchExecutions({ accountId, appId, execId })
  }

  renderHeader () {
    if (this.isDetailedPage) {
      return null
    }

    const filterProps = {
      urlParams: this.props.urlParams,
      spinner: this.props.spinner,
      apps: this.props.dataStore.apps,
      onClose: this.closeFilter,
      onRefilter: this.fetchDataAfterFitler,
      updateParentState: this.updateNumFiltersApplied
    }

    const filterMessage = `(${this.state.numFiltersApplied || 0})`
    const filtersActiveClass = this.state.numFiltersApplied > 0 ? 'filters-active' : ''
    const onlyShowIfLocalHost = true || ABTest.isLocalHost

    return (
      <header>
        <widget-header>
          <header-tools>
            <UIButton icon="Start" medium onClick={this.startNewDeployment}>
              Start New Deployment
            </UIButton>

            {onlyShowIfLocalHost && (
              <filter-icon-group class={`${filtersActiveClass}`} onClick={this.toggleFilter}>
                <span className={filtersActiveClass}>
                  <filter-icon class={`icons8-filter ${filtersActiveClass}`} />
                </span>
                <filter-message>{filterMessage}</filter-message>
              </filter-icon-group>
            )}
          </header-tools>
          <RecordsFilter {...filterProps} showFilters={this.state.showFilters} store={FiltersDataStore} />
        </widget-header>
      </header>
    )
  }

  toggleDeploymentType = type => {
    const { newDeploymentType } = this.state

    if (newDeploymentType !== type) {
      this.setState({ newDeploymentType: type })
    }
  }

  onDeploymentModalHide = () => {
    this.pollImmediately()
    this.setState({
      isRerunWorkflow: false,
      showStartDeploymentModal: false,
      selectedExecution: null,
      selectedAppId: null,
      selectedPipelineId: null,
      workflowRerunData: {}
    })
  }

  deployWorkflow = async formData => {
    if (this.state.showStartDeploymentModal) {
      // this.setState({ showStartDeploymentModal: false })
      this.onDeploymentModalHide()

      const { error } = await ExecutionService.deployWorkflow({
        appId: formData.applicationId,
        envId: formData.environment,
        workflowId: formData.orchestrationWorkflow,
        artifacts: formData.artifacts,
        executionCredential: formData.executionCredential,
        workflowVariables: formData.workflowVariables,
        notes: formData.notes
      })

      if (error) {
        this.props.toaster.showError({ message: error })
      } else {
        this.setState({ showStartDeploymentModal: false })
        this.pollImmediately()
      }
    }
  }

  deployPipeline = async formData => {
    if (this.state.showStartDeploymentModal) {
      this.setState({
        showStartDeploymentModal: false,
        selectedExecution: null,
        selectedPipelineId: null,
        selectedAppId: null
      })

      const { toaster } = this.props
      const { error } = await ExecutionService.deployPipeline({
        appId: formData.appId,
        workflowId: formData.pipelineSelect,
        artifacts: Utils.mapToUuidArray(formData.artifacts),
        notes: formData.notes
      })

      if (error) {
        toaster.showError({ message: error })
      } else {
        toaster.showSuccess({ message: 'Pipeline execution has been started.', timeout: 2500 })
        this.pollImmediately()
      }
    }
  }

  rerunPipeline = ({ appId: selectedAppId, pipelineId: selectedPipelineId, execution: selectedExecution }) => {
    this.pausePolling()
    this.setState({
      showStartDeploymentModal: true,
      newDeploymentType: PIPELINE,
      selectedAppId,
      selectedPipelineId,
      selectedExecution
    })
  }

  generateWorkflowRerunData = deployment => {
    const data = {}

    if (deployment) {
      data['applicationId'] = deployment.appId
      data['envId'] = deployment.envId
      data['orchestrationWorkflow'] = deployment.workflowId
      // check if artifacts are available
      data['artifacts'] = deployment.executionArgs.artifacts
        ? deployment.executionArgs.artifacts.map(artifact => artifact.uuid)
        : []
      /* Send workflow variables only when it is available */
      if (deployment.executionArgs.workflowVariables) {
        data['workflowVariables'] = deployment.executionArgs.workflowVariables
      }
    }

    return data
  }

  rerunWorkflow = deployment => {
    const workflowRerunData = this.generateWorkflowRerunData(deployment)
    this.pausePolling()
    this.setState({
      isRerunWorkflow: true,
      showStartDeploymentModal: true,
      newDeploymentType: WORKFLOW,
      workflowRerunData
    })
  }

  onExecutionInterrupted = ({ type, name, error, status, workflowType = 'workflow' }) => {
    const { toaster } = this.props
    this.pollImmediately()

    if (error) {
      toaster.clear()
      toaster.show({
        message: `Failed to ${type} execution of ${workflowType} "${name}". ${error} (status: ${status})`,
        intent: Intent.DANGER,
        timeout: 0
      })
    }
  }

  getTitle = () => {
    const { isRerunWorkflow, selectedPipelineId, selectedExecutionName } = this.state

    let title = 'Rerun'

    if (isRerunWorkflow) {
      title += ` Workflow- ${selectedExecutionName}`
    } else if (selectedPipelineId) {
      title += ` Pipeline-${selectedExecutionName}`
    } else {
      title = 'Start New Deployment'
    }

    return title
  }

  updateSelectedExecutionName = selectedAttribute => {
    this.setState({ selectedExecutionName: selectedAttribute })
  }

  showRadioButtonSection = () => {
    const { isRerunWorkflow, selectedPipelineId } = this.state
    if (isRerunWorkflow || selectedPipelineId) {
      return false
    } else {
      return true
    }
  }

  renderDeploymentSection = (pipelineOptionProps, workflowOptionProps) => {
    const isVisible = this.showRadioButtonSection()
    if (isVisible) {
      return (
        <deployment-selection>
          <label>
            <input
              type="radio"
              {...pipelineOptionProps}
              name="type"
              value={PIPELINE}
              onClick={() => this.toggleDeploymentType(PIPELINE)}
              onChange={this.noop}
            />Deploy by executing a Pipeline (recommended)
          </label>
          <label>
            <input
              type="radio"
              {...workflowOptionProps}
              name="type"
              value={WORKFLOW}
              onClick={() => this.toggleDeploymentType(WORKFLOW)}
              onChange={this.noop}
            />Execute a Workflow directly
          </label>
        </deployment-selection>
      )
    } else {
      return <div />
    }
  }

  render () {
    const {
      props,
      props: { router, path, routeParams },
      state: { initialized, pipelines, executions, newDeploymentType }
    } = this
    const CHECKED = { checked: true }
    const pipelineOptionProps = newDeploymentType === PIPELINE && CHECKED
    const workflowOptionProps = newDeploymentType === WORKFLOW && CHECKED

    const params = {
      onRerunClick: this.rerunWorkflow,
      onPauseClick: this.onPauseClick,
      onResumeClick: this.onResumeClick,
      onAbortClick: this.onAbortClick,
      onRollbackClick: this.onRollbackClick
    }

    return (
      <deployments-dashboard detailed-page={this.isDetailedPage}>
        {this.renderHeader()}

        {initialized && (!executions || !executions.length) && this.renderNoData()}

        {executions.map(execution => {
          const { workflowType } = execution

          return (
            (workflowType === PIPELINE && (
              <PipelineCardView
                key={execution.uuid}
                {...props}
                path={path}
                router={router}
                routeParams={routeParams}
                key={execution.uuid}
                execution={execution}
                pipelines={pipelines}
                onRerunClick={this.rerunPipeline}
                onExecutionInterrupted={this.onExecutionInterrupted}
                autoExpandLastStage={this.isDetailedPage}
              />
            )) ||
            (workflowType === WORKFLOW && (
              <DeploymentCardViewCard
                key={execution.uuid}
                {...props}
                params={params}
                execution={execution}
                renderedInline={false}
                path={path}
                urlParams={this.props.urlParams}
                router={router}
                shouldHandleExecutionInterruptedInternally={true}
                onExecutionInterrupted={({ type, name, error, status }) =>
                  this.onExecutionInterrupted({ type, name, error, status, workflowType: 'pipeline' })
                }
                onRerunClick={() => this.rerunWorkflow({ execution })}
              />
            ))
          )
        })}

        {this.state.showStartDeploymentModal && (
          <WingsModal
            show={this.state.showStartDeploymentModal}
            onHide={this.onDeploymentModalHide}
            className={css.modal}
          >
            <Modal.Header closeButton>
              <Modal.Title>{this.getTitle()}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {this.renderDeploymentSection(pipelineOptionProps, workflowOptionProps)}
              <pipeline-deployment-form {...pipelineOptionProps}>
                <ExecPipelineModalV2
                  {...this.props}
                  show={this.state.showStartDeploymentModal}
                  pipelines={pipelines}
                  accountId={this.props.urlParams.accountId}
                  appId={this.state.selectedAppId}
                  pipelineId={this.state.selectedPipelineId}
                  execution={this.state.selectedExecution}
                  onSubmit={this.deployPipeline}
                  renderAsSubForm={true}
                  getExecutionName={this.updateSelectedExecutionName}
                />
              </pipeline-deployment-form>
              <workflow-deployment-form {...workflowOptionProps}>
                <StartDeploymentModal
                  {...this.props}
                  apps={this.props.dataStore.apps}
                  onSubmit={this.deployWorkflow}
                  show={this.state.showStartDeploymentModal}
                  data={this.state.workflowRerunData}
                  isRerun={this.state.isRerunWorkflow}
                  renderAsSubForm={true}
                  getExecutionName={this.updateSelectedExecutionName}
                />
              </workflow-deployment-form>
            </Modal.Body>
          </WingsModal>
        )}
        {this.state.showInfiniteScrollingSpinner && <InfiniteScrollingSpinner />}
      </deployments-dashboard>
    )
  }
}

export default createPageContainer()(DeploymentsDashboard)



// WEBPACK FOOTER //
// ../src/pages/deployments/DeploymentsDashboard.js