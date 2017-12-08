import React from 'react'
import { Modal } from 'react-bootstrap'
import { BreakdownProgress, Utils } from 'components'
import css from './NodeDetailsModal.css'

export default class NodeDetailsModal extends React.Component {
  state = { data: {} }

  componentWillReceiveProps (newProps) {
    if (newProps.data) {
      this.setState({ data: newProps.data })
    }
  }

  render () {
    const nodeData = this.state.data
    const details = nodeData.executionDetails || {}

    const progress = Utils.getProgressPercentages(nodeData)
    const progressBar = <BreakdownProgress className="__nodeProgress" progress={progress} status={nodeData.status} />

    return (
      <Modal show={this.props.show} onHide={this.props.onHide} className={css.main}>
        <Modal.Header closeButton>
          <Modal.Title>{nodeData.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {progressBar}

          {Object.keys(details).map(key => {
            // if (['hostId', 'hostName', 'templateId', 'templateName'].indexOf(key) >= 0) {
            //   // ignore these fields
            //   return null
            // }
            let val = details[key].value
            if (typeof val === 'string' && val.length > 80) {
              val = val.slice(0, 200) + '...'
            }
            if (typeof val === 'number' && val.toString().length === 13) {
              val = Utils.formatDate(val)
            }
            if (key === 'activityId') {
              const activityId = val
              val = (
                <button className="btn-action" onClick={this.props.onShowActivity.bind(this, activityId)}>
                  <i className="icons8-transaction-list" /> View Activity Logs
                </button>
              )
            }
            return (
              <dl key={key} className="dl-horizontal wings-dl __dl">
                <dt>{details[key].displayName}</dt>
                <dd>{val}</dd>
              </dl>
            )
          })}
        </Modal.Body>
        {/* <Modal.Footer>
         <Button>Close</Button>
         <Button bsStyle='primary'>Save</Button>
         </Modal.Footer> */}
      </Modal>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/WorkflowView/NodeDetailsModal.js