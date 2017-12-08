import React from 'react'
import { createPageContainer, Utils, PageBreadCrumbs, ConfirmDelete } from 'components'
import css from '../SecretsManagementPage.css'
import SSHSettingsListView from './SSHSettingsListView'
import ConnectorsListView from './ConnectorsListView'
import EncryptedVariableListView from './EncryptedVariableListView'
import EncryptedFileListView from './EncryptedFileListView'
// import ServiceConfigsListView from './ServiceConfigsListView'
import SecretLogViewsModal from './SecretLogViewsModal'
import UsageViewModal from './UsageViewModal'
import { SecretManagementService, PluginService, EncryptService } from 'services'

const categories = {
  setting: 'SETTING',
  cloudProvider: 'CLOUD_PROVIDER',
  connector: 'CONNECTOR',
  serviceVariables: 'SERVICE_VARIABLE',
  configFiles: 'CONFIG_FILE',
  variable: Utils.encryptTypes.TEXT,
  file: Utils.encryptTypes.FILE
}

const entityTypes = {
  service: 'SERVICE',
  serviceTemplate: 'SERVICE_TEMPLATE',
  environment: 'ENVIRONMENT'
}

const encryptTypes = {
  variable: 'Encrypted Text',
  file: 'Encrypted Files'
}

const verificationProviders = ['JENKINS', 'SPLUNK', 'ELK', 'LOGZ', 'SUMO', 'APP_DYNAMICS', 'NEW_RELIC']

const artifactServers = ['JENKINS', 'BAMBOO', 'DOCKER', 'NEXUS', 'ARTIFACTORY', 'AMAZON_S3']

const collobProviders = ['SMTP', 'SLACK']

const settingTypes = {
  SERVICE_VARIABLE: 'Service Configuration Variable',
  CONFIG_FILE: 'Service Configuration File',
  SERVICE_VARIABLE_OVERRIDE: 'Service Configuration Variable Override',
  CONFIG_FILE_OVERRIDE: 'Service Configuration File Override'
}

class SecretManagementListView extends React.Component {
  state = {
    content: null,
    showDeleteConfirm: false,
    showLogViewModal: false,
    showUsageView: false,
    selectedItem: null,
    showSettingModal: false,
    stencils: null
  }

  static contextTypes = Utils.getDefaultContextTypes()
  pageName = 'Secrets Management'
  title = this.renderTitleBreadCrumbs()
  isLoading = false
  loadingComplete = false

  async componentWillMount () {
    this.props.updateLoadingStatus(true)
    this.isLoading = true
    this.props.spinner.show()

    this.getQueryParameters()
    //   await this.fetchData()
    await this.fetchStencils()
  }

  async componentWillReceiveProps (newProps) {
    const { selectedObj } = newProps
    const { resourceName } = selectedObj

    if (resourceName !== encryptTypes.variable && resourceName !== encryptTypes.file) {
      this.filterListByResource({ selectedObj })
    } else if (!this.isLoading) {
      if (
        (resourceName === encryptTypes.variable && !this.state.encryptTextData) ||
        (resourceName === encryptTypes.file && !this.state.encryptFileData)
      ) {
        this.isLoading = true
        await this.fetchEncryptedVariables(newProps)
      }
    }
  }

  getQueryParameters = () => {
    if (this.props.urlParams) {
      const { accountId } = this.props.urlParams
      this.acctId = accountId
    }
  }

  fetchStencils = async () => {
    const { error, resource } = await PluginService.getSettingsSchema({ accountId: this.acctId })
    if (error) {
      return
    }
    // this.stencils = resource
    this.setState({ stencils: resource })
  }

  fetchData = async () => {
    const { error, resource } = await SecretManagementService.listKMS({ accountId: this.acctId })

    if (error) {
      return
    }
    await this.setState({ encryptedList: resource, content: resource })
    this.isLoading = false

    this.props.updateLoadingStatus(false)
  }

  filterListByResource = async ({ content = this.state.encryptedList, selectedObj }) => {
    const selectedResource = selectedObj['resourceName']
    const selectedCategory = selectedObj['category']
    let filteredList

    if (content && content.length > 0) {
      if (selectedResource === 'SSH') {
        filteredList = content.filter(item => item.category === selectedCategory && item.value.connectionType === 'SSH')
      } else if (selectedCategory === categories.cloudProvider) {
        filteredList = content.filter(item => item.category === selectedCategory)
      } else if (selectedCategory === categories.connector) {
        filteredList = this.filterConnectors(selectedResource, content)
      }
      /* else if (selectedCategory === categories.serviceVariables) {
        filteredList = this.filterServiceVariables(selectedResource, content)
      } else if (selectedCategory === categories.configFiles) {
        filteredList = this.filterConfigFiles(selectedResource, content)
      }*/
    }

    this.setState({ content: filteredList, encryptTextData: null, encryptFileData: null })
  }

