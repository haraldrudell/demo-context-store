import React from 'react'
import ReactDOM from 'react-dom'
import { WingsIcons, CompUtils, Utils } from 'components'
import NewRelicOverlay from './NewRelicOverlay'
import NewRelicChartModal from './NewRelicChartModal'
import apis from 'apis/apis'
import css from './AppDynamicsVerification3.css'

class NewRelicVerification extends React.Component {
  state = {
    metricsData: {},
    anomalousCount: 0,
    overlayShow: false,
    overlayTarget: null,
    overlayParams: null,
    chartModalShow: false,
    chartModalData: {}
  }
  stateExecutionInstanceId = ''
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

  fetchData () {
    const nodeData = this.props.nodeData
    this.stateExecutionInstanceId = Utils.getJsonValue(nodeData, 'executionSummary.stateExecutionInstanceId.value')
    if (this.stateExecutionInstanceId) {
      const { accountId, appId, execId } = this.props.urlParams
      apis.fetchNewRelicMetrics(accountId, appId, this.stateExecutionInstanceId, execId).then(res => {
        const metricsData = res.resource
        let anomalousCount = 0
        for (const btName in metricsData.btMetricsMap) {
          if (metricsData.btMetricsMap[btName].btRisk === 'HIGH') {
            anomalousCount++
          }
        }
        this.setState({ metricsData, anomalousCount })
      })
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

  onCircleClick = data => {
    const { accountId, execId } = this.props.urlParams

    const chartModalData = {
      accountId,
      workFlowExecutionId: execId,
      stateExecutionId: this.stateExecutionInstanceId,
      transactionName: data.transactionName, // ex: JSP/index.jsp
      metricName: data.metricName // ex: averageResponseTime
    }
    this.setState({ chartModalShow: true, chartModalData })
  }

  render () {
    const btMetricsMap = Utils.getJsonValue(this, 'state.metricsData.metricAnalyses') || []
    const riskLevel = Utils.getJsonValue(this, 'state.metricsData.riskLevel') || ''
    const riskMessages = Utils.getJsonValue(this, 'state.metricsData.riskMessages') || []
    const message = Utils.getJsonValue(this, 'state.metricsData.message') || []

    return (
      <div className={css.main} data-name="verification-details">
        <h3>Web Transaction Analysis</h3>
        <div>
          Overall Risk Level
          <span style={{ marginLeft: 20 }} data-name="overall-risk-level">
            {CompUtils.renderRiskLevel(riskLevel, riskMessages)}
          </span>
        </div>
        {riskLevel === 'HIGH' &&
          <div className={css.anomalous} data-name="risk-level-message">
            {message}
          </div>}

        <table className={css.mainTable} data-name="metric-analysis-details-table">
          <tbody>
            <tr className={css.row + ' ' + css.headerRow} data-name="metric-analysis-details-header">
              <td className={css.col1} data-name="apdex-score">
                Apdex Score
              </td>
              <td className={css.col2} data-name="response-time">
                Response Time(Avg)
              </td>
              <td className={css.col3} data-name="requestsPerMinute">
                Requests Per Min
              </td>
              <td className={css.col4} data-name="error">
                Error
              </td>
              <td className={css.col5} data-name="business-transaction">
                Web Transaction
              </td>
            </tr>
            {btMetricsMap.map(item => {
              const btName = item.metricName
              const radius = 3
              const apdexScoreMap = item.metricValues.find(v => v.name === 'apdexScore') || {}
              const avgTimeMap = item.metricValues.find(v => v.name === 'averageResponseTime') || {}
              const requestsPerMinuteMap = item.metricValues.find(v => v.name === 'requestsPerMinute') || {}
              const errorMap = item.metricValues.find(v => v.name === 'error') || {}
              return (
                <tr key={btName} className={css.row} data-name={btName}>
                  <td className={css.col1} data-name={'apdex-score' + '_risk_' + apdexScoreMap.riskLevel}>
                    <WingsIcons.RiskCircle
                      className={css.riskCircle + ' ' + css['riskCircle' + apdexScoreMap.riskLevel]}
                      radius={radius}
                      onMouseOver={ev =>
                        this.onCircleMouseOver(ev, { btMetricsMap, item, btName, metric: apdexScoreMap.name })}
                      onMouseOut={ev => this.onCircleMouseOut()}
                      onClick={() =>
                        this.onCircleClick({ btMetricsMap, transactionName: btName, metricName: apdexScoreMap.name })}
                    />
                  </td>
                  <td className={css.col2} data-name={'response-time' + '_risk_' + avgTimeMap.riskLevel}>
                    <WingsIcons.RiskCircle
                      className={css.riskCircle + ' ' + css['riskCircle' + avgTimeMap.riskLevel]}
                      radius={radius}
                      onMouseOver={ev =>
                        this.onCircleMouseOver(ev, { btMetricsMap, item, btName, metric: avgTimeMap.name })}
                      onMouseOut={ev => this.onCircleMouseOut()}
                      onClick={() =>
                        this.onCircleClick({ btMetricsMap, transactionName: btName, metricName: avgTimeMap.name })}
                    />
                  </td>
                  <td className={css.col3} data-name={'requestsPerMinute' + '_risk_' + requestsPerMinuteMap.riskLevel}>
                    <WingsIcons.RiskCircle
                      className={css.riskCircle + ' ' + css['riskCircle' + requestsPerMinuteMap.riskLevel]}
                      radius={radius}
                      onMouseOver={ev =>
                        this.onCircleMouseOver(ev, { btMetricsMap, item, btName, metric: requestsPerMinuteMap.name })}
                      onMouseOut={ev => this.onCircleMouseOut()}
                      onClick={() =>
                        this.onCircleClick({
                          btMetricsMap,
                          transactionName: btName,
                          metricName: requestsPerMinuteMap.name
                        })}
                    />
                  </td>
                  <td className={css.col4} data-name={'error' + '_risk_' + errorMap.riskLevel}>
                    <WingsIcons.RiskCircle
                      className={css.riskCircle + ' ' + css['riskCircle' + errorMap.riskLevel]}
                      radius={radius}
                      onMouseOver={ev =>
                        this.onCircleMouseOver(ev, { btMetricsMap, item, btName, metric: errorMap.name })}
                      onMouseOut={ev => this.onCircleMouseOut()}
                      onClick={() =>
                        this.onCircleClick({ btMetricsMap, transactionName: btName, metricName: errorMap })}
                    />
                  </td>
                  <td className={css.col5} title={btName} data-name="business-transaction">
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

        {this.state.chartModalShow &&
          <NewRelicChartModal
            data={this.state.chartModalData}
            show={true}
            onHide={() => this.setState({ chartModalShow: false })}
          />}
      </div>
    )
  }
}

export default NewRelicVerification



// WEBPACK FOOTER //
// ../src/containers/WorkflowView/custom/NewRelicVerification.js