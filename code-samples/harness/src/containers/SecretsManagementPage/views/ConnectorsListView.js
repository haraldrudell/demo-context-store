import React from 'react'
import { Utils, ActionsDropdown, NameValueList } from 'components'

import { SettingsService } from 'services'
import AcctConnectorModal from '../../AcctConnectorPage/AcctConnectorModal'
import css from '../SecretsManagementPage.css'

const cloudProviders = {
  AWS: 'AWS',
  GCP: 'GCP'
}
class ConnectorsListView extends React.Component {
  state = {
    showConnectorModal: false,
    modalData: null
  }

  renderUiCard = item => {
    const { categories } = this.props.componentParams
    const actionIcons = [
      {
        label: 'Edit',
        element: <edit-icon class="harness-icon" />,
        onClick: this.onEdit.bind(this, item)
      },
      {
        label: 'Delete',
        element: <delete-icon class="harness-icon" />,
        onClick: this.onDelete.bind(this, item)
      }
    ]
    const actionsDropdownProps = { actionIcons }
    return (
      <ui-card key={item.uuid}>
        <header>
          <card-title>
            <item-name class="wings-text-link" onClick={this.onEdit.bind(this, item)}>
              {item.name}
            </item-name>
            <item-description>{this.renderType(item)}</item-description>
          </card-title>
          {this.renderUiCardActions(actionsDropdownProps)}
        </header>
        {item && item.category === categories.cloudProvider && this.renderCardContentForCloudProvider(item)}
        {item && item.category === categories.connector && this.renderCardContentForConnector(item)}
      </ui-card>
    )
  }

  renderType = item => {
    const providerName = this.getTypeOnHeader(item)
    return <span className={css.description}>(Type: {providerName})</span>
  }

  getTypeOnHeader = item => {
    const { catalogs, categories } = this.props.componentParams
    let resourceCatalogs
    let providerObj

    if (catalogs) {
      resourceCatalogs =
        item.category === categories.cloudProvider ? catalogs['CLOUD_PROVIDERS'] : catalogs['CONNECTOR_TYPES']

      if (resourceCatalogs && item && item.value) {
        providerObj = resourceCatalogs.find(cnctr => cnctr.value === item.value.type)
        return providerObj ? providerObj.name : ''
      }
    }
  }

  renderUiCardActions = actionsDropdownProps => {
    return (
      <ui-card-actions>
        <ActionsDropdown {...actionsDropdownProps} />
      </ui-card-actions>
    )
  }

  renderCardContentForConnector = item => {
    const { className } = this.props.componentParams
    if (item) {
      const nameValuePairs = [
        {
          name: 'Name',
          value: item.name
        },
        {
          name: 'Url',
          value: this.renderUrl(item)
        },
        {
          name: 'Secret Manager',
          value: item.encryptedBy
        }
      ]
      return (
        <main className={className}>
          <NameValueList data={nameValuePairs} className={css.secretCard} />
          {this.props.componentParams.renderLogButtons({
            usageClickHandler: this.getUsageLog.bind(this, item),
            changeLogClickHandler: this.getChangeLog.bind(this, item)
          })}
        </main>
      )
    } else {
      return <div />
    }
  }

  renderNameValuePairsForCloudProviders = item => {
    const { type } = item.value
    const nameValuePairs = []
    if (type === cloudProviders.AWS) {
      nameValuePairs.push({
        name: 'Access Key',
        value: item.value.accessKey
      })
    } else if (type === cloudProviders.GCP) {
      nameValuePairs.push({
        name: 'Google Cloud Account Name',
        value: item.name
      })
    }
    nameValuePairs.push({
      name: 'Secret Manager',
      value: item.encryptedBy
    })
    return nameValuePairs
  }

  renderCardContentForCloudProvider = item => {
    const { className } = this.props.componentParams

    if (item) {
      const nameValuePairs = this.renderNameValuePairsForCloudProviders(item)
      return (
        <main className={className}>
          <NameValueList data={nameValuePairs} className={css.secretCard} />
          {this.props.componentParams.renderLogButtons({
            usageClickHandler: this.getUsageLog.bind(this, item),
            changeLogClickHandler: this.getChangeLog.bind(this, item)
          })}
        </main>
      )
    } else {
      return <div />
    }
  }

  renderUrl = item => {
    return Utils.renderUrlForConnectorsCardView(item)
  }

  onEdit = item => {
    const { stencils, catalogs } = this.props.componentParams
    const type = item.value.type
    this.connectorSchema = stencils[type]
    const connectorCatalogs = catalogs['CONNECTOR_TYPES']
    if (connectorCatalogs) {
      const providerObj = connectorCatalogs.find(cnctr => cnctr.value === item.value.type)
      this.selectedType = item.value.type
      this.connectorTitle = providerObj ? providerObj.name : ''
    }

    this.setState({ showConnectorModal: true, modalData: item })
  }

  onDelete = item => {
    this.props.confirm.showConfirmDelete(async () => {
      const { accountId } = this.props.componentParams
      const deletingId = item.uuid
      const { error } = await SettingsService.removeSettings({ deletingId, accountId })
      if (!error) {
        await this.props.refreshData()
        this.props.toaster.show({ message: 'Deleted successfully.' })
      }
    })
  }

  hideConnectorModal = () => {
    this.setState({ showConnectorModal: false })
  }

  onSubmit = () => {
    this.hideConnectorModal()
    this.props.componentParams.onSubmit()
  }

  renderConnectorModal = () => {
    const { stencils, catalogs } = this.props.componentParams
    if (this.state.showConnectorModal) {
      return (
        <AcctConnectorModal
          schema={stencils}
          schemaData={this.connectorSchema}
          data={this.state.modalData}
          show={this.state.showConnectorModal}
          onHide={this.hideConnectorModal}
          onSubmit={this.onSubmit}
          selectedType={this.selectedType}
          title={this.connectorTitle}
          pluginCategory={catalogs && catalogs.PLUGIN_CATEGORY}
          enableOnlySecretKeys={true}
          catalogs={catalogs}
        />
      )
    }
  }
  getUsageLog = async item => {
    const entityId = item.uuid
    const type = item.value.type
    await this.props.componentParams.getUsageLog({ entityId, type })
  }

  getChangeLog = async item => {
    const entityId = item.uuid
    const type = item.value.type
    await this.props.componentParams.getChangeLog({ entityId, type })
  }

  renderContent = () => {
    const { content } = this.props
    if (content && content.length > 0) {
      return content.map(item => {
        return this.renderUiCard(item)
      })
    } else {
      return this.props.componentParams.renderNoData()
    }
  }

  render () {
    return (
      <section>
        {this.renderContent()}
        {this.renderConnectorModal()}
      </section>
    )
  }
}

export default ConnectorsListView



// WEBPACK FOOTER //
// ../src/containers/SecretsManagementPage/views/ConnectorsListView.js