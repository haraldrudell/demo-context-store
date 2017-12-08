import React from 'react'
import { Button, Modal } from 'react-bootstrap'
import { WingsModal, WingsIcons } from 'components'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { VerificationService } from 'services'
import css from './NewRelicChartModal.css'

export default class NewRelicChartModal extends React.Component {
  state = {
    data: []
  }

  onHide = () => {
    this.props.onHide()
  }

  async componentWillMount () {
    // const { accountId, workFlowExecutionId, stateExecutionInstanceId, transactionName, metricName } = this.props.data
    if (this.props.data.data) {
      this.setState({ data: this.props.data.data })
    } else {
      const { resource, error } = await VerificationService.fetchNewRelicChartData(this.props.data)
      if (!error) {
        this.setState({ data: resource || [] })
        console.log('resource: ', resource)
      }
    }
  }

  render () {
    const { data = [] } = this.state
    const { transactionName, metricName } = this.props.data
    console.log('data: ', data)

    return (
      <WingsModal show={true} onHide={this.onHide}>
        <Modal.Header closeButton>
          <Modal.Title>
            Web Transaction: <strong>{transactionName}</strong>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className={css.content}>
            <div className={css.header}>
              <div>
                <span className={css.label}>Metric Name:</span>
                <strong>
                  {metricName}
                </strong>
              </div>
              <div>
                <span className={css.label}>Baseline Host:</span>
                <strong>
                  {data.length > 0 && data[0].controlHostName}
                </strong>
              </div>
            </div>

            {data.map(d => {
              const chartData = []
              for (let i = 0; i < d.testValues.length; i += 1) {
                chartData.push({
                  name: '', // 'T' + i,
                  ['Test Host']: d.testValues[i],
                  ['Control Host']: d.controlValues[i]
                })
              }
              // chartData = [
              //   { name: 'T1', testHost: 0, controlHost: 0.9 },
              //   { name: 'T2', testHost: 0.7, controlHost: 0.5 },
              //   { name: 'T3', testHost: 1591, controlHost: 0.401 }
              // ]
              return (
                <div>
                  <div className={css.chartHeader}>
                    <div>
                      <span className={css.label}>Test Host:</span>
                      {d.testHostName}
                      <WingsIcons.RiskCircle
                        className={css.riskCircle + ' ' + css['riskCircle' + d.riskLevel]}
                        radius={3}
                      />
                    </div>
                  </div>
                  <LineChart
                    width={600}
                    height={300}
                    data={chartData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <XAxis dataKey="name" label="Time" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Line type="monotone" dataKey="Test Host" stroke="var(--color-blue)" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="Control Host" stroke="#82ca9d" />
                  </LineChart>
                </div>
              )
            })}
          </div>
          <div>
            <Button onClick={this.props.onHide}>Close</Button>
          </div>
        </Modal.Body>
      </WingsModal>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/WorkflowView/custom/NewRelicChartModal.js