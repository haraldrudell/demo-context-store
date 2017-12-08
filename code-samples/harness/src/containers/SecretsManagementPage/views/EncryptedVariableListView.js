import React from 'react'
import { UIButton, FormUtils, DataGrid } from 'components'

import css from './EncryptedVariableListView.css'
import EncryptVariablesModal from '../EncryptResources/EncryptVariablesModal.js'
import { EncryptService } from '../../../services/index'

class EncryptedVariableListView extends React.Component {
  state = {
    showModal: false
  }
  renderAddButton = () => {
    const { selectedObj } = this.props
    const { resourceName } = selectedObj

    if (resourceName === 'Encrypted Text') {
      return (
        <UIButton icon="PlusAccent" data-name="add-encrypted-variable" onClick={this.addVariable}>
          Add Encrypted Text
        </UIButton>
      )
    }
  }

  onEdit = item => {
    this.setState({ showModal: true, modalData: item })
  }

  onDelete = item => {
    this.props.confirm.showConfirmDelete(async () => {
      const uuid = item.uuid

      const { accountId } = this.props.componentParams
      const { error } = await EncryptService.deleteEncryptVariable({ accountId, uuid })
      if (!error) {
        await this.props.refetch()
        this.props.toaster.show({ message: 'Deleted successfully.' })
      }
    })
  }

  getUsageLog = async item => {
    const entityId = item.uuid
    const type = item.type
    await this.props.componentParams.getUsageLog({ entityId, type })
  }

  getChangeLog = async item => {
    const entityId = item.uuid
    const type = item.type
    await this.props.componentParams.getChangeLog({ entityId, type })
  }

  getSetUpUsageLog = async item => {
    await this.props.componentParams.getSetUpLog({ item })
  }

  renderButton = () => {
    return this.renderAddButton()
    // return <ui-card-actions>{this.renderAddButton()}</ui-card-actions>
  }

  renderModal = () => {
    const showModal = FormUtils.clone(this.state.showModal)
    const { componentParams } = this.props
    const { accountId } = componentParams
    if (showModal) {
      return (
        <EncryptVariablesModal
          show={this.state.showModal}
          accountId={accountId}
          onHide={this.hideEncryptModal}
          onSubmit={this.onSubmit}
          data={this.state.modalData}
        />
      )
    }
  }

  onSubmit = () => {
    this.hideEncryptModal()
    this.props.onSubmit()
  }

  hideEncryptModal = () => {
    this.setState({ showModal: false })
  }

  addVariable = () => {
    this.setState({ showModal: true })
  }

  renderCardContent = () => {
    const { content } = this.props
    if (content && content.length > 0) {
      return (
        <ui-card key="1">
          <header>
            <card-title>Encrypted Text</card-title>
            {this.renderButton()}
          </header>
          {this.returnDataGridContent()}
        </ui-card>
      )
    } else {
      return this.renderNoData()
    }
  }

  returnDataGridContent = () => {
    const { content } = this.props
    if (content && content.length > 0) {
      const columns = [
        {
          key: 'name',
          name: 'Name',
          renderer: this.nameRenderer
        },
        {
          key: 'encryptedBy',
          name: 'Secret Manager'
        },
        {
          name: 'Setup Usage',
          key: 'setupUsage',
          renderer: this.setUpUsageRenderer
        },
        {
          name: 'RunTime Usage Log',
          key: 'runTimeUsage',
          renderer: this.runTimeLogRenderer
        },
        {
          name: 'Change Log',
          key: 'changeLog',
          renderer: this.changeLogRenderer
        },
        {
          name: '',
          key: 'uuid',
          renderer: this.renderCrossIcon
        }
      ]
      const data = content
      return (
        <main className={css.main}>
          <DataGrid columns={columns} gridData={data} rowGetter={this.rowGetter} />
        </main>
      )
    }
  }

  renderNoData = () => {
    return (
      <main className="no-data-box">
        No Data Available
        <span className="wings-text-link cta-button" onClick={this.addVariable}>
          Add Encrypt Variable
        </span>
      </main>
    )
  }

  renderCrossIcon = props => {
    const { data } = props
    return <UIButton icon="Cross" onClick={() => this.onDelete(data)} />
  }

  rowGetter = rowNumber => {
    const { content } = this.props
    this.currentRow = rowNumber
    return content[rowNumber]
  }

  nameRenderer = props => {
    const { data } = props
    return <UIButton onClick={this.onEdit.bind(this, data)}>{props.value}</UIButton>
  }

  setUpUsageRenderer = props => {
    const { data } = props
    return (
      <UIButton className={css.logData} onClick={this.getSetUpUsageLog.bind(this, data)}>
        {props.value}
      </UIButton>
    )
  }

  runTimeLogRenderer = props => {
    return (
      <UIButton className={css.logData} onClick={this.getUsageLog.bind(this, props.data)}>
        {props.value}
      </UIButton>
    )
  }

  changeLogRenderer = props => {
    return (
      <UIButton className={css.logData} onClick={this.getChangeLog.bind(this, props.data)}>
        {props.value}
      </UIButton>
    )
  }

  render () {
    return (
      <section>
        {this.renderCardContent()}
        {this.renderModal()}
      </section>
    )
  }
}

export default EncryptedVariableListView



// WEBPACK FOOTER //
// ../src/containers/SecretsManagementPage/views/EncryptedVariableListView.js