import React from 'react'
import { createPageContainer, Widget, UIButton, PageBreadCrumbs, FormUtils, Utils } from 'components'
import KmsCardView from './views/KmsCardView'
import ConfigureKMSModal from './ConfigureKMSModal.js'
import MigrateKMSModal from './MigrateKMSModal.js'
import { Intent } from '@blueprintjs/core'
import { SecretManagementService, HashiCorpService } from 'services'
const globalAccountId = '__GLOBAL_ACCOUNT_ID__'

class KmsListPage extends React.Component {
  pageName = 'Secrets Management'
  title = this.renderTitleBreadCrumbs()
  state = {
    showKMSModal: false,
    showConfirm: false,
    showMigrateKMS: false,
    KMSData: null
  }
  deletingId

  async componentWillMount () {
    this.getQueryParameters()
    await this.fetchData()
  }

  getQueryParameters = () => {
    if (this.props.urlParams) {
      const { accountId } = this.props.urlParams
      this.acctId = accountId
    }
  }

  fetchData = async () => {
    const { error, resource } = await SecretManagementService.listConfiguredKMS({ accountId: this.acctId })
    if (error) {
      return
    }

    this.setState({ configuredKMSList: resource })
  }

  widgetHeaderButton = props => {
    return (
      <UIButton icon="Add" medium onClick={this.onAddKms} data-name="add-kms">
        Add Secret Manager
      </UIButton>
    )
  }

  onAddKms = () => {
    this.setState({ showKMSModal: true, KMSData: null })
  }

  hideCustomForm = () => {
    this.setState({ showKMSModal: false })
  }

  editKMS = item => {
    this.setState({ showKMSModal: true, KMSData: item })
  }

  afterSubmit = async () => {
    // this.props.spinner.show()
    await this.fetchData()
    this.hideCustomForm()
    // this.props.spinner.hide()
  }

  deleteKMS = async item => {
    this.props.confirm.showConfirmDelete(async () => {
      const error = await this.onDeleteConfirmed(item)
      if (!error) {
        await this.props.refreshData()
        this.props.toaster.show({ message: 'Secret Manager deleted successfully.' })
      }
    })
  }

  onDeleteConfirmed = async item => {
    const kmsConfigId = item.uuid
    const encryptionType = item.encryptionType
    if (encryptionType === Utils.encryptionTypes.KMS) {
      const { error } = await SecretManagementService.deleteKMS({ accountId: this.acctId, kmsConfigId })
      return error
    } else if (encryptionType === Utils.encryptionTypes.VAULT) {
      const { error } = await HashiCorpService.deleteVaultKMS({ accountId: this.acctId, vaultConfigId: kmsConfigId })
      return error
    }
  }

  onMigrateKMS = async item => {
    this.filterKMS(item)
    this.migrateFromId = item.uuid
    this.migrateEncryptionType = item.encryptionType
    this.setState({ showMigrateKMS: true })
    this.migrateFrom = item
  }

  filterKMS = item => {
    const configuredKMSList = FormUtils.clone(this.state.configuredKMSList)
    const globalKMSList = configuredKMSList.filter(kms => kms.accountId === globalAccountId)
    const customKMSList = configuredKMSList.filter(kms => kms.accountId !== globalAccountId)

    // const globalKMSList = Utils.filterGlobalKMS(configuredKMSList, globalAccountId)

    const deleteList = [item.uuid]
    const filteredList = customKMSList.filter(item => !deleteList.includes(item.uuid))
    this.migrateList = filteredList.concat(globalKMSList)
  }

  hideMigrateKMS = () => {
    this.setState({ showMigrateKMS: false })
  }

  onSubmit = async () => {
    this.hideMigrateKMS()
    await this.afterSubmit()
    this.props.toaster.show({ message: 'Successfully Deprecated.', intent: Intent.SUCCESS })
  }

  renderTitleBreadCrumbs () {
    const path = this.props.path
    const urlParams = this.props.urlParams
    const bData = [{ label: 'Secrets Management', link: path.toSecretsManagement(urlParams) }]
    return <PageBreadCrumbs data={bData} />
  }

  renderNoData = () => {
    return (
      <main className="no-data-box">
        No Data Available
        <span
          className="wings-text-link cta-button"
          onClick={() => {
            this.onAddKms.call(this)
          }}
        >
          Add Secret Manager
        </span>
      </main>
    )
  }

  render () {
    const widgetComponentParams = {
      data: this.state.configuredKMSList,
      deleteKMS: this.deleteKMS,
      onMigrateKMS: this.onMigrateKMS,
      onEditKMS: this.editKMS,
      noDataMessage: this.renderNoData()
    }

    const migrateParams = {
      migrateKMSList: this.migrateList,
      accountId: this.acctId,
      migrateFrom: this.migrateFrom,
      afterSubmit: this.onSubmit,
      encryptionType: this.migrateEncryptionType
    }

    const widgetHeaderParams = {
      leftItem: this.widgetHeaderButton(),
      showSearch: false
    }

    return (
      <section>
        <Widget
          {...this.props}
          headerParams={widgetHeaderParams}
          component={KmsCardView}
          params={widgetComponentParams}
        />
        {this.state.showKMSModal && (
          <ConfigureKMSModal
            show={this.state.showKMSModal}
            onHide={this.hideCustomForm}
            ref={kmsSubForm => (this.child = kmsSubForm)}
            accountId={this.acctId}
            onSubmit={this.afterSubmit}
            data={this.state.KMSData}
          />
        )}

        {/* this.state.showConfirm &&
          <Confirm
            visible={this.state.showConfirm}
            onConfirm={this.onDeleteConfirmed}
            onClose={Utils.hideModal.bind(this, 'showConfirm')}
            body="Are you sure you want to delete this?"
            confirmText="Confirm Delete"
            title="Deleting"
          >
            <button style={{ display: 'none' }} />
        </Confirm>*/}

        {this.state.showMigrateKMS && (
          <MigrateKMSModal show={this.state.showMigrateKMS} onHide={this.hideMigrateKMS} {...migrateParams} />
        )}
      </section>
    )
  }
}
export default createPageContainer()(KmsListPage)



// WEBPACK FOOTER //
// ../src/containers/SecretsManagementPage/KmsListPage.js