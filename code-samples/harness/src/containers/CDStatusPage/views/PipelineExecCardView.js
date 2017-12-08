import React from 'react'
import TimeAgo from 'react-timeago'
import { AppStorage, CompUtils, Utils, WingsIcons } from 'components'
import { Popover, OverlayTrigger } from 'react-bootstrap'
// import DeploymentSummary from '../../DeploymentPage/views/DeploymentSummary'
import DeploymentCardViewCard from '../../DeploymentPage/views/DeploymentCardViewCard'
import ApprovalCardView from './ApprovalCardView'
import css from './PipelineExecCardView.css'
import apis from 'apis/apis'

export default class PipelineExecCardView extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired,
    ...Utils.getDefaultContextTypes()
  }
  state = {
    jsplumbLoaded: false,
    executions: [],
    pipelines: [],
    execWorkflowShow: {}, // example: execWorkflowShow[ 'exec1_uuid' ] = workflowExec object
    isApproving: false // when user clicked on "Approval" to approve
  }
  lastExecStatus = {} // lastExecStatus = { execUuid1: 'RUNNING', execUuid2: 'SUCCESS', ... }
  lastClickedWorkflowExec = null

  componentWillMount () {
    this.setState({
      executions: this.props.executions,
      pipelines: this.props.pipelines
    })
  }

  // check if a workflowExec belongs to PipelineExec and NOT RUNNING.
  checkFinishedWorkflowExecInPipelineExec = (exec, workflowExec) => {
    let found = false
    if (!Utils.isRunning(workflowExec.status)) {
      for (const stageExec of exec.pipelineStageExecutions) {
        for (const wfExec of stageExec.workflowExecutions) {
          if (wfExec.uuid === workflowExec.uuid && !Utils.isRunning(wfExec.status)) {
            found = true
          }
        }
      }
    }
    return found
  }

  showExecWorkflow = (executions, execUuid, execWorkflowShow) => {
    const exec = executions.find(exec => exec.uuid === execUuid)
    // if Exec is NOT in RUNNING (just finished), or in PAUSED state
    if (
      (Utils.isRunning(exec.status) === false && this.lastExecStatus[execUuid] === 'RUNNING') ||
      Utils.isRunning(exec.status) ||
      exec.status === 'PAUSED' ||
      exec.status === 'PAUSING'
    ) {
      // show Workflow Card (update execWorkflowShow)
      for (const stage of exec.pipelineStageExecutions) {
        if (stage.workflowExecutions && stage.workflowExecutions.length > 0) {
          execWorkflowShow[execUuid] = stage.workflowExecutions[0]
        }
      }
    }
  }

  componentWillReceiveProps (newProps) {
    // from newProps, update 'this.state.execWorkflowShow'
    // This also get executed when polling:
    const execWorkflowShow = this.state.execWorkflowShow
    if (this.state.isApproving) {
      return // when user clicked on "Approval" to approve => don't auto update "execWorkflowShow"
    }
    for (const execUuid in this.state.execWorkflowShow) {
      const exec = newProps.executions.find(exec => exec.uuid === execUuid)
      if (exec) {
        if (Utils.isRunning(exec.status)) {
          // if Exec is RUNNING & last-selected-stageExec is NOT RUNNING => show Workflow Card
          if (this.checkFinishedWorkflowExecInPipelineExec(exec, this.lastClickedWorkflowExec)) {
            return
          }
        }
        // check & update execWorkflowShow to show execWorkflow.
        this.showExecWorkflow(newProps.executions, execUuid, execWorkflowShow)
        this.lastExecStatus[execUuid] = exec.status
      }
    }
    this.setState({
      pipelines: newProps.pipelines,
      executions: newProps.executions,
      execWorkflowShow: execWorkflowShow
    })
  }

  onStageExecNameClick = (exec, workflowExec, callback) => {
    const openedWorkflow = this.state.execWorkflowShow[exec.uuid]
    if (workflowExec.stateName === 'Approval' && workflowExec.status === 'PAUSED') {
      this.setState({ isApproving: true })
    } else {
      this.setState({ isApproving: false })
    }

    // toggle to show/hide workflows
    if (workflowExec && openedWorkflow) {
      if (workflowExec.uuid === openedWorkflow.uuid) {
        delete this.state.execWorkflowShow[exec.uuid]
      } else {
        this.state.execWorkflowShow[exec.uuid] = workflowExec
      }
    } else {
      this.state.execWorkflowShow[exec.uuid] = workflowExec
    }
    this.setState({ execWorkflowShow: this.state.execWorkflowShow }, () => {
      callback ? callback() : ''
      this.lastClickedWorkflowExec = this.state.execWorkflowShow[exec.uuid]
    })
  }

  getWorkflowExec = workflowExecId => {
    const items = Object.keys(this.state.execWorkflowShow)
    let showingExec = null
    for (const itemId of items) {
      if (this.state.execWorkflowShow[itemId].uuid === workflowExecId) {
        showingExec = this.state.execWorkflowShow[itemId]
      }
    }
    return showingExec
  }

  onPauseClick = workflowExecId => {
    const showingWorkflowExec = this.getWorkflowExec(workflowExecId)
    return apis
      .interruptWorkflow(showingWorkflowExec.appId, showingWorkflowExec.envId, showingWorkflowExec.uuid, 'PAUSE_ALL')
      .then(res => {})
  }

  onResumeClick = workflowExecId => {
    const showingWorkflowExec = this.getWorkflowExec(workflowExecId)
    return apis
      .interruptWorkflow(showingWorkflowExec.appId, showingWorkflowExec.envId, showingWorkflowExec.uuid, 'RESUME_ALL')
      .then(res => {})
  }

  onAbortClick = workflowExecId => {
    const showingWorkflowExec = this.getWorkflowExec(workflowExecId)
    return apis
      .interruptWorkflow(showingWorkflowExec.appId, showingWorkflowExec.envId, showingWorkflowExec.uuid, 'ABORT_ALL')
      .then(res => {})
  }

  autoExpandApprovalExec = (exec, stage) => {
    if (!exec || !stage) {
      return
    }
    const expandApprovalExecId = AppStorage.get('expandApprovalExecId')
    if (exec.uuid === expandApprovalExecId) {
      if (Utils.checkMultiCalls('autoExpandApprovalExec', 3000)) {
        return
      }
      setTimeout(() => {
        this.onStageExecNameClick(exec, stage.stateExecutionData)
        AppStorage.remove('expandApprovalExecId')
      }, 500)
    }
  }

  renderStage = (exec, stage, idx) => {
    const showingWorkflow = this.state.execWorkflowShow ? this.state.execWorkflowShow[exec.uuid] : null
    let timeTitle
    let timeValue
    if (stage.status === 'QUEUED') {
      timeTitle = <div className="light">Estimated Time</div>
      if (stage.estimatedTime) {
        timeValue = (
          <div>
            {Utils.formatDuration(stage.estimatedTime / 1000)}
          </div>
        )
      } else {
        timeValue = <div>-</div>
      }
    } else if (Utils.isRunning(stage.status)) {
      timeTitle = <div className="light">Start Time</div>
      timeValue = (
        <div>
          <TimeAgo date={stage.startTs} minPeriod={30} />
        </div>
      )
    } else if (Utils.isSuccess(stage.status)) {
      const text = stage.stateType === 'APPROVAL' ? 'Approval Time' : 'Deployment Time'
      timeTitle = (
        <div className="light">
          {text}
        </div>
      )
      timeValue = (
        <div>
          {Utils.formatDuration((stage.endTs - stage.startTs) / 1000)}
        </div>
      )
    } else {
      timeTitle = <div className="light">&nbsp;</div>
      timeValue = <div>&nbsp;</div>
    }

    let linkEl
    if (stage.workflowExecutions && stage.workflowExecutions.length > 0) {
      const workflowExec = stage.workflowExecutions[0]
      // const activeCss = (showingWorkflow && showingWorkflow.envId === workflowExec.envId ? '__active' : '')
      const activeCss = showingWorkflow && showingWorkflow.uuid === workflowExec.uuid ? '__active' : ''
      linkEl = (
        <div
          className={`wings-text-link __envName ${activeCss}`}
          onClick={() => this.onStageExecNameClick(exec, workflowExec)}
        >
          {CompUtils.renderStatusIcon(workflowExec.status)}{' '}
          {workflowExec.name.split(':')[1] + ' (' + workflowExec.envName + ')'}
        </div>
      )
    } else if (stage.stateType === 'APPROVAL') {
      const activeCss = showingWorkflow && showingWorkflow.stateName === 'Approval' ? '__active' : ''
      const title = Utils.isSuccess(stage.status) ? 'Approved' : 'Needs Approval'

      let attentionIcon = CompUtils.renderStatusIcon(stage.status)
      if (stage.status === 'PAUSED') {
        attentionIcon = <i className="icons8-attention status-PAUSED icon" />
      }
      if (Utils.isSuccess(stage.status)) {
        const approveOn = Utils.getJsonValue(stage, 'stateExecutionData.approvedOn')
        const popover = (
          <Popover id="popover-positioned-bottom" title="Approval">
            <div>
              <div>
                <span className="light">Approved by </span>
                {Utils.getJsonValue(stage, 'stateExecutionData.approvedBy.name')}
              </div>
              <div>
                <span className="light">on </span>
                {Utils.formatDate(approveOn)}
              </div>
            </div>
          </Popover>
        )
        linkEl = (
          <OverlayTrigger trigger="click" rootClose={true} overlay={popover}>
            <div className={`wings-text-link __envName ${activeCss}`}>
              {attentionIcon} {title}
            </div>
          </OverlayTrigger>
        )
      } else if (stage.status === 'ABORTED') {
        linkEl = (
          <div className={`wings-text-link __envName ${activeCss}`}>
            {attentionIcon} {title}
          </div>
        )
      } else {
        linkEl = (
          <div
            className={`wings-text-link __envName ${activeCss}`}
            onClick={() => this.onStageExecNameClick(exec, stage.stateExecutionData)}
          >
            {attentionIcon} {title}
          </div>
        )
      }
      this.autoExpandApprovalExec(exec, stage)
    } else {
      linkEl = (
        <div className="__envName">
          <i className="icons8-circle-thin icon" />
          {stage.stateName}
        </div>
      )
    }
    // stage.stateType: "APPROVAL"  .stateName "Approval"
    // stage.stateExecutionData
    // stage.stateExecutionData.stateName "Approval"

    let pipeEndEl
    if (idx === exec.pipelineStageExecutions.length - 1) {
      pipeEndEl = <div className={`__pipeEnd __pipeEnd${stage.status}`} />
    }

    return (
      <div key={idx} className="wings-card-col __col">
        {timeTitle}
        {timeValue}
        <div className="__pipeBox">
          <div className={`__pipe __pipe${stage.status}`}>
            <span>STAGE</span>
            {idx + 1}
          </div>
          {pipeEndEl}
        </div>
        {linkEl}
      </div>
    )
  }

  renderArtifactList = exec => {
    const allArtifacts = []
    for (const stageExec of exec.pipelineStageExecutions) {
      const workflowExecs = stageExec.workflowExecutions || []
      for (const wfExec of workflowExecs) {
        const wfArtifacts = wfExec.executionArgs.artifacts || []
        for (const artifact of wfArtifacts) {
          allArtifacts.push(artifact)
        }
      }
    }
    const renderedArtifacts = {}
    return (
      <div className="__artifactTitle">
        {allArtifacts.map(artifact => {
          if (renderedArtifacts[artifact.uuid]) {
            return null
          }
          renderedArtifacts[artifact.uuid] = true
          return (
            <div className="__artifactName" key={artifact.uuid}>
              {artifact.artifactSourceName} (build# {artifact.metadata.buildNo})
            </div>
          )
        })}
      </div>
    )
  }

  onApprovalClose = (exec, showingWorkflow, newStatus) => {
    if (newStatus === 'APPROVED' || newStatus === 'ABORTED') {
      // after approving/aborting, close ApprovalCardView & reset the flag:
      this.onStageExecNameClick(exec, showingWorkflow, () => {
        this.setState({ isApproving: false })
      })
    } else {
      this.onStageExecNameClick(exec, showingWorkflow)
    }
  }

  render () {
    const executions = this.state.executions || []

    return (
      <div className={`row ${css.main}`}>
        <div className={'row'}>
          {executions &&
            executions.length > 0 &&
            executions.map(exec => {
              let workflowCard
              const showingWorkflow = this.state.execWorkflowShow ? this.state.execWorkflowShow[exec.uuid] : null
              const params = {
                onNameClick: item => {
                  Utils.redirectToWorkflow(item)
                },
                onPauseClick: this.onPauseClick,
                onResumeClick: this.onResumeClick,
                onAbortClick: this.onAbortClick
              }
              if (showingWorkflow) {
                if (showingWorkflow.stateType === 'APPROVAL') {
                  workflowCard = (
                    <ApprovalCardView
                      exec={exec}
                      execWorkflow={showingWorkflow}
                      appId={exec.appId}
                      onClose={newStatus => this.onApprovalClose(exec, showingWorkflow, newStatus)}
                    />
                  )
                } else {
                  workflowCard = (
                    <DeploymentCardViewCard
                      {...this.props}
                      params={params}
                      execution={showingWorkflow}
                      title={
                        <span>
                          {showingWorkflow.envName} - {showingWorkflow.name}
                        </span>
                      }
                      className={`__execDetailsCard __execDetailsStatus_${showingWorkflow.status}`}
                      onClose={() => this.onStageExecNameClick(exec, showingWorkflow)}
                      path={this.props.path}
                      urlParams={this.props.urlParams}
                      router={this.props.router}
                    />
                  )
                }
              }

              let totalTimeTitle
              let totalTimeValue
              if (Utils.isRunning(exec.status)) {
                totalTimeTitle = <div className="light">Estimated Time</div>
                totalTimeValue = (
                  <div>
                    {Utils.formatDuration(exec.estimatedTime / 1000)}
                  </div>
                )
              } else {
                totalTimeTitle = <div className="light">Total Time</div>
                if (exec.endTs === null) {
                  totalTimeValue = (
                    <div>
                      {Utils.formatDuration((exec.createdAt - exec.startTs) / 1000)}
                    </div>
                  )
                } else {
                  totalTimeValue = (
                    <div>
                      {Utils.formatDuration((exec.endTs - exec.startTs) / 1000)}
                    </div>
                  )
                }
              }
              this.renderArtifactList(exec)

              return (
                <div key={exec.uuid} className="col-md-12 wings-card-col">
                  <div className={'box-solid wings-card __card'}>
                    <div className="box-header with-border">
                      <div className="wings-card-header">
                        <div>
                          {exec.pipeline.name}
                        </div>
                        <span className="__execStatus">
                          <TimeAgo date={exec.createdAt} minPeriod={30} />
                          <span> - </span>
                          <span>
                            {Utils.formatDate(exec.lastUpdatedAt)}
                          </span>
                          <span> - </span>
                          {/* WingsIcons.renderStatusIcon(exec.status, '__svg-overview')*/}
                          <span className={exec.status}>
                            {/* WingsIcons.renderStatusIcon(exec.status)*/}
                            {CompUtils.renderStatusIcon(exec.status, true)}
                          </span>
                        </span>
                      </div>
                    </div>
                    <div className="box-body">
                      <div className="__pipes">
                        <div className="wings-card-col __col">
                          <div className="light">Start Time</div>
                          <div>
                            <TimeAgo date={exec.createdAt} minPeriod={30} />
                          </div>
                          <div className="__pipeArrow" />
                          <div className="__iconBox">
                            <WingsIcons.Artifact />
                          </div>
                          {this.renderArtifactList(exec)}
                        </div>
                        {exec.pipelineStageExecutions.map((stage, idx) => this.renderStage(exec, stage, idx))}

                        <div className="wings-card-col __col">
                          {totalTimeTitle}
                          {totalTimeValue}
                          <div className="__pipeArrow __pipeArrowRight" />
                          {WingsIcons.renderStatusIcon(exec.status, '__svg-contentview')}
                          <div className="__execPipeStatus">
                            {CompUtils.renderStatusText(exec.status)}
                          </div>
                        </div>
                      </div>

                      {workflowCard}
                    </div>
                  </div>
                </div>
              )
            })}
        </div>
      </div>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/CDStatusPage/views/PipelineExecCardView.js