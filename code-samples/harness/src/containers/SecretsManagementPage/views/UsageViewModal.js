import React from 'react'
import css from '../views/UsageViewModal.css'
import { Link } from 'react-router'
import { Modal } from 'react-bootstrap'
import { WingsModal, DataGrid, FormUtils, NameValueList, Utils } from 'components'
import { SecretManagementService } from 'services'
const GlobalEnvId = '__GLOBAL_ENV_ID__'

class UsageViewModal extends React.Component {
  state = {
    loading: true,
    data: []
  }

  async componentWillMount () {
    const { show } = this.props
    let resource

    if (show) {
      resource = await this.getSetUpLogDetails()
    }
    this.setState({ loading: false, data: resource })
  }

  getSetUpLogDetails = async () => {
    const { params: { accountId }, uuid } = this.props
    const { error, resource } = await SecretManagementService.getSetUpLog({
      accountId,
      uuid
    })
    if (error) {
      return
    }
    return resource
  }

  hideModal = () => {
    this.props.onHide()
  }

  renderTitle = () => {
    const { show } = this.props

    if (show) {
      return 'Setup Usage'
    }
  }

  getData = () => {
    const data = FormUtils.clone(this.state.data)
    if (data) {
      return data
    }
  }

  renderUsageData = () => {
    const columns = [
      {
        key: 'entityType',
        name: 'Type',
        renderer: this.entityRenderer
      },
      {
        name: 'Usage',
        height: '300',
        renderer: this.usageRenderer
      }
    ]
    const data = this.getData()
    return { columns, data }
  }

  renderData = () => {
    const { show } = this.props

    if (show) {
      return this.renderUsageData()
    }
  }

  renderContent = () => {
    const { columns, data } = this.renderData()

    if (!this.state.loading) {
      if (data && data.length > 0) {
        return <DataGrid columns={columns} gridData={data} minHeight={500} rowHeight={100} headerRowHeight={35} />
      } else {
        return <main className="no-data-box">No Data Available</main>
      }
    }
  }

  entityRenderer = props => {
    const text = this.getTypeText(props)
    return <span> {text} </span>
  }

  getTypeText = props => {
    const { entityType, settingType } = props.data
    const { cardparams: { entityTypes, settingTypes } } = this.props

    let type

    if (entityType !== entityTypes.service) {
      type = 'OVERRIDE'
    }
    const text = type ? `${settingType}_${type}` : settingType
    return settingTypes[text]
  }

  usageRenderer = props => {
    const { cardparams: { entityTypes }, usageCategory } = this.props
    const { data } = props
    const { appId, entityType, name, relativeFilePath } = data
    const app = this.getApp(appId)
    let nameValuePairs = []
    if (entityType === entityTypes.environment) {
      nameValuePairs = this.getNameValuePairsForAllOverrides(app, data)
    } else {
      nameValuePairs = this.getNameValuePairs(app, data)
    }

    if (usageCategory === Utils.encryptTypes.TEXT) {
      nameValuePairs.push({
        name: 'Variable:',
        value: name
      })
    } else if (usageCategory === Utils.encryptTypes.FILE) {
      nameValuePairs.push({
        name: 'Relative File Path:',
        value: relativeFilePath
      })
    }
    return <NameValueList data={nameValuePairs} className={css.nameValueList} />
  }

  getNameValuePairsForAllOverrides = (app, data) => {
    const { path } = this.props
    const nameValuePairs = []

    const { accountId, appId, entityId, serviceId } = data
    const serviceName = this.getServiceName(app, serviceId)
    nameValuePairs.push(
      {
        name: 'Service:',
        value: serviceName
      },
      {
        name: 'Environment:',
        value: (
          <Link to={path.toSetupEnvironmentDetails({ accountId, appId, envId: entityId })}>
            {this.getEnvironmentName(app, entityId)}
          </Link>
        )
      }
    )
    return nameValuePairs
  }

  getNameValuePairs = (app, data) => {
    const { path } = this.props
    const nameValuePairs = []

    const { accountId, appId, entityId, envId, serviceId } = data

    const id = serviceId ? serviceId : entityId

    const serviceName = this.getServiceName(app, id)

    nameValuePairs.push({
      name: 'Service:',
      value: <Link to={path.toSetupServiceDetails({ accountId, appId, serviceId: id })}>{serviceName}</Link>
    })

    if (envId && envId !== GlobalEnvId) {
      nameValuePairs.push({
        name: 'Environment:',
        value: (
          <Link to={path.toSetupEnvironmentDetails({ accountId, appId, envId })}>
            {this.getEnvironmentName(app, envId)}
          </Link>
        )
      })
    }
    return nameValuePairs
  }

  getApp = appId => {
    const { dataStore: { apps } } = this.props
    return apps.find(app => app.uuid === appId)
  }

  getServiceName = (app, serviceId) => {
    if (app && serviceId) {
      const service = app.services.find(service => service.uuid === serviceId)
      return service ? service.name : ''
    } else {
      return 'All'
    }
  }

  getEnvironmentName = (app, envId) => {
    const env = app.environments.find(env => env.uuid === envId)
    return env ? env.name : ''
  }

  renderLoading = () => {
    return (
      <div className="big-loader-area">
        <i className="wings-spinner" />
        {'LOADING'}
      </div>
    )
  }

  render () {
    return (
      <WingsModal show={this.props.show} onHide={this.hideModal} className={css.main}>
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
export default UsageViewModal



// WEBPACK FOOTER //
// ../src/containers/SecretsManagementPage/views/UsageViewModal.js