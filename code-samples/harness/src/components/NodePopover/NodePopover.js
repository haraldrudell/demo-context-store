import React from 'react'
import ReactDOM from 'react-dom'
import { Overlay, Popover } from 'react-bootstrap'
import Utils from '../Utils/Utils'
import CompUtils from '../Utils/CompUtils'
import css from './NodePopover.css'

class NodePopover extends React.Component {
  onShow = () => {
    if (this.props.params) {
      const nodePopoverEl = ReactDOM.findDOMNode(this.refs.nodePopover)
      nodePopoverEl.style.left = this.props.params.left
      nodePopoverEl.style.top = this.props.params.top

      if (parseInt(nodePopoverEl.style.left) < 10) {
        nodePopoverEl.style.left = '10px'
      }
    }
  }

  render () {
    const nodeData = this.props.data
    const details = nodeData.executionDetails || {}
    const progress = Utils.getProgressPercentages(nodeData)

    let status
    if (Utils.isRunning(nodeData.status)) {
      status = (
        <dl className="dl-horizontal wings-dl __dl">
          <dt>Progress</dt>
          <dd>{progress.sumPct} %</dd>
        </dl>
      )
    } else {
      status = (
        <dl className="dl-horizontal wings-dl __dl">
          <dt>Status</dt>
          <dd className="error-text">{CompUtils.renderStatusIcon(nodeData.status, true)}</dd>
        </dl>
      )
    }

    if (!nodeData.executionSummary || !nodeData.executionDetails) {
      return null
    }
    const summary = (
      <div>
        <h3 className="__title">{nodeData.name}</h3>
        {status}

        {Object.keys(details).map(key => {
          if (key === 'breakdown') {
            return null
          }
          if (key === 'activityId') {
            return null
          }
          let val = details[key].value
          if (typeof val === 'string' && val.length > 200) {
            val = val.slice(0, 200) + '...'
          }
          if (typeof val === 'number' && val.toString().length === 13) {
            val = Utils.formatDate(val)
          }
          // if (key === 'activityId') {
          //   const activityId = val
          //   val = <button onClick={this.props.onShowActivity.bind(this, activityId)}>View Activity Logs</button>
          // }
          return (
            <dl key={key} className="dl-horizontal wings-dl __dl">
              <dt>{details[key].displayName}</dt>
              <dd>{val.toString()}</dd>
            </dl>
          )
        })}
      </div>
    )

    return (
      <Overlay
        show={this.props.show}
        target={this.props.target}
        placement="bottom"
        container={this.props.container}
        containerPadding={20}
        onEntering={this.onShow}
      >
        <Popover id="nodePopover" ref="nodePopover" className={css.main} onClick={this.props.onClose}>
          {summary}
        </Popover>
      </Overlay>
    )
  }
}

export default NodePopover



// WEBPACK FOOTER //
// ../src/components/NodePopover/NodePopover.js