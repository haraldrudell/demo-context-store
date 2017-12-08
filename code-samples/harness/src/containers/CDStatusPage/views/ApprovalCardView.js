import React from 'react'
import { Utils } from 'components'
import { Button } from 'react-bootstrap'
import TimeAgo from 'react-timeago'
import css from './ApprovalCardView.css'
import apis from 'apis/apis'

export default class ApprovalCardView extends React.Component {
  state = {
    comments: ''
  }

  onCommentsChange = ev => {
    this.setState({ comments: ev.target.value })
  }

  onApprove = () => {
    const item = this.props.execWorkflow
    const approvalId = Utils.getJsonValue(item, 'executionSummary.approvalId.value') || ''

    if (approvalId) {
      apis
        .approvePipelineExec(this.props.appId, this.props.exec.workflowExecutionId, approvalId, this.state.comments)
        .then(r => {
          this.props.onClose('APPROVED')
        })
    }
  }

  onAbort = () => {
    const item = this.props.execWorkflow
    const approvalId = Utils.getJsonValue(item, 'executionSummary.approvalId.value') || ''

    if (approvalId) {
      apis
        .approvePipelineExec(
          this.props.appId,
          this.props.exec.workflowExecutionId,
          approvalId,
          this.state.comments,
          'REJECT'
        )
        .then(r => {
          this.props.onClose('ABORTED')
        })
    }
  }

  renderContent = () => {
    const item = this.props.execWorkflow

    let content = ''
    if (Utils.isSuccess(item.status)) {
      content = (
        <div className="col-md-12 wings-card-col">
          {item.comments} (<TimeAgo date={item.approvedOn} minPeriod={30} />)
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
    const item = this.props.execWorkflow
    const title = Utils.isSuccess(item.status) ? 'Approved' : 'Needs Approval'
    const attentionIcon = item.status === 'PAUSED' ? <i className="icons8-attention status-PAUSED icon" /> : null

    return (
      <div key={item.approvedOn} className={`col-md-12 wings-card-col ${css.main} ${this.props.className}`}>
        <div className={`box-solid wings-card __card __card-status-${item.status}`}>
          <div className="box-header with-border">
            <div className="wings-card-header">
              {attentionIcon} {title}
            </div>

            <div className="__close" onClick={this.props.onClose}>
              <i className="icons8-delete" />
            </div>
          </div>
          <div className="box-body">{this.renderContent()}</div>
        </div>
      </div>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/CDStatusPage/views/ApprovalCardView.js