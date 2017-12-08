import React from 'react'
import AcctSettingModal from '../../AcctSettingPage/AcctSettingModal'
import { SettingsService } from 'services'
import css from '../SecretsManagementPage.css'
import { ActionsDropdown, NameValueList, UIButton } from 'components'

const settingsSchema = {
  type: 'object',
  properties: {
    userName: {
      type: 'string',
      title: 'User Name'
    },
    key: {
      type: 'string',
      title: 'Key'
    }
  }
}

const settingsUiSchema = {
  key: { 'ui:widget': 'textarea' },
  'ui:order': ['userName', 'key']
}

class SSHSettingsListView extends React.Component {
  state = {
    showSettingModal: false,
    showDeleteConfirm: false
  }

  componentWillReceiveProps (newProps) {}

  renderName = () => {}

  renderUiCard = item => {
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
            <item-description />
          </card-title>
          {this.renderUiCardActions(actionsDropdownProps)}
        </header>
        {this.renderCardContent(item)}
      </ui-card>
    )
  }

  onDelete = item => {
    this.props.confirm.showConfirmDelete(async () => {
      const attrId = item.uuid

      const { accountId } = this.props.componentParams
      const { error } = await SettingsService.removeSSHKeys({ attrId, accountId })
      if (!error) {
        await this.props.refreshData()
        this.props.toaster.show({ message: 'Item deleted successfully.' })
      }
    })
    // this.props.componentParams.setDeleteConfirm(true, this.onDeleteSSHKey.bind(this, item))
  }

  onEdit = item => {
    this.setState({ showSettingModal: true, sshKeyData: item })
  }

  onDeleteSSHKey = async item => {
    const attrId = item.uuid

    const { accountId } = this.props.componentParams
    const { error } = await SettingsService.removeSSHKeys({ attrId, accountId })

    if (error) {
      return
    }
    this.props.componentParams.setDeleteConfirm(false)
    this.props.componentParams.onSubmit()
  }

  renderUiCardActions = actionsDropdownProps => {
    return (
      <ui-card-actions>
        <ActionsDropdown {...actionsDropdownProps} />
      </ui-card-actions>
    )
  }

  renderCardContent = item => {
    if (item) {
      const userName = item.value ? item.value.userName : ''
      const nameValuePairs = [
        {
          name: 'Authentication Type',
          value: 'SSH Key'
        },
        { name: 'Username', value: userName },
        { name: 'Key', value: '**********' },
        {
          name: 'Secret Manager',
          value: item.encryptedBy
        }
      ]
      return (
        <main>
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

  hideSettingsModal = () => {
    this.setState({ showSettingModal: false })
  }

  onSubmit = () => {
    this.hideSettingsModal()
    this.props.componentParams.onSubmit()
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

  static showSettingModal = () => {
    this.setState({ showSettingModal: true })
  }

  renderSettingModal = () => {
    const show = this.state.showSettingModal || this.props.showSSHModal
    const data = this.state.sshKeyData ? this.state.sshKeyData : null
    if (show) {
      return (
        <AcctSettingModal
          show={show}
          onHide={this.hideSettingsModal}
          jsonSchema={settingsSchema}
          uiSchema={settingsUiSchema}
          data={data}
          show={this.state.showSettingModal}
          SshKey={true}
          onSubmit={this.onSubmit}
        />
      )
    }
  }

  renderAddSSHKey = () => {
    const { selectedObj } = this.props
    const { resourceName } = selectedObj

    if (resourceName === 'SSH') {
      return (
        <UIButton
          className={`text-btn ${css.addBtn}`}
          icon="Add"
          medium
          onClick={this.onAddSSH}
          data-name="add-ssh-key"
        >
          Add SSH Key
        </UIButton>
      )
    }
  }

  onAddSSH = () => {
    this.setState({ showSettingModal: true })
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
        {this.renderAddSSHKey()}
        {this.renderContent()}
        {this.renderSettingModal()}
      </section>
    )
  }
}

export default SSHSettingsListView



// WEBPACK FOOTER //
// ../src/containers/SecretsManagementPage/views/SSHSettingsListView.js