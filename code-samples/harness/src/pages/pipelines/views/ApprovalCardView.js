import React from 'react'
import { Utils } from 'components'
import { Button } from 'react-bootstrap'
import TimeAgo from 'react-timeago'
import css from './ApprovalCardView.css'
import { ExecutionService } from 'services'

export default class ApprovalCardView extends React.Component {
  state = {
    comments: ''
  }

  onCommentsChange = ev => {
    this.setState({ comments: ev.target.value })
  }

  onApprove = async () => {
    const { appId, workflowExecId, approvalId } = this.props
    const comments = this.state.comments
    const { error } = await ExecutionService.approve({ appId, workflowExecId, approvalId, comments })

    if (error) {
      this.props.onError(`Failed to approve execution. Error: ${error}`)
    } else {
      this.props.onClose('APPROVED', comments)
    }
  }

  onAbort = async () => {
    const { appId, workflowExecId, approvalId } = this.props
    const comments = this.state.comments
    const { error } = await ExecutionService.reject({ appId, workflowExecId, approvalId, comments })

    if (error) {
      this.props.onError(`Failed to abort execution. Error: ${error}`)
    } else {
      this.props.onClose('ABORTED', comments)
    }
  }

  renderContent = () => {
    const { status, approvedOn, approvedBy, comments } = this.props

    let content = ''
    if (Utils.isSuccess(status) || status === 'APPROVED' || status === 'ABORTED') {
      content = (
        <div className="col-md-12 wings-card-col">
          {comments} (<TimeAgo date={approvedOn} minPeriod={30} />){' '}
          {approvedBy && approvedBy.name && 'by ' + approvedBy.name}
        </div>
      )
    } else {
      content = (
        <div className="col-md-12 wings-card-col">
          <div>Comment:</div>
          <div>
            <textarea
              className={'form-control ' + css.comments}
              value={this.state.comments}
              onChange={this.onCommentsChange}
            />
          </div>
          <div className={css.buttons}>
            <Button bsStyle={'primary ' + css.approveBtn} onClick={this.onApprove}>
              Approve
            </Button>
            <span className={'wings-text-link ' + css.abort} onClick={this.onAbort}>
              Abort
            </span>
          </div>
        </div>
      )
    }
    return content
  }

  render () {
    const { status, approvedOn, approvedBy } = this.props
    const title = Utils.isSuccess(status) || status === 'APPROVED'
      ? 'Approved'
      : status === 'ABORTED' ? 'Aborted' : 'Needs Approval'

    const attentionIcon = status === 'PAUSED' ? <i className="icons8-attention status-PAUSED icon" /> : null

    return (
      <div key={approvedOn} className={`col-md-12 wings-card-col ${css.main} ${this.props.className}`}>
        <div className={`box-solid wings-card __card __card-status-${status}`}>
          <div className="box-header with-border">
            <div className="wings-card-header">
              {attentionIcon} {title}
            </div>

            <div className="__close" onClick={this.props.onClose}>
              <i className="icons8-delete" />
            </div>
          </div>
          {(status !== 'ABORTED' || approvedBy) && <div className="box-body">{this.renderContent()}</div>}
        </div>
      </div>
    )
  }
}



// WEBPACK FOOTER //
// ../src/pages/pipelines/views/ApprovalCardView.js