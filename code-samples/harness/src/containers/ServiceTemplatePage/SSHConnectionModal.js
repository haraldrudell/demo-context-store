import React from 'react'
import { Modal } from 'react-bootstrap'
import { SSHLoginForm, HostListForm, WingsModal } from 'components'
import css from './SSHConnectionModal.css'
import hostcss from '../../components/SSHConnectionForm/HostListForm.css'
import apis from 'apis/apis'

export default class SSHConnectionModal extends React.Component {
  state = {
    schema: {},
    uiSchema: {},
    formData: {},
    requestStatus: [],
    showLogin: false,
    onSSHLogin: false,
    initialised: false
  }

  componentWillReceiveProps (newProps) {
    if (newProps.show && newProps.data.length > 0 && !this.state.initialised) {
      this.setState({ initialised: true })
      this.props = newProps
      this.state.requestStatus = []
      this.createHostTemplate()
    }
  }
  // creates host template

  createHostTemplate = () => {
    const pwdType = this.props.usrPwdType
    if (!pwdType) {
      this.buildFormData()
      this.requestHostValidation()
    }
  }

  buildFormData = data => {
    const formData = {}
    const infraModalData = this.props.infraModalData
    formData.computeProviderSettingId = infraModalData.computeProviderSettingId
    formData.deploymentType = infraModalData.deploymentType
    formData.hostConnectionAttrs = infraModalData.hostConnectionAttrs
    if ('hostNamesText' in infraModalData) {
      formData['hostNames'] = this.props.data
    }
    formData.executionCredential = {}
    formData.executionCredential.executionType = 'SSH' // HardCoding for now- to be removed later
    formData.executionCredential.sshUser = data !== undefined ? data.username : ''
    formData.executionCredential.sshPassword = data !== undefined ? data.password : ''
    this.setState({ formData })
  }

  requestHostValidation () {
    const hostList = this.props.data
    if (hostList !== undefined) {
      const hostListLength = hostList.length
      let interval = 0
      if (hostListLength > 0) {
        const index = setInterval(() => {
          const hostListLength = hostList.length

          this.testHostConnections(interval)
          interval++
          if (interval >= hostListLength) {
            clearInterval(index)
          }
        }, 50)
      }
    }
  }

  verifyHost = (host, index) => {
    const response = { status: 'In Progress', errorDescription: null }
    this.updateRequestStatus(response, index)
    this.testHostConnections(index)
  }

  testHostConnections = interval => {
    const appId = this.props.appId
    const envId = this.props.envId
    const data = this.state.formData
    data.hostNames = []
    data.hostNames.push(this.props.data[interval])
    this.setState({ formData: data })
    this.getValidateEndPoint(appId, envId)
      .then(result => {
        this.updateHostStatus(result, interval)
      })
      .catch(error => {
        this.updateOnError(interval)
        throw error
      })
  }

  updateHostStatus (response, interval) {
    const responseObj = response.resource[0]
    const className = responseObj.errorDescription !== null ? hostcss.error : hostcss.success
    this.updateRequestStatus(responseObj, interval, className)
  }

  updateOnError (index, className) {
    const requestStatus = this.state.requestStatus
    const requestStatusObj = this.state.requestStatus[index]
    requestStatusObj['status'] = 'error'
    requestStatusObj['className'] = hostcss.error
    this.setState({ requestStatus })
  }

  updateRequestStatus (response, index, className = hostcss.inprogress) {
    const requestStatus = this.state.requestStatus
    const requestStatusObj = this.state.requestStatus[index]
    requestStatusObj['status'] = response.status
    requestStatusObj['errorMessage'] = response.errorDescription
    requestStatusObj['className'] = className
    this.setState({ requestStatus })
  }

  getValidateEndPoint = (appId, envId) => {
    const data = this.state.formData

    return apis.service.create(apis.validateHostsForInfraMappingEndPoint(appId, envId), { body: JSON.stringify(data) })
  }

  onSSHTestLogin = data => {
    this.setState({ onSSHLogin: true })
    this.buildFormData(data)
    this.requestHostValidation()
  }

  onHide = () => {
    this.setState({ onSSHLogin: false, initialised: false })
    this.props.onHide()
  }

  render () {
    // const hostCls = (this.state.showHosts || !this.props.usrPwdType) ? 'show' : 'hide'
    return (
      <WingsModal
        show={this.props.show}
        onHide={this.onHide}
        className={css.main}
        data-name="ssh-connectivity-test-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>SSH Connectivity Test</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.props.usrPwdType &&
            !this.state.onSSHLogin &&
            <SSHLoginForm onTestClick={this.onSSHTestLogin} hostList={this.props.data} />}
          {!this.props.usrPwdType &&
            <HostListForm
              data={this.props.data}
              requestStatus={this.state.requestStatus}
              verifyHost={this.verifyHost}
            />}

          {this.state.onSSHLogin &&
            <HostListForm
              data={this.props.data}
              requestStatus={this.state.requestStatus}
              verifyHost={this.verifyHost}
            />}
        </Modal.Body>
      </WingsModal>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/ServiceTemplatePage/SSHConnectionModal.js