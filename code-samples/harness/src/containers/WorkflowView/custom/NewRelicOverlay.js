import React from 'react'
import ReactDOM from 'react-dom'
import { Overlay, Popover } from 'react-bootstrap'
import { CompUtils, Utils } from 'components'
import css from './AppDynamicsOverlay.css'

class NewRelicOverlay extends React.Component {
  onShow = () => {
    if (this.props.params) {
      const popoverEl = ReactDOM.findDOMNode(this.refs.popoverEl)
      popoverEl.style.left = this.props.params.left
      popoverEl.style.top = this.props.params.top
    }
  }

  formatMetric = (metricData, valueField) => {
    // if API does not return a metric & type => use these default types
    const DEFAULT_TYPES = {
      averageResponseTime: 'TIME_MS',
      response95th: 'TIME_MS',
      error: 'RATE',
      throughput: 'RATE',
      apdexScore: 'RATE'
    }
    let ret = metricData && typeof metricData[valueField] !== 'undefined' ? metricData[valueField] : -1
    const type = Utils.getJsonValue(DEFAULT_TYPES, metricData.name || 'error') || 'COUNT'

    const val = Math.round(ret)
    if (type === 'COUNT') {
      ret = Math.round(ret)
    } else if (type === 'TIME_MS') {
      ret = val > 999 ? Math.round(val / 1000) + 's' : val + 'ms'
    } else if (type === 'TIME_S') {
      ret = Math.round(ret) + 's'
    } else if (type === 'RATE') {
      ret = ret.toFixed(2)
    } else {
      ret = Math.round(ret)
    }
    // console.log(`- ${valueField}: `, val)
    ret = val === -1 || ret === '-1' ? <span className="light">Not available</span> : ret
    return ret
  }

  renderContent = () => {
    const btName = Utils.getJsonValue(this, 'props.params.btName') || ''
    const metric = Utils.getJsonValue(this, 'props.params.metric') || ''
    const item = Utils.getJsonValue(this, 'props.params.item')
    if (!item) {
      return null
    }
    const metricData = item.metricValues.find(v => v.name === metric)
    const risk = metricData ? metricData.riskLevel : ''

    // console.log('- metricData: ', metricData)
    const oldValue = this.formatMetric(metricData, 'controlValue')
    const newValue = this.formatMetric(metricData, 'testValue')
    return (
      <div>
        <div>
          Web Transaction: <span className="bold">{btName}</span>
        </div>
        <div>&nbsp;</div>

        <div>
          {metric} Value: <span className="bold">{newValue}</span>
        </div>
        <div>
          Previous Value: <span className="bold">{oldValue}</span>
        </div>
        <div>&nbsp;</div>

        <div>
          Risk: {CompUtils.renderRiskLevel(risk)}
        </div>
      </div>
    )
  }

  render () {
    return (
      <Overlay
        show={this.props.show}
        target={this.props.target}
        placement="top"
        container={this.props.container}
        containerPadding={20}
        onEntering={this.onShow}
      >
        <Popover id="popoverEl" ref="popoverEl" className={css.main} onClick={this.props.onClose}>
          {this.renderContent()}
        </Popover>
      </Overlay>
    )
  }
}

export default NewRelicOverlay



// WEBPACK FOOTER //
// ../src/containers/WorkflowView/custom/NewRelicOverlay.js