  getEncryptCategory = props => {
    const { selectedObj } = props
    const { resourceName } = selectedObj
    let type
    if (resourceName === encryptTypes.variable) {
      type = categories.variable
    } else if (resourceName === encryptTypes.file) {
      type = categories.file
    }
    return type
  }

  fetchEncryptedVariables = async (props = this.props) => {
    this.props.spinner.show()
    const type = this.getEncryptCategory(props)
    const { resource, error } = await EncryptService.listEncryptedVariables({ accountId: this.acctId, type: type })
    if (error) {
      return
    }

    this.props.spinner.hide()
    this.isLoading = false
    if (type === categories.variable) {
      this.setState({ encryptTextData: resource, encryptFileData: null })
    } else if (type === categories.file) {
      this.setState({ encryptFileData: resource, encryptTextData: null })
    }
  }

  filterAllResources = content => {
    return content.filter(item => (item.value && item.value.type !== 'ELB') || !item.value)
  }

  filterConnectors = (item, kmsList) => {
    let filteredList
    if (item) {
      if (item === 'Verification Providers') {
        this.select
        filteredList = this.filterConnectorByType(kmsList, verificationProviders)
      } else if (item === 'Artifact Servers') {
        filteredList = this.filterConnectorByType(kmsList, artifactServers)
      } else if (item === 'Colloboration Providers') {
        filteredList = this.filterConnectorByType(kmsList, collobProviders)
      }
    }
    return filteredList
  }

  filterConnectorByType = (kmsList, typeArray) => {
    return kmsList.filter(listItem => listItem.value && typeArray.includes(listItem.value.type))
  }

  filterServiceVariables = (item, kmsList) => {
    let filteredList
    if (kmsList && kmsList.length > 0) {
      filteredList = kmsList.filter(item => item.settingType === categories.serviceVariables)
    }
    return filteredList
  }

  filterConfigFiles = (item, kmsList) => {
    let filteredList
    if (kmsList && kmsList.length > 0) {
      filteredList = kmsList.filter(item => item.settingType === categories.configFiles)
    }
    return filteredList
  }

  renderNoData = content => {
    if (!content || content.length === 0) {
      return <main className="no-data-box">No Data Available</main>
    }
  }

  getContent = () => {
    const { selectedObj } = this.props

    const { resourceName } = selectedObj

    if (resourceName !== encryptTypes.variable && resourceName !== encryptTypes.file) {
      return this.state.content
    } else if (resourceName === encryptTypes.variable) {
      return this.state.encryptTextData
    } else if (resourceName === encryptTypes.file) {
      return this.state.encryptFileData
    }
  }

  renderContent = () => {
    const { selectedObj } = this.props

    const { category } = selectedObj
    const contentList = this.getContent()

    return (
      <section className={css.content}>{this.renderCardContentByCategory(contentList, category, selectedObj)}</section>
    )
  }

  renderCardContent = contentList => {
    if (contentList && contentList.length > 0) {
      return contentList.map(item => {
        return this.renderCardContentByCategory([item], item.category)
      })
    } else {
      return this.renderNoData(contentList)
    }
  }

  renderCardContentByCategory = (content, category, selectedObj = this.props.selectedObj) => {
    const { resourceName } = selectedObj
    const params = {
      getUsageLog: this.getUsageLog,
      getChangeLog: this.getChangeLog,
      getSetUpLog: this.getSetUpUsageLog,
      onSubmit: this.onSubmit,
      categories: categories,
      stencils: this.state.stencils,
      accountId: this.acctId,
      entityTypes: entityTypes,
      settingTypes: settingTypes,
      encryptTypes: encryptTypes,
      catalogs: this.props.dataStore.catalogs,
      renderLogButtons: this.renderLogButtons,
      updateSettingModal: this.updateSettingModal,
      renderNoData: this.renderNoData
    }

    if (category && !this.isLoading) {
      let sortedContent = content
      if (content) {
        sortedContent = Utils.sortDataByKey(content, 'name', 'ASC')
      }
      if (category === 'SETTING' && resourceName === 'SSH') {
        return (
          <SSHSettingsListView
            content={sortedContent}
            componentParams={params}
            showSSHModal={this.showSettingModal}
            selectedObj={this.props.selectedObj}
            {...this.props}
          />
        )
      } else if (resourceName === encryptTypes.variable) {
        return (
          <EncryptedVariableListView
            selectedObj={this.props.selectedObj}
            componentParams={params}
            encryptTypes={encryptTypes}
            content={sortedContent}
            onSubmit={this.onSubmitOfEncryptKeys}
            {...this.props}
            refetch={this.fetchEncryptedVariables}
          />
        )
      } else if (resourceName === encryptTypes.file) {
        return (
          <EncryptedFileListView
            selectedObj={this.props.selectedObj}
            componentParams={params}
            encryptTypes={encryptTypes}
            content={sortedContent}
            onSubmit={this.onSubmitOfEncryptKeys}
            {...this.props}
            refetch={this.fetchEncryptedVariables}
          />
        )
      } else if (category === categories.cloudProvider || category === categories.connector) {
        return <ConnectorsListView content={sortedContent} componentParams={params} {...this.props} />
      }
      /* else if (category === categories.configFiles || category === categories.serviceVariables) {
        return <ServiceConfigsListView content={sortedContent} componentParams={params} {...this.props} />
      }*/
    }
  }

  filterSchemaByType = type => {
    if (this.stencils) {
      return this.stencils[type]
    }
  }

  setSelectedObj = ({ resourceName, category }) => {
    const selectedObj = {}
    selectedObj.resourceName = resourceName
    selectedObj.category = category
    this.filterListByResource({ selectedObj })
  }

  renderTitleBreadCrumbs () {
    const path = this.props.path
    const urlParams = this.props.urlParams
    const bData = [{ label: 'Secrets Management', link: path.toSecretsManagement(urlParams) }]
    return <PageBreadCrumbs data={bData} />
  }

  onSubmit = async () => {
    this.props.spinner.show()

    await this.fetchData()
  }

  onSubmitOfEncryptKeys = async () => {
    await this.fetchEncryptedVariables()
  }

  updateShowDeleteConfirm = (updateValue, deleteHandler = null) => {
    if (updateValue && deleteHandler) {
      this.onDeleteHandler = deleteHandler
    }
    this.setState({ showDeleteConfirm: updateValue })
  }

  getUsageLog = async ({ entityId, type }) => {
    this.entityId = entityId
    this.type = type
    this.usageLog = true
    this.changeLog = false
    this.setUpLog = false
    this.setState({ showLogViewModal: true, showUsageView: false })
  }

  getChangeLog = async ({ entityId, type }) => {
    this.entityId = entityId
    this.type = type
    this.usageLog = false
    this.changeLog = true
    this.setUpLog = false
    this.setState({ showLogViewModal: true, showUsageView: false })
  }

  getSetUpUsageLog = async ({ item }) => {
    this.entityId = item.uuid
    this.usageCategory = item.type
    this.usageLog = false
    this.changeLog = false
    this.setUpLog = true
    this.setState({ showUsageView: true, showLogViewModal: false })
  }

  renderLogButtons = ({ usageClickHandler, changeLogClickHandler, setUpUsageClickHandler = null }) => {
    return (
      <section className={css.btnSection}>
        {setUpUsageClickHandler && (
          <button className={`text-btn ${css.btn}`} onClick={setUpUsageClickHandler}>
            Setup Usage
          </button>
        )}
        <button className={`text-btn ${css.btn}`} onClick={usageClickHandler}>
          Run Time Usage Log
        </button>
        <button className={`text-btn ${css.btn}`} onClick={changeLogClickHandler}>
          Change Log
        </button>
      </section>
    )
  }

  renderUsageView = () => {
    const params = {
      accountId: this.acctId,
      entityTypes: entityTypes,
      encryptTypes: encryptTypes,
      settingTypes: settingTypes,
      showSetUpLog: this.setUpLog,
      categories: categories
    }
    if (this.state.showUsageView) {
      return (
        <UsageViewModal
          show={this.state.showUsageView}
          uuid={this.entityId}
          usageCategory={this.usageCategory}
          cardparams={params}
          onHide={() => Utils.hideModal.call(this, 'showUsageView')}
          {...this.props}
        />
      )
    } else {
      return null
    }
  }

  renderLogsView = () => {
    if (this.state.showLogViewModal) {
      return (
        <SecretLogViewsModal
          show={this.state.showLogViewModal}
          entityId={this.entityId}
          type={this.type}
          accountId={this.acctId}
          onHide={() => Utils.hideModal.call(this, 'showLogViewModal')}
          {...this.props}
          showUsageLog={this.usageLog}
          showChangeLog={this.changeLog}
          entityTypes={entityTypes}
          settingTypes={settingTypes}
        />
      )
    } else {
      return null
    }
  }

  render () {
    return (
      <section>
        {this.renderContent()}

        {this.state.showDeleteConfirm && (
          <ConfirmDelete
            visible={this.state.showDeleteConfirm}
            onConfirm={this.onDeleteHandler}
            onClose={Utils.hideModal.bind(this, 'showDeleteConfirm')}
          >
            <button style={{ display: 'none' }} />
          </ConfirmDelete>
        )}

        {this.renderLogsView()}
        {this.renderUsageView()}
      </section>
    )
  }
}

export default createPageContainer()(SecretManagementListView)



// WEBPACK FOOTER //
// ../src/containers/SecretsManagementPage/views/SecretManagementListView.js