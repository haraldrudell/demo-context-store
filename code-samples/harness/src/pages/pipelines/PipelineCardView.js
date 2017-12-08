import css from './PipelineCardView.css'
import './views/ExecutionStatus.css'

import React from 'react'
import TimeAgo from 'react-timeago'
import StageView from './views/StageView'
import expandableView from 'expandable-view'
import DeploymentCardViewCard from '../../containers/DeploymentPage/views/DeploymentCardViewCard'
import ApprovalCardView from './views/ApprovalCardView'
import { Utils, DeploymentNotes } from 'components'
import { Link } from 'react-router'
import { parallelGrouping, getArtifactsFromExecution } from './PipelineUtils'
import { Intent, Position, Popover, Button } from '@blueprintjs/core'
import { ExecutionService } from '../../services'
import clone from 'clone'
import { Logger } from 'utils'
import ABTest from '../../utils/ABTest'
import { ExecutionStatus, PipelineStageType } from '../../utils/Constants'

const { SUCCESS, RUNNING, PAUSED, PAUSING, QUEUED, WAITING } = ExecutionStatus
const { APPROVAL } = PipelineStageType

export default class PipelineCardView extends React.Component {
  state = {}
  savedNotes = false

  adjustGraphics = () => {
    if (this.expandableView) {
      const view = this.expandableView
      expandableView.update(view, this.isRunning)

      view.querySelectorAll('stage-view hr').forEach((hr, index, hrs) => {
        if (hrs[index + 1]) {
          hr.style.width =
            hrs[index + 1].nextElementSibling.getBoundingClientRect().left -
            hr.nextElementSibling.getBoundingClientRect().left +
            'px'
        }
      })

      const scrollToStage = view.querySelector('stage-view[running][selected]')

      if (scrollToStage) {
        const stageRect = scrollToStage.getBoundingClientRect()
        const viewRect = view.getBoundingClientRect()
        const distance = stageRect.x + stageRect.width - (viewRect.x + viewRect.width)

        if (distance > 0) {
          view.firstChild.scrollLeft += distance
        }
      }
    }
  }

  componentDidMount () {
    this.adjustGraphics()
  }

  componentDidUpdate () {
    this.adjustGraphics()
  }

  componentWillUnmount () {
    expandableView.destroy(this.expandableView)
  }

  getServicesFromExecution (execution) {
    const { serviceExecutionSummaries } = execution
    const services = []

    if (serviceExecutionSummaries && serviceExecutionSummaries.length) {
      serviceExecutionSummaries.forEach(service => services.push(service.contextElement))
    }

    return services
  }

  processAbortExecution = async () => {
    const { execution, routeParams: { accountId }, execution: { pipelineExecution: { pipeline }, appId } } = this.props

    const { status, error } = await ExecutionService.abort({ accountId, appId, execUUID: execution.uuid })
    this.props.onExecutionInterrupted({ type: 'abort', name: pipeline.name, error, status })
  }

  onPauseClick = async _ => {
    const { execution, routeParams: { accountId }, execution: { pipelineExecution: { pipeline }, appId } } = this.props

    const { status, error } = await ExecutionService.pause({ accountId, appId, execUUID: execution.uuid })
    this.props.onExecutionInterrupted({ type: 'pause', name: pipeline.name, error, status })
  }

  onResumeClick = async _ => {
    const { execution, routeParams: { accountId }, execution: { pipelineExecution: { pipeline }, appId } } = this.props

    const { status, error } = await ExecutionService.resume({ accountId, appId, execUUID: execution.uuid })
    this.props.onExecutionInterrupted({ type: 'resume', name: pipeline.name, error, status })
  }

  renderHeaderButtons = _ => {
    const { execution, execution: { status } } = this.props

    const buttons = []
    const {
      uuid,
      appId,
      pipelineExecution: { pipelineId, pipelineStageExecutions },
      executionArgs: { notes }
    } = execution

    const executionParams = {
      execId: uuid,
      appId,
      notes
    }

    if (status === RUNNING) {
      buttons.push(
        <button key="pause" onClick={this.onPauseClick} className="tooltip--top" data-tooltip="Pause">
          <i className="icons8-pause-filled" />
        </button>
      )
    }

    if (ExecutionService.isExecutionEnded(status)) {
      buttons.push(
        <button
          key="rerun"
          onClick={_ => this.props.onRerunClick({ appId, pipelineId, execution })}
          className="tooltip--top"
          data-tooltip="Re-run"
        >
          <i className="icons8-repeat" />
        </button>
      )
      buttons.push(<DeploymentNotes executionParams={executionParams} className={css.depNotes} />)
    } else {
      buttons.push(
        <Popover key="abort-popover" position={Position.TOP} popoverClassName="pipeline-confirm-abort-popover">
          <button key="abort" className="tooltip--top" data-tooltip="Abort">
            <i className="icons8-stop-2" />
          </button>
          <div>
            <p>Are you sure you want to abort this pipeline execution?</p>
            <p>
              <Button intent={Intent.DANGER} className="pt-popover-dismiss" onClick={this.processAbortExecution}>
                Confirm Abort
              </Button>
            </p>
          </div>
        </Popover>
      )
    }

    if (status === PAUSED || status === PAUSING) {
      // Approval should not be resume-able
      if (!pipelineStageExecutions.some(({ stateType, status }) => stateType === APPROVAL && status === PAUSED)) {
        buttons.push(
          <button key="resume" onClick={this.onResumeClick} className="tooltip--top" data-tooltip="Resume">
            <i className="icons8-play-filled" />
          </button>
        )
      }
    }

    return <form-buttons>{buttons}</form-buttons>
  }

  renderCardHeader = _ => {
    const { execution, path, routeParams } = this.props
    const pipeline = execution.pipelineExecution.pipeline
    const services = this.getServicesFromExecution(execution)
    const { appId } = execution
    const { accountId } = routeParams

    const linkSetupServices = path.toSetupServices({ accountId, appId })

    return (
      <header>
        <h5 onClick={_ => console.log(execution)}>
          <Link to={path.toDeploymentDetails({ accountId, appId, execId: execution.uuid })}>
            {pipeline.name}&nbsp;
            <time dateTime={new Date(execution.createdAt)}>{Utils.formatDate(execution.createdAt)}</time>
          </Link>
          {this.renderHeaderButtons()}
        </h5>
        <section className={css.headerSideContent}>
          <label>
            Application:&nbsp;
            <Link to={linkSetupServices}>{execution.appName}</Link>
          </label>
          {services &&
            services.length > 0 && (
              <label className={css.serviceLabel}>
                Services:&nbsp;
                {services
                  .map((service, index) => (
                    <Link
                      key={`pipeline-service-${index + 1}`}
                      to={path.toSetupServiceDetails({ accountId, appId, serviceId: service.uuid })}
                    >
                      {service.name}
                    </Link>
                  ))
                  .reduce((links, link, index, array) => {
                    links.push(link)

                    if (index < array.length - 1) {
                      links.push(<span key={`sep-${index + 1}`}>,&nbsp;</span>)
                    }

                    return links
                  }, [])}
              </label>
            ) // TODO B/E does not send services when execution failed?
          }
        </section>
      </header>
    )
  }

  renderExecutionStatus (execStatus) {
    const status = execStatus.toLowerCase()
    const prop = {}
    prop[status] = true

    return <execution-status {...prop}>{execStatus}</execution-status>
  }

  toggleDeploymentDetails = (execution, workflowExecutions, stageExecution, isRunning, index, triggeredByClick) => {
    this.selectedId = !isRunning && this.selectedId === index ? undefined : index

    this.setState({
      selectedExecution: execution,
      selectedStageExecution: stageExecution,
      selectedWorkflowExecutions: workflowExecutions
    })

    this.triggeredByClick = triggeredByClick && this.selectedId !== undefined
  }

  onApproval = (newStatus, comments, stateExecutionData, selectedExecution) => {
    const approved = newStatus === 'APPROVED'
    stateExecutionData.comments = comments
    this.currentApprovalStatus = this.state.selectedStageExecution.status
    this.state.selectedStageExecution.status = approved ? SUCCESS : newStatus
    stateExecutionData.approvedOn = +new Date()
    stateExecutionData.approvedBy = { name: ' you' }

    // After approval, wait until approval status actually changed from polling data (there's a delay)
    // then continue updating to have a better user experience
    this.stopUpdateUntilApprovalStatusChanged = true
    this.approvalStageIndex = this.selectedId
    delete this.triggeredByClick

    this.forceUpdate()
    this.props.onExecutionInterrupted({})
  }

  shouldComponentUpdate (nextProps) {
    if (this.stopUpdateUntilApprovalStatusChanged) {
      const newApprovalStatus =
        nextProps.execution.pipelineExecution.pipelineStageExecutions[this.approvalStageIndex].status

      if (newApprovalStatus === this.currentApprovalStatus) {
        return false
      }

      delete this.stopUpdateUntilApprovalStatusChanged
      delete this.currentApprovalStatus
      delete this.approvalStageIndex

      // Extra: remove current selected approval so the next running stage shows itself
      delete this.selectedId
      delete this.triggeredByClick

      this.determineAutoSelection(nextProps)
    }

    return true
  }

  renderDeploymentDetails () {
    if (this.selectedId !== undefined) {
      const { selectedExecution, selectedWorkflowExecutions, selectedStageExecution } = this.state
      const workflow = selectedWorkflowExecutions && selectedWorkflowExecutions.length && selectedWorkflowExecutions[0]

      if (selectedExecution && (selectedStageExecution || workflow)) {
        return (
          (selectedStageExecution.stateType === APPROVAL &&
            this.renderApprovalCard(selectedExecution, selectedStageExecution)) ||
          (workflow && this.renderWorkflowCard(workflow)) ||
          this.renderUnknownError()
        )
      }
    }

    return null
  }

  renderWorkflowCard = workflow => {
    const params = {
      onNameClick: item => {
        Utils.redirectToWorkflow(item)
      },
      onPauseClick: this.onPauseClick,
      onResumeClick: this.onResumeClick
    }
    const { props, props: { path, urlParams, router } } = this
    const { uuid, appId, envId } = workflow

    return (
      <DeploymentCardViewCard
        {...props}
        params={params}
        execution={ABTest.isExecutionFetchingOptimizationEnabled ? { uuid, appId, envId } : workflow}
        path={path}
        urlParams={urlParams}
        router={router}
        insidePipeline={true}
      />
    )
  }

  renderApprovalCard = (selectedExecution, selectedStageExecution) => {
    return (
      <ApprovalCardView
        appId={selectedExecution.appId}
        workflowExecId={selectedExecution.uuid}
        approvalId={selectedStageExecution.stateExecutionData.approvalId}
        status={selectedStageExecution.status}
        approvedBy={selectedStageExecution.stateExecutionData.approvedBy}
        approvedOn={selectedStageExecution.stateExecutionData.approvedOn}
        comments={selectedStageExecution.stateExecutionData.comments}
        onClose={(status, comment) =>
          this.onApproval(status, comment, selectedStageExecution.stateExecutionData, selectedExecution)
        }
        onError={message => this.props.toaster.showError({ message })}
      />
    )
  }

  renderUnknownError () {
    return (
      <div>
        <ui-card unknown-error>
          We are not able to retrieve error details for this execution. Please contact Harness team.
        </ui-card>
      </div>
    )
  }

  renderStageViewDescription (stage) {
    let status = null

    if (stage.status === QUEUED) {
      status = stage.estimatedTime ? (
        <small>Estimated Time : {Utils.formatDuration(stage.estimatedTime / 1000)}</small>
      ) : null
    } else if (Utils.isRunning(stage.status)) {
      status = (
        <small>
          Start Time: <TimeAgo date={stage.startTs} minPeriod={30} />
        </small>
      )
    } else if (stage.endTs > 0 && stage.startTs > 0) {
      status = <small>{Utils.formatDuration((stage.endTs - stage.startTs) / 1000)}</small>
    }

    return status
  }

  renderStageViewStatus (stage) {
    const status = {}
    const stageStatus = stage.status.toLowerCase()

    status[stageStatus] = true
    return status
  }

  shouldAutoSelectStage = (stage, pipelineStageExecutions, index) => {
    const { status } = stage
    const hasQueuedData =
      stage.workflowExecutions &&
      stage.workflowExecutions.length &&
      (stage.workflowExecutions[0].status === QUEUED || stage.workflowExecutions[0].status === WAITING)

    if (
      status === RUNNING ||
      ((status === PAUSED && stage.stateType === APPROVAL) || hasQueuedData) ||
      (status === WAITING && hasQueuedData)
    ) {
      // auto-select if no-stage is selected
      if (this.selectedId === undefined && !this.triggeredByClick) {
        return true
      }

      // auto-select if previous running stage changes its status
      if (
        this.selectedId !== undefined &&
        pipelineStageExecutions[this.selectedId].status !== RUNNING &&
        !this.triggeredByClick
      ) {
        return true
      }
    }
  }

  componentWillReceiveProps (props) {
    this.determineAutoSelection(props)
  }

  determineAutoSelection (props) {
    const { execution, autoExpandLastStage } = props
    const pipelineStageExecutions = Utils.getJsonValue(execution, 'pipelineExecution.pipelineStageExecutions')

    this.isRunning = execution.status === RUNNING

    if (pipelineStageExecutions) {
      pipelineStageExecutions.forEach((stage, index) => {
        const { workflowExecutions } = stage

        if (this.shouldAutoSelectStage(stage, pipelineStageExecutions, index)) {
          this.selectedId = index
          this.toggleDeploymentDetails(execution, workflowExecutions, stage, true, index)
        } else if (this.selectedId === index && !this.triggeredByClick && stage.status !== RUNNING) {
          this.toggleDeploymentDetails(execution, workflowExecutions, stage, false, index)
        }

        // Update selected execution data to reflect in detailed view
        if (this.selectedId === index) {
          this.setState({
            selectedExecution: execution,
            selectedStageExecution: stage,
            selectedWorkflowExecutions: workflowExecutions
          })
        }
      })

      // Auto expanding last resolved stage
      if (autoExpandLastStage && this.selectedId === undefined) {
        let index = pipelineStageExecutions.length

        while (index-- > 0) {
          const stage = pipelineStageExecutions[index]

          if (ExecutionService.isExecutionEnded(stage.status)) {
            this.selectedId = index
            this.toggleDeploymentDetails(execution, stage.workflowExecutions, stage, true, index)
            break
          }
        }
      }
    }
  }

  renderHeader (stage, execution, index) {
    return stage.name || (stage.group && 'STAGE ' + stage.group) || 'STAGE ' + (index + 1)
  }

  renderArtifacts = execution => {
    const artifacts = getArtifactsFromExecution(execution)
    let links = <span>None</span>

    if (artifacts && artifacts.length) {
      links = artifacts
        .map((artifact, index) => {
          return (
            <artifact-link key={index}>
              {/* TODO Artifact does not have service uuid so can't create a link to service details for now
              <Link key={index}></Link> */}
              {artifact.artifactSourceName}
              <span key={`artifact-build-${index + 1}`}>&nbsp;(build# {artifact.metadata.buildNo})</span>
            </artifact-link>
          )
        })
        .reduce((links, link, index, array) => {
          links.push(link)

          if (index < array.length - 1) {
            links.push(<span key={`artifact-sep-${index + 1}`}>,&nbsp;</span>)
          }

          return links
        }, [])
    }

    return <artifact-links>&nbsp;&nbsp;- Artifacts Deployed: {links}</artifact-links>
  }

  renderTriggeredBy = execution => {
    const triggeredBy = execution.createdBy

    return (
      <trigger-by>
        Triggered By:&nbsp;<span>{(triggeredBy && triggeredBy.name) || 'Unknown'}</span>
      </trigger-by>
    )
  }

  showNotes = ({ notes, appId, uuid }) => {
    this.props.setNotesModal({ notes, appId, uuid })
  }

  renderCardBody () {
    const { execution } = this.props
    const pipeline = execution.pipelineExecution.pipeline
    const pipelineStageExecutions = execution.pipelineExecution.pipelineStageExecutions
    const setupStages = parallelGrouping(pipeline.pipelineStages, pipelineStageExecutions)

    // Log an error when pipeline has its setup out of sync with its execution
    if (!setupStages || !pipelineStageExecutions || setupStages.length !== pipelineStageExecutions.length) {
      Logger.error('Pipeline execution out of sync with its setup', { uuid: execution.uuid, execution })
    }

    return (
      <section>
        <header>
          <execution-summary>
            {this.renderTriggeredBy(execution)}
            {this.renderArtifacts(execution)}
          </execution-summary>
          {this.renderExecutionStatus(execution.status)}
        </header>
        <expandable-view ref={view => (this.expandableView = view)}>
          <expandable-view-wrapper>
            <expandable-view-content>
              {pipelineStageExecutions.map((executionStage, index) => {
                const setupStage = setupStages[index]
                const { name, group } = setupStage || {}

                // combining name and group from setup with execution info for rendering header
                const _stage = Object.assign(clone(executionStage), { name, group })
                const hasQueuedData =
                  executionStage.workflowExecutions &&
                  executionStage.workflowExecutions.length &&
                  executionStage.workflowExecutions[0].status === QUEUED

                return (
                  <StageView
                    key={index}
                    index={index}
                    editMode={false}
                    type={executionStage.stateType}
                    status={this.renderStageViewStatus(executionStage)}
                    header={this.renderHeader(_stage, execution, index)}
                    parallel={setupStage.parallelAttrs}
                    name={executionStage.stateName}
                    description={this.renderStageViewDescription(executionStage)}
                    selected={this.selectedId === index}
                    hasQueuedData={hasQueuedData}
                    onClick={_ => {
                      this.toggleDeploymentDetails(
                        execution,
                        executionStage.workflowExecutions,
                        executionStage,
                        false,
                        index,
                        true
                      )
                    }}
                  />
                )
              })}
            </expandable-view-content>
          </expandable-view-wrapper>

          <button key="prev">Previous</button>
          <button key="next">Next</button>
        </expandable-view>

        {this.renderDeploymentDetails()}
      </section>
    )
  }

  render () {
    return (
      <ui-card class={css.main}>
        {this.renderCardHeader()}
        {this.renderCardBody()}
      </ui-card>
    )
  }
}



// WEBPACK FOOTER //
// ../src/pages/pipelines/PipelineCardView.js