import React from 'react'
import { Utils } from 'components'

export default class NodeElementStatusSummary extends React.Component {
  render () {
    const nodeData = this.props.nodeData

    let countStr = ''
    let durationStr = ''
    if (nodeData.elementStatusSummary && nodeData.elementStatusSummary.length > 0) {
      const countTotal = nodeData.elementStatusSummary.length
      const elementType = nodeData.elementStatusSummary[0].contextElement.elementType
      switch (elementType) {
        case 'HOST': countStr = (countTotal > 1 ? 'Hosts' : 'Host')
          break
        case 'INSTANCE': countStr = (countTotal > 1 ? 'Instances' : 'Instance')
          break
        case 'SERVICE': countStr = (countTotal > 1 ? 'Services' : 'Service')
          break
        case 'PARTITION': countStr = (countTotal > 1 ? 'Phases' : 'Phase')
          break
        default: countStr = (countTotal > 1 ? 'Items' : 'Item')
      }
      countStr = countTotal + ' ' + countStr
      if (elementType === 'PARTITION') {
        let totalInstances = 0
        for (const summ of nodeData.elementStatusSummary) {
          totalInstances += summ.instancesCount
        }
        countStr += ', ' + totalInstances + (totalInstances > 1 ? ' Instances' : ' Instance')
      }

      const durationSecs =
        Math.round((nodeData.executionDetails.endTs.value - nodeData.executionDetails.startTs.value) / 1000)
      durationStr = 'Execution Time: ' + Utils.formatDuration(durationSecs)
    }

    let statusIcon = <i className="icons8-checked" />
    if (nodeData.status === 'FAILED') {
      statusIcon = <i className="icons8-high-priority" />
    }

    return (
      <div className={this.props.className} style={this.props.styleObj}>
        {statusIcon}
        <div>{countStr}</div>
        <div>{durationStr}</div>
      </div>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/WorkflowView/NodeElementStatusSummary.js