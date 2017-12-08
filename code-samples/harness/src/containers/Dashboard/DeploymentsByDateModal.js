import React from 'react'
import { Utils } from 'components'
import { Modal } from 'react-bootstrap'
import { DeploymentsList } from 'components'
import apis from 'apis/apis'
import css from './DeploymentsByDateModal.css'

const fragmentArr = [{ executions: [] }]

class DeploymentsByDateModal extends React.Component {
  state = {}

  fetchData = () => {
    if (this.propsData.startTime) {
      const appId = this.propsData.appId
      const startTime = this.propsData.startTime
      const after24h = startTime + 86400000 // 24 hours (in milliseconds)
      fragmentArr[0].executions = [apis.fetchExecutionsByTimeRange, appId, startTime, after24h]
    }

    if (__CLIENT__ && !this.propsData.data) {
      Utils.fetchFragmentsToState(fragmentArr, this)
    } else {
      this.setState(this.propsData)
    }
  }

  componentWillMount () {
    this.propsData = this.props
  }

  componentWillReceiveProps (newProps) {
    if (!this.props.show && newProps.show) {
      this.propsData = newProps
      this.fetchData()
    }
  }

  render () {
    const deployments = Utils.getJsonValue(this, 'state.executions.resource.response')

    const startTime = this.props.startTime
    const startDate = Utils.formatDate(new Date(startTime), 'MMM Do') + ' Deployments'

    return (
      <Modal show={this.props.show} className={css.main} onHide={this.props.onHide}>
        <Modal.Header closeButton>
          <Modal.Title>{startDate}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <DeploymentsList
            {...this.props}
            dataStore={this.props.dataStore}
            executions={deployments}
            showApp={!this.propsData.appId}
            noDataCls={this.props.noDataCls}
          />
        </Modal.Body>
      </Modal>
    )
  }
}

export default Utils.createTransmitContainer(DeploymentsByDateModal, fragmentArr)



// WEBPACK FOOTER //
// ../src/containers/Dashboard/DeploymentsByDateModal.js