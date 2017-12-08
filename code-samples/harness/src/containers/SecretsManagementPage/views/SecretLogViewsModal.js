import React from 'react'

import { Link } from 'react-router'
import { Modal } from 'react-bootstrap'
import { WingsModal, DataGrid, Utils, FormUtils } from 'components'
import { SecretManagementService } from 'services'

class LogViewModal extends React.Component {
  state = {
    loading: true,
    data: []
  }

  async componentWillMount () {
    const { showUsageLog, showChangeLog } = this.props
    let resource
    if (showUsageLog) {
      resource = await this.getUsageLogDetails()
    } else if (showChangeLog) {
      resource = await this.getChangeLogDetails()
    }
    this.setState({ loading: false, data: resource })
  }

  getUsageLogDetails = async () => {
    const { accountId, entityId, type } = this.props

    const { error, resource } = await SecretManagementService.getUsageLog({
      accountId,
      entityId,
      type
    })
    if (error) {
      return
    }
    const { response } = resource
    return response
  }

  getChangeLogDetails = async () => {
    const { accountId, entityId, type } = this.props

    const { error, resource } = await SecretManagementService.getChangeLog({
      accountId,
      entityId,
      type
    })
    if (error) {
      return
    }
    return resource
  }

  hideModal = () => {
    this.props.onHide()
  }

  renderLoading = () => {
    return (
      <div className="big-loader-area">
        <i className="wings-spinner" />
        {'LOADING'}
      </div>
    )
  }

  getData = () => {
    const data = FormUtils.clone(this.state.data)
    if (data) {
      return data
    }
  }

  getChangeLogData = () => {
    const data = FormUtils.clone(this.state.data)
    const newData = []
    for (const item of data) {
      const { lastUpdatedBy, lastUpdatedAt, description } = item
      const { name } = lastUpdatedBy
      const changedTime = Utils.formatDate(lastUpdatedAt)
      newData.push({ changedBy: name, changedTime: changedTime, changedDetail: description })
    }
    return newData
  }

  renderRunTimeUsageLogData = () => {
    const columns = [
      {
        key: 'workflowExecutionName',
        name: 'Deployments',
        renderer: this.deploymentRenderer
      },
      {
        key: 'lastUpdatedAt',
        name: 'Triggered Time',
        renderer: 'TIME_RENDERER'
      }
    ]
    const data = this.getData()
    return { columns, data }
  }

  renderChangeLogData = () => {
    const columns = [
      { key: 'changedBy', name: 'Changed By' },
      { key: 'changedTime', name: 'Changed Time' },
      { key: 'changedDetail', name: 'Details' }
    ]
    const data = this.getChangeLogData()
    return { columns, data }
  }

  renderData = () => {
    const { showUsageLog, showChangeLog } = this.props

    if (showUsageLog) {
      return this.renderRunTimeUsageLogData()
    } else if (showChangeLog) {
      return this.renderChangeLogData()
    }
  }

  deploymentRenderer = props => {
    const { accountId, appId, envId, workflowExecutionId, workflowExecutionName } = props.data

    const { path } = this.props
    return (
      <Link to={path.toExecutionDetails({ accountId, appId, envId, execId: workflowExecutionId })}>
        {workflowExecutionName}
      </Link>
    )
  }

  renderContent = () => {
    const { columns, data } = this.renderData()

    if (!this.state.loading) {
      if (data && data.length > 0) {
        let minHeight
        if (data.length < 5) {
          minHeight = data.length === 1 ? 100 : 200
        } else {
          minHeight = 500
        }

        return <DataGrid columns={columns} gridData={data} minHeight={minHeight} />
      } else {
        return <main className="no-data-box">No Data Available</main>
      }
    }
  }

  renderTitle = () => {
    const { showUsageLog, showChangeLog } = this.props

    let title

    if (showUsageLog) {
      title = 'Run Time Usage Log'
    } else if (showChangeLog) {
      title = 'Change Log'
    }
    return title
  }

  render () {
    return (
      <WingsModal show={this.props.show} onHide={this.hideModal}>
        <Modal.Header closeButton>
          <Modal.Title>{this.renderTitle()}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.state.loading && this.renderLoading()}
          {!this.state.loading && this.renderContent()}
        </Modal.Body>
      </WingsModal>
    )
  }
}

export default LogViewModal



// WEBPACK FOOTER //
// ../src/containers/SecretsManagementPage/views/SecretLogViewsModal.js