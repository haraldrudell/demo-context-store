import React from 'react'
import ReactDOM from 'react-dom'
import { WingsIcons, CompUtils, Utils } from 'components'
import NewRelicOverlay from './NewRelicOverlay'
import { VerificationService } from 'services'
import css from './AppDynamicsVerification3.css'

class AppDynamicsVerification extends React.Component {
  state = {
    metricsData: {},
    anomalousCount: 0,
    overlayShow: false,
    overlayTarget: null,
    overlayParams: null
  }
  pollingHandler = null
  overlayShowTimer = null

  componentWillMount () {
    this.pollData()
  }

  componentWillUnmount () {
    clearTimeout(this.pollingHandler)
  }

  pollData () {
    this.fetchData()
    this.pollingHandler = setTimeout(() => {
      this.pollData()
    }, 3000)
  }

  async fetchData () {
    const nodeData = this.props.nodeData
    const stateExecutionId = Utils.getJsonValue(nodeData, 'executionSummary.stateExecutionInstanceId.value')
    if (stateExecutionId) {
      const { accountId, appId, execId } = this.props.urlParams
      const { resource } = await VerificationService.fetchAppDynamicsMetrics({
        accountId,
        appId,
        stateExecutionId,
        execId
      })
      const metricsData = resource
      let anomalousCount = 0
      for (const btName in metricsData.btMetricsMap) {
        if (metricsData.btMetricsMap[btName].btRisk === 'HIGH') {
          anomalousCount++
        }
      }
      this.setState({ metricsData, anomalousCount })
    }
  }

  closeOverlay = () => {
    if (this.overlayShowTimer) {
      clearTimeout(this.overlayShowTimer)
    }
    this.setState({ overlayShow: false })
  }

  onCircleMouseOver = (ev, overlayParams) => {
    const nodeEl = Utils.findParentByChild(ev.nativeEvent.target, '.' + css.riskCircle)

    this.overlayShowTimer = setTimeout(() => {
      this.setState({ overlayShow: true, overlayTarget: nodeEl, overlayParams })
    }, 300)
  }

  onCircleMouseOut = () => {
    this.closeOverlay()
  }

  render () {
    const btMetricsMap = Utils.getJsonValue(this, 'state.metricsData.metricAnalyses') || []
    const riskLevel = Utils.getJsonValue(this, 'state.metricsData.riskLevel') || ''
    const riskMessages = Utils.getJsonValue(this, 'state.metricsData.riskMessages') || []
    const message = Utils.getJsonValue(this, 'state.metricsData.message') || []

    return (
      <div className={css.main}>
        <h3>Business Transaction Analysis</h3>
        <div>
          Overall Risk Level
          <span style={{ marginLeft: 20 }}>{CompUtils.renderRiskLevel(riskLevel, riskMessages)}</span>
        </div>
        {riskLevel === 'HIGH' && <div className={css.anomalous}>{message}</div>}

        <table className={css.mainTable}>
          <tbody>
            <tr className={css.row + ' ' + css.headerRow}>
              <td className={css.col1}>Stalls</td>
              <td className={css.col2}>Response Time(95%)</td>
              <td className={css.col3}>Slow</td>
              <td className={css.col4}>Error</td>
              <td className={css.col5}>Business Transaction</td>
            </tr>
            {btMetricsMap.map(item => {
              const btName = item.metricName
              const radius = 3
              const stalls = item.metricValues.find(v => v.name === 'stalls') || {}
              const response95th = item.metricValues.find(v => v.name === 'response95th') || {}
              const slowCalls = item.metricValues.find(v => v.name === 'slowCalls') || {}
              const errorMap = item.metricValues.find(v => v.name === 'error') || {}
              return (
                <tr key={btName} className={css.row}>
                  <td className={css.col1}>
                    <WingsIcons.RiskCircle
                      className={css.riskCircle + ' ' + css['riskCircle' + stalls.riskLevel]}
                      radius={radius}
                      onMouseOver={ev => this.onCircleMouseOver(ev, { btMetricsMap, item, btName, metric: 'stalls' })}
                      onMouseOut={ev => this.onCircleMouseOut()}
                    />
                  </td>
                  <td className={css.col2}>
                    <WingsIcons.RiskCircle
                      className={css.riskCircle + ' ' + css['riskCircle' + response95th.riskLevel]}
                      radius={radius}
                      onMouseOver={ev =>
                        this.onCircleMouseOver(ev, { btMetricsMap, item, btName, metric: 'response95th' })}
                      onMouseOut={ev => this.onCircleMouseOut()}
                    />
                  </td>
                  <td className={css.col3}>
                    <WingsIcons.RiskCircle
                      className={css.riskCircle + ' ' + css['riskCircle' + slowCalls.riskLevel]}
                      radius={radius}
                      onMouseOver={ev =>
                        this.onCircleMouseOver(ev, { btMetricsMap, item, btName, metric: 'slowCalls' })}
                      onMouseOut={ev => this.onCircleMouseOut()}
                    />
                  </td>
                  <td className={css.col4}>
                    <WingsIcons.RiskCircle
                      className={css.riskCircle + ' ' + css['riskCircle' + errorMap.riskLevel]}
                      radius={radius}
                      onMouseOver={ev => this.onCircleMouseOver(ev, { btMetricsMap, item, btName, metric: 'error' })}
                      onMouseOut={ev => this.onCircleMouseOut()}
                    />
                  </td>
                  <td className={css.col5} title={btName}>
                    {btName}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        <NewRelicOverlay
          target={() => ReactDOM.findDOMNode(this.state.overlayTarget)}
          container={this}
          show={this.state.overlayShow}
          params={this.state.overlayParams}
          onClose={this.closeOverlay}
        />
      </div>
    )
  }
}

export default AppDynamicsVerification



// WEBPACK FOOTER //
// ../src/containers/WorkflowView/custom/AppDynamicsVerification3.js