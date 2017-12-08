import React from 'react'
// import { Tabs, Tab } from 'react-bootstrap'
import { Confirm, Utils, EnvTourModal, CompUtils } from 'components'
import { TourStage, TourSteps } from 'utils'
import InfrastructureMappingCardView from './views/InfrastructureMappingCardView'
import ConfigOverrideCardView from './views/ConfigOverrideCardView'
import InfraStructureMappingModal from './InfraStructureMappingModal'
import ConfigOverrideModal from './ConfigOverrideModal'
import apis from 'apis/apis'
import css from './ServiceTemplatePage.css'

const fragmentArr = [
  { data: [] }, // will be set later
  { infraStencils: [] },
  { infrastructures: [] },
  { envServiceVariables: [] },
  { envFileOverrides: [] }
]

// ---------------------------------------- //

class ServiceTemplatePage extends React.Component {
  // TODO: propTypes
  static contextTypes = Utils.getDefaultContextTypes()
  state = {
    data: {},
    env: {},
    appServices: {},
    modalData: {},
    showTourModal: false,
    showModal: false,
    showConfigModal: false,
    showHostModal: false,
    showInfraModal: false,
    showConfigOverride: false,
    selectedService: null,
    infraModalData: null,
    templateConfigModalData: null,
    showVarsModal: false,
    templateVarsModalData: null,
    editingId: 0,
    configFileId: 0,
    isEditInfra: false,
    tabKey: 1,
    showOverrideModal: false,
    noInfraCls: 'hide',
    selectedComputeProvider: null,
    selectedPanel: null,
    noConfigsCls: 'hide',
    envConfig: false
  }

  componentWillMount () {
    this.getQueryParameters()
    if (this.acctId && this.appIdFromUrl && this.envIdFromUrl) {
      this.fetchData()
    }
    Utils.loadCatalogsToState(this)
    //  Utils.redirect({ appId: true, envId: true, page: 'detail/inframappings' })
  }
  getQueryParameters = () => {
    if (this.props.urlParams) {
      const { accountId, appId, envId } = this.props.urlParams
      this.acctId = accountId
      this.appIdFromUrl = appId
      this.envIdFromUrl = envId
    }
  }
  componentDidMount () {
    if (this.props.isTourOn && this.props.tourStage === TourStage.ENVIRONMENT) {
      setTimeout(() => {
        this.props.addSteps(TourSteps.ENVIRONMENT_SELECT_HOST)
        this.props.onTourStart()
      }, 800)
    }
    // sessionStorage.setItem('savedEnvTab', this.state.tabKey)
    this.setTabs()
  }
  setTabs = () => {
    const url = window.location.href
    if (url.indexOf('/inframappings') > -1) {
      this.setState({ tabKey: 1 })
    } else if (url.indexOf('/overrides') > -1) {
      this.setState({ tabKey: 2 })
    }
  }
  fetchData = () => {
    CompUtils.fetchComputeProviders(this)
    fragmentArr[0].data = [apis.fetchServiceTemplates, this.appIdFromUrl, this.envIdFromUrl]
    fragmentArr[1].infraStencils = [apis.fetchInfrastructuresStencils, this.appIdFromUrl]
    fragmentArr[2].infrastructures = [apis.fetchInfrastructureMapping, this.appIdFromUrl, this.envIdFromUrl]
    fragmentArr[3].envServiceVariables = [
      apis.fetchServiceVariablesForEnvironment,
      this.appIdFromUrl,
      this.envIdFromUrl
    ]
    fragmentArr[4].envFileOverrides = [
      apis.fetchServiceFileOverridesForEnvironment,
      this.appIdFromUrl,
      this.envIdFromUrl
    ]
    // fragmentArr[3].serviceVariables = [apis.fetchServiceVariables, this.appIdFromUrl, Utils.getIdFromUrl()]
    // fragmentArr[3].infraMappings=[apis.fetchInfraEnvironmentMapping,this.appIdFromUrl,this.envIdFromUrl]
    // after routing back to this component, manually fetch data:
    if (__CLIENT__ && !this.props.data) {
      Utils.fetchFragmentsToState(fragmentArr, this, (key, result) => {
        if (key === 'infrastructures') {
          if (result.resource.response.length === 0) {
            this.setState({ noInfraCls: '' })
          } else if (result.resource.response.length > 0) {
            this.setState({ noInfraCls: 'hide' })
          }
        } else if (key === 'data') {
          if (result.resource.response.length === 0) {
            this.setState({ noConfigsCls: '' })
          } else if (result.resource.response.length > 0) {
            this.setState({ noConfigsCls: 'hide' })
          }
        }
      })
      this.state.data.resource = this.state.data.resource || { response: [] } // make sure we have 'response'
      // console.log(this.state.data.resource)
    } else {
      this.setState(this.props)
    }
    sessionStorage.setItem('currentEnvId', this.envIdFromUrl)
    Utils.loadCatalogsToState(this)
    // console.log(this.state)
  }

  onNameClick = serviceTemplate => {
    Utils.redirect({ appId: true, envId: true, serviceId: serviceTemplate.serviceId, page: 'detail' })
  }

  onHostAdd = () => {
    this.setState({ showHostModal: true })
    if (this.props.isTourOn && this.props.tourStage === TourStage.ENVIRONMENT) {
      this.props.onTourPause()
    }
  }

  onHideModal = () => {
    if (!(this.props.isTourOn && this.props.tourStage === TourStage.ENVIRONMENT)) {
      Utils.hideModal.call(this, 'showHostModal')
    }
  }

  onConfigOverrideAdd = (serviceTemplate, config) => {
    this.setState({
      showConfigOverride: true,
      selectedService: serviceTemplate,
      templateConfigModalData: config,
      configFileId: 0
    })
  }

  onServiceVariableAdd = (serviceTemplate, serviceVariable) => {
    this.setState({
      showVarsModal: true,
      selectedService: serviceTemplate,
      templateVarsModalData: serviceVariable,
      editingId: 0
    })
  }

  onTourSubmit = () => {
    this.setState({ showTourModal: false })
    this.props.setTourStage(TourStage.ARTIFACT)
    Utils.redirect({ appId: this.appIdFromUrl, page: 'setup' })
  }

  onTourCancel = () => {
    this.setState({ showTourModal: false })
    this.props.onTourStop()
  }

  onHideInfraModal = () => {
    this.setState({ showInfraModal: false, selectedService: null })
  }

  onAddInfra = () => {
    this.setState({ showInfraModal: true, infraModalData: null })
    // this.setState({ showInfraModal: true, selectedService: service, infraModalData: null })
  }

  onEditInfra = (service, infraMapping) => {
    this.setState({ showInfraModal: true, selectedService: service, infraModalData: infraMapping, isEditInfra: true })
  }

  onAddInfraProvider = () => {
    this.setState({ showConnectorModal: true })
  }

  onDeleteConfigOverride = (serviceTemplate, config) => {
    this.setState({
      showConfirm: true,
      deletingId: config.uuid,
      deletingType: 'config',
      selectedService: serviceTemplate
    })
  }

  onDeleteConfigVarOverride = (serviceTemplate, serviceVariable) => {
    this.setState({
      showConfirm: true,
      deletingId: serviceVariable.uuid,
      deletingType: 'configVariable',
      selectedService: serviceTemplate
    })
  }
  onDeleteAllConfigVarOverride = serviceVariable => {
    this.setState({
      showConfirm: true,
      deletingId: serviceVariable.uuid,
      deletingType: 'allConfigVarOverride'
    })
  }
  onDeleteAllConfigFileOverride = serviceVariable => {
    this.setState({
      showConfirm: true,
      deletingId: serviceVariable.uuid,
      deletingType: 'allConfigFileOverride'
    })
  }

  onEditConfigVarOverride = (serviceTemplate, serviceVariable) => {
    this.setState({
      selectedService: serviceTemplate,
      templateVarsModalData: serviceVariable,
      showOverrideModal: true,
      editingId: serviceVariable[0].uuid
    })
  }
  onEditConfigFileOverride = (serviceTemplate, configFileOverride) => {
    this.setState({
      selectedService: serviceTemplate,
      templateConfigModalData: configFileOverride,
      showOverrideModal: true,
      configFileId: configFileOverride[0].uuid
    })
  }
  onEditAllConfigVarOverride = serviceVariable => {
    this.setState({
      templateVarsModalData: serviceVariable,
      showOverrideModal: true,
      editingId: serviceVariable[0].uuid,
      envConfig: true
    })
  }
  onEditAllConfigFileOverride = configFileOverride => {
    this.setState({
      templateConfigModalData: configFileOverride,
      showOverrideModal: true,
      configFileId: configFileOverride[0].uuid,
      envConfig: true
    })
  }
  onDeleteInfra = uuid => {
    this.setState({ showConfirm: true, deletingId: uuid, deletingType: 'infraMapping' })
  }

  onDeleteConfirmed = () => {
    if (this.state.deletingType === 'infraMapping') {
      apis.service
        .destroy(
          apis.getInfrastructureMappingEndPoint(this.appIdFromUrl, this.envIdFromUrl, null, this.state.deletingId)
        )
        .then(() => this.fetchData())
        .catch(error => {
          this.fetchData()
          throw error
        })
    }

    if (this.state.deletingType === 'config') {
      const stUid = this.state.selectedService.uuid
      this.setState({ selectedPanel: this.state.selectedService.name })
      apis.service
        .destroy(apis.getConfigEndpoint(this.appIdFromUrl, this.envIdFromUrl, this.state.deletingId, stUid, stUid))
        .then(() => this.fetchData())
        .catch(error => {
          this.fetchData()
          throw error
        })
    }

    if (this.state.deletingType === 'configVariable') {
      const stUid = this.state.selectedService.uuid
      this.setState({ selectedPanel: this.state.selectedService.name })
      apis.service
        .destroy(
          apis.getServiceVariablesEndpoint(this.appIdFromUrl, this.envIdFromUrl, this.state.deletingId, stUid, stUid)
        )
        .then(() => this.fetchData())
        .catch(error => {
          this.fetchData()
          throw error
        })
    }

    if (this.state.deletingType === 'allConfigVarOverride') {
      this.deleteAllConfigVarOverride()
    }
    if (this.state.deletingType === 'allConfigFileOverride') {
      this.deleteAllConfigFileOverride()
    }

    this.setState({ showConfirm: false, deletingId: '', deletingType: '' })
  }

  deleteAllConfigVarOverride = () => {
    apis.service
      .destroy(apis.getServiceVariablesEndpoint(this.appIdFromUrl, this.envIdFromUrl, this.state.deletingId, '', ''))
      .then(() => this.fetchData())
      .catch(error => {
        this.fetchData()
        throw error
      })
  }
  deleteAllConfigFileOverride = () => {
    apis.service
      .destroy(apis.getConfigEndpoint(this.appIdFromUrl, this.envIdFromUrl, this.state.deletingId, '', ''))
      .then(() => this.fetchData())
      .catch(error => {
        this.fetchData()
        throw error
      })
  }
  onSubmitConnector = data => {
    CompUtils.fetchComputeProviders(this, () =>
      this.setState({
        showInfraModal: true,
        selectedComputeProvider: data.resource.uuid
      })
    )
    Utils.hideModal.call(this, 'showConnectorModal')
  }

  onSubmitInfraProvider = (data, isEditing) => {
    this.setState({ infraModalData: null })
    this.fetchData()
    this.onHideInfraModal()
  }

  onSubmitVarsModal = (formData, isEdit) => {
    const data = Utils.clone(formData)
    //  data.entityType = 'SERVICE_TEMPLATE'
    // data.targetToAllEnv = true
    const handleResp = resp => {
      this.fetchData()
      Utils.hideModal.call(this, 'showOverrideModal')
    }
    if (isEdit) {
      apis.service
        .replace(apis.getServiceVariablesEndpoint(this.appIdFromUrl, data.templateId, data.uuid, 'SERVICE_TEMPLATE'), {
          body: JSON.stringify(data)
        })
        .then(handleResp)
        .catch(error => {
          throw error
        })
    } else {
      apis.service
        .fetch(apis.getServiceVariablesEndpoint(this.appIdFromUrl, data.templateId, '', 'SERVICE_TEMPLATE'), {
          method: 'POST',
          body: JSON.stringify(data)
        })
        .then(handleResp)
    }
  }

  showConfigOverrideModal = () => {
    this.setState({ showOverrideModal: true, selectedService: null })
  }

  hideConfigOverrideModal = () => {
    this.setState({
      selectedService: null,
      editingId: 0,
      configFileId: 0,
      templateVarsModalData: null,
      templateConfigModalData: null,
      envConfig: false
    })
    Utils.hideModal.call(this, 'showOverrideModal')
  }

  refreshAfterSave = selectedPanel => {
    this.setState({ selectedPanel, envConfig: false })
    this.fetchData()
    Utils.hideModal.call(this, 'showOverrideModal')
  }

  setEnvConfigsForAllServices = () => {
    this.setState({ envConfig: false })
    Utils.hideModal.call(this, 'showOverrideModal')
  }

  render () {
    const widgetViewParams = {
      data: this.state.data.resource.response,
      //    envServiceVariables: this.state.envServiceVariables.resource.response,
      onNameClick: this.onNameClick,
      onConfigOverrideAdd: this.onConfigOverrideAdd,
      onDeleteConfigOverride: this.onDeleteConfigOverride,
      onDeleteConfigVarOverride: this.onDeleteConfigVarOverride,
      envIdFromUrl: this.envIdFromUrl,
      appIdFromUrl: this.appIdFromUrl,
      onAddInfra: this.onAddInfra,
      onEditInfra: this.onEditInfra,
      onDeleteInfra: this.onDeleteInfra,
      onServiceVariableAdd: this.onServiceVariableAdd,
      onEditConfigFileOverride: this.onEditConfigFileOverride,
      onEditConfigVarOverride: this.onEditConfigVarOverride,
      onConfigAdd: this.showConfigOverrideModal,
      onEditAllConfigVarOverride: this.onEditAllConfigVarOverride,
      onDeleteAllConfigVarOverride: this.onDeleteAllConfigVarOverride,
      onEditAllConfigFileOverride: this.onEditAllConfigFileOverride,
      onDeleteAllConfigFileOverride: this.onDeleteAllConfigFileOverride
    }

    const infrastructures = Utils.getJsonValue(this, 'state.infrastructures.resource.response') || []
    const computeProviders = Utils.getJsonValue(this, 'state.computeProviders.resource.response') || []
    const infraStencils = Utils.getJsonValue(this, 'state.infraStencils.resource')
    const envServiceVariables = Utils.getJsonValue(this, 'state.envServiceVariables.resource.response') || []
    const envFileOverrides = Utils.getJsonValue(this, 'state.envFileOverrides.resource.response') || []
    const objComputeProviders = {}
    computeProviders.map(computeProvider => {
      objComputeProviders[computeProvider.uuid] = computeProvider
    })
    return (
      <section className={css.main}>
        <InfrastructureMappingCardView
          params={widgetViewParams}
          objComputeProviders={objComputeProviders}
          infrastructures={infrastructures}
          headerComponent={this.props.headerComponent}
          catalogs={this.state.catalogs}
          noInfraCls={this.state.noInfraCls}
          loadingStatus={this.state.loadingStatus}
        />

        <ConfigOverrideCardView
          params={widgetViewParams}
          catalogs={this.state.catalogs}
          overrideScope={this.state.catalogs && this.state.catalogs.OVERRIDE_TYPE}
          selectedService={this.state.selectedService}
          selectedPanel={this.state.selectedPanel}
          noConfigsCls={this.state.noConfigsCls}
          loadingStatus={this.state.loadingStatus}
          envServiceVariables={envServiceVariables}
          envFileOverrides={envFileOverrides}
        />
        <Confirm
          visible={this.state.showConfirm}
          onConfirm={this.onDeleteConfirmed}
          onClose={Utils.hideModal.bind(this, 'showConfirm')}
          body="Are you sure you want to delete this?"
          confirmText="Confirm Delete"
          title="Deleting"
        >
          <button style={{ display: 'none' }} />
        </Confirm>
        <EnvTourModal show={this.state.showTourModal} onHide={this.onTourCancel} onSubmit={this.onTourSubmit} />
        <InfraStructureMappingModal
          appId={this.appIdFromUrl}
          envId={this.envIdFromUrl}
          data={this.state.infraModalData}
          infraStencils={infraStencils}
          show={this.state.showInfraModal}
          onHide={this.onHideInfraModal}
          objComputeProviders={objComputeProviders}
          onAddInfraProvider={this.onAddInfraProvider}
          onSubmit={this.onSubmitInfraProvider}
          onSubmitConnector={this.onSubmitConnector}
          isEditInfra={this.state.isEditInfra}
          params={widgetViewParams}
          catalogs={this.state.catalogs}
          selectedComputeProvider={this.state.selectedComputeProvider}
        />
        {/* New modal for config overrides*/}
        <ConfigOverrideModal
          show={this.state.showOverrideModal}
          onHide={() => this.hideConfigOverrideModal()}
          params={widgetViewParams}
          catalogs={this.state.catalogs}
          afterSubmit={res => this.refreshAfterSave(res)}
          submitVarModal={this.onSubmitVarsModal}
          editingId={this.state.editingId}
          configFileId={this.state.configFileId}
          selectedService={this.state.selectedService}
          templateVarsModalData={this.state.templateVarsModalData}
          templateConfigModalData={this.state.templateConfigModalData}
          envId={this.envIdFromUrl}
          reFetch={this.fetchData}
          hideModal={this.setEnvConfigsForAllServices}
          envConfig={this.state.envConfig}
          appId={this.appIdFromUrl}
          envId={this.envIdFromUrl}
          accountId={ this.acctId }
        />
      </section>
    )
  }
}

export default Utils.createTransmitContainer(ServiceTemplatePage, fragmentArr)



// WEBPACK FOOTER //
// ../src/containers/ServiceTemplatePage/ServiceTemplatePage.js