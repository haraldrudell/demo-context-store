import React from 'react'
import TooltipOverlay from '../TooltipOverlay/TooltipOverlay'
import css from './WorkflowExecControlBar.css'
import Utils from '../Utils/Utils'
import DeploymentNotes from '../DeploymentNotes/DeploymentNotes'
import { Intent, Position, Popover, Button } from '@blueprintjs/core'

class WorkflowExecControlBar extends React.Component {
  state = {
    showPopOver: false,
    deploymentNotes: null
  }

  componentWillMount () {
    const { notes } = this.props

    this.setState({ deploymentNotes: notes })
    this.executionNotes = notes
  }

  componentWillRecieveProps (newProps) {}

  renderNotesIcon = () => {
    /* Passing only required params execid,appid and notes */
    return <DeploymentNotes executionParams={this.props.executionParams} />
  }

  render () {
    const { shouldOpenAbortConfirmation, execWorkflowType } = this.props
    const status = this.props.status || ''
    let pause = null

    if (status === 'RUNNING') {
      pause = (
        <TooltipOverlay tooltip="Pause">
          <i className="lightClickable icons8-pause-filled icon" onClick={this.props.onPauseClick} />
        </TooltipOverlay>
      )
    }

    let resume = null
    if (status === 'PAUSED' || status === 'PAUSING') {
      resume = (
        <TooltipOverlay tooltip="Resume">
          <i className="lightClickable icons8-play-filled icon" onClick={this.props.onResumeClick} />
        </TooltipOverlay>
      )
    }

    let abort = null
    let rollbackIcon = null
    if (status !== 'SUCCESS' && status !== 'FAILED' && status !== 'ABORTED') {
      abort = (shouldOpenAbortConfirmation && (
        <Popover position={Position.TOP} popoverClassName="pipeline-confirm-abort-popover">
          <TooltipOverlay tooltip="Abort">
            <i className="lightClickable icons8-stop-2" />
          </TooltipOverlay>
          <div>
            <p>Are you sure you want to abort this workflow execution?</p>
            <p>
              <Button intent={Intent.DANGER} className="pt-popover-dismiss" onClick={this.props.onAbortClick}>
                Confirm Abort
              </Button>
            </p>
          </div>
        </Popover>
      )) || (
          <TooltipOverlay tooltip="Abort">
            <i className="lightClickable icons8-stop-2" onClick={this.props.onAbortClick} />
          </TooltipOverlay>
        )
      {
        /* Build workflow should not have rollback icon */
      }
      rollbackIcon =
        (shouldOpenAbortConfirmation &&
          execWorkflowType !== Utils.workflowTypes.BUILD && (
            <Popover position={Position.TOP} popoverClassName="pipeline-confirm-abort-popover">
              <TooltipOverlay tooltip="Rollback">
                <i className="lightClickable icons8-recurring-appointment" />
              </TooltipOverlay>
              <div>
                <p>Are you sure you want to rollback this workflow execution?</p>
                <p>
                  <Button intent={Intent.DANGER} className="pt-popover-dismiss" onClick={this.props.onRollbackClick}>
                    Confirm Rollback
                  </Button>
                </p>
              </div>
            </Popover>
          )) ||
        (execWorkflowType !== Utils.workflowTypes.BUILD && (
          <TooltipOverlay tooltip="Rollback">
            <i className="lightClickable icons8-recurring-appointment icon" onClick={this.props.onRollbackClick} />
          </TooltipOverlay>
        ))
    }

    let rerun = null
    let deploymentNotes = null
    const isDeploymentsPage = window.location.href.includes('/deployments') && !window.location.href.includes('/detail')
    if (isDeploymentsPage && (status === 'SUCCESS' || status === 'FAILED' || status === 'ABORTED')) {
      rerun = (
        <TooltipOverlay tooltip="Re-run">
          <i className="lightClickable icons8-repeat icon" onClick={this.props.onRerunClick} />
        </TooltipOverlay>
      )
      deploymentNotes = this.renderNotesIcon()
    }

    // let rollback = null
    // if (isDeploymentsPage && (status === 'SUCCESS' || status === 'FAILED' || status === 'ABORTED')) {
    //   rollback = (
    //     <TooltipOverlay tooltip="Rollback">
    //       <i className="lightClickable icons8-recurring-appointment icon" onClick={this.props.onRollbackClick}></i>
    //     </TooltipOverlay>
    //   )
    // }

    return (
      <span className={css.main + ' ' + this.props.className}>
        {pause}
        {resume}
        {abort}
        {rollbackIcon}
        {rerun}
        {deploymentNotes}
      </span>
    )
  }
}

export default WorkflowExecControlBar



// WEBPACK FOOTER //
// ../src/components/Workflow/WorkflowExecControlBar.js