import React from 'react'
import { Modal } from 'react-bootstrap'
import { WingsForm, WingsModal, Utils } from 'components'
import css from './ConfigOverrideModal.css'
import TemplateConfigModal from './TemplateConfigModal'
import TemplateConfigVarsModal from './TemplateConfigVarsModal'

const addSelect = 'All'
const configOverrideTypeUiSchema = {
  'ui:widget': 'radio',
  'ui:options': { inline: true },
  classNames: '__override-type'
}
const schema = {
  type: 'object',
  required: ['serviceId'],
  properties: {
    serviceId: { type: 'string', title: 'Service', enum: [addSelect], enumNames: [addSelect] },
    configOverrideType: {
      type: 'string',
      title: 'Override Type',
      enum: ['variable', 'file'],
      enumNames: ['Variable Override', 'File Override']
    }
  }
}

const disableString = { 'ui:disabled': true }
const uiSchema = {
  configOverrideType: {
    'ui:widget': 'radio',
    'ui:options': { inline: true },
    classNames: '__override-type'
  }
}
const log = type => {} // console.log.bind(console, type)

export default class ConfigOverrideModal extends React.Component {
  state = {
    schema,
    uiSchema,
    formData: {},
    showConfigFileOverrideModal: false,
    showConfigVarOverrideModal: false,
    configVarsData: null,
    serviceTemplate: null,
    configFilesData: null,
    initialized: false
  }
  stencils = null

  componentWillMount () {
    if (this.props.show) {
      this.setServiceIdEnum(schema, this.props.selectedItem)
    }
  }

  componentWillReceiveProps (newProps) {
    if (newProps.show && !this.state.initialized) {
      this.setState({ initialized: true })
      this.modifySchema(newProps)
    }
  }

  modifySchema = newProps => {
    if (newProps.params) {
      const propsData = Utils.clone(newProps.params.data)
      const servicesLength = propsData.length

      if (servicesLength > 0) {
        this.setServiceTemplateIds(propsData, schema)
      }
      this.setConfigModalOptionsForSelectedService(newProps)
    } else if (this.props.selectedItem) {
      this.setServiceIdEnum(schema, newProps.selectedItem)
      this.setState({ schema, uiSchema })
    }
  }

  setConfigModalOptionsForSelectedService = newProps => {
    const data = Utils.clone(this.state.formData)

    if (newProps.selectedService !== null || newProps.envConfig) {
      data.serviceId = newProps.envConfig ? 'All' : newProps.selectedService.uuid

      if (newProps.editingId) {
        this.setShowForVarsModal(data)
      } else if (newProps.configFileId) {
        this.setShowForConfigFilesModal(data)
      }

      uiSchema.configOverrideType = disableString
      uiSchema.serviceId = disableString
      this.setState({ schema, uiSchema })
    } else {
      this.resetSchema()
    }
  }

  setServiceTemplateIds = (propsData, schema) => {
    const serviceTemplateIds = propsData.map(serviceTemplate => serviceTemplate.uuid)
    const serviceNames = propsData.map(
      serviceTemplate =>
        serviceTemplate.name + '(' + this.getCatalogArtifactName(serviceTemplate.serviceArtifactType) + ')'
    )
    schema.properties.serviceId.enum = serviceTemplateIds.concat([addSelect])
    schema.properties.serviceId.enumNames = serviceNames.concat(['All Services'])
  }

  setServiceIdEnum = (schema, item) => {
    const { service, artifactType, envConfig, overrideType } = this.props
    const data = Utils.clone(this.state.formData)

    const serviceName = `${service} (${this.getCatalogArtifactName(artifactType)})`
    schema.properties.serviceId.enum = [item.entityId].concat([addSelect])
    schema.properties.serviceId.enumNames = [serviceName].concat(['All Services'])
    data.serviceId = envConfig ? 'All' : item.entityId
    uiSchema.configOverrideType = disableString
    uiSchema.serviceId = disableString
    this.setState({ schema, uiSchema })

    if (overrideType === 'variable') {
      this.setShowForVarsModal(data)
    } else if (overrideType === 'file') {
      this.setShowForConfigFilesModal(data)
    }
  }

  setShowForVarsModal = data => {
    data.configOverrideType = 'variable'
    this.setState({ formData: data, showConfigVarOverrideModal: true })
  }
  setShowForConfigFilesModal = data => {
    data.configOverrideType = 'file'
    this.setState({ formData: data, showConfigFileOverrideModal: true })
  }
  getCatalogArtifactName = serviceArtifactType => {
    if (serviceArtifactType) {
      return Utils.getCatalogDisplayText(this.props.catalogs, 'ARTIFACT_TYPE', serviceArtifactType)
    }
    return
  }

  onSubmit = ({ formData }) => {
    console.log('onSubmit ', formData)
  }

  onSelectVarOverride = () => {
    const data = this.state.formData
    const propsData = Utils.clone(this.props.params.data)
    if (data && data.serviceId) {
      if (data.serviceId !== addSelect) {
        const serviceTemplateId = data.serviceId
        const serviceData = propsData.find(service => service.uuid === serviceTemplateId)
        if (serviceData) {
        }
      }
      this.setState({
        showConfigVarOverrideModal: true,
        showConfigFileOverrideModal: false
      })
    }
  }
  onSelectFileOverride = () => {
    const data = this.state.formData
    const propsData = Utils.clone(this.props.params.data)
    if (data && data.serviceId) {
      if (data.serviceId !== addSelect) {
        const serviceTemplateId = data.serviceId
        const serviceData = propsData.find(service => service.uuid === serviceTemplateId)
        if (serviceData) {
        }
      }
      this.setState({
        showConfigFileOverrideModal: true,
        showConfigVarOverrideModal: false
      })
    }
  }

  getOverrides (configurations, overrides, checkKey) {
    if (configurations.length === 0) {
      return []
    } else if (overrides.length === 0) {
      return configurations
    }
    const result = configurations.reduce((res, key, index) => {
      /* if ( overrides.indexOf(configurations[index].name) === -1 ) {
       // delete configVariables[index].value
        res.push(configurations[index])
      }*/
      const config = configurations[index]
      const savedOverrideIdx = overrides.findIndex(override => override[checkKey] === config.uuid)
      if (savedOverrideIdx < 0) {
        res.push(config)
      }
      return res
    }, [])

    return result
  }

  setServiceTemplate = data => {
    if (data && data.serviceId && data.serviceId !== addSelect) {
      const serviceTemplateId = data.serviceId
      const serviceData = this.props.params.data.find(service => service.uuid === serviceTemplateId)
      if (serviceData) {
        this.setState({
          configFilesData: this.getOverrides(
            Utils.clone(serviceData.serviceConfigFiles),
            Utils.clone(serviceData.configFilesOverrides),
            'parentConfigFileId'
          ),
          serviceTemplate: serviceData,
          configVarsData: this.getOverrides(
            Utils.clone(serviceData.serviceVariables),
            Utils.clone(serviceData.serviceVariablesOverrides),
            'parentServiceVariableId'
          ),
          showConfigVarOverrideModal: false,
          showConfigFileOverrideModal: false
        })
      }
      data.configOverrideType = serviceData.serviceArtifactType === 'DOCKER' ? 'variable' : ''
      this.setOverrideType(serviceData.serviceArtifactType)
    } else if (!data.serviceId || data.serviceId === addSelect) {
      const uiSchema = Utils.clone(this.state.uiSchema)
      uiSchema.configOverrideType = configOverrideTypeUiSchema
      this.setState({
        serviceTemplate: null,
        showConfigFileOverrideModal: false,
        showConfigVarOverrideModal: false,
        configVarsData: null,
        configFilesData: null,
        uiSchema
      })
      data.configOverrideType = ''
    }
  }
  setOverrideType = artifactType => {
    const schema = Utils.clone(this.state.schema)
    const uiSchema = Utils.clone(this.state.uiSchema)
    if (artifactType === 'DOCKER') {
      uiSchema.configOverrideType = {
        'ui:widget': 'radio',
        'ui:options': { inline: true },
        'ui:disabled': true,
        classNames: '__override-type'
      }
      schema.properties.configOverrideType.enum = ['variable', 'file']
      schema.properties.configOverrideType.enumNames = ['Variable Override', 'File Override']

      this.setState({ showConfigVarOverrideModal: true })
    } else if (artifactType) {
      uiSchema.configOverrideType = {
        'ui:widget': 'radio',
        'ui:options': { inline: true },
        classNames: '__override-type'
      }
      schema.properties.configOverrideType.enum = ['variable', 'file']
      schema.properties.configOverrideType.enumNames = ['Variable Override', 'File Override']
    }
    this.setState({ schema, uiSchema })
  }
  onChange = ({ formData }) => {
    const prevData = Utils.clone(this.state.formData)

    if (prevData === null || formData.serviceId !== prevData.serviceId) {
      this.setServiceTemplate(formData)
    } else if (prevData === null || formData.configOverrideType !== prevData.configOverrideType) {
      if (formData.configOverrideType === 'variable') {
        this.onSelectVarOverride()
      } else if (formData.configOverrideType === 'file') {
        this.onSelectFileOverride()
      } else {
        this.setState({
          showConfigVarOverrideModal: false,
          showConfigFileOverrideModal: false
        })
      }
      // this.setState({ formData })
    }
    this.setState({ formData })
  }
  resetSchema = (hide = false) => {
    const { selectedItem } = this.props

    if (!selectedItem) {
      const schema = Utils.clone(this.state.schema)
      const uiSchema = Utils.clone(this.state.uiSchema)
      const data = Utils.clone(this.state.formData)

      schema.properties.serviceId['enum'] = this.props.params.data.map(service => service.uuid).concat([addSelect])
      schema.properties.serviceId['enumNames'] = this.props.params.data
        .map(service => service.name + '(' + this.getCatalogArtifactName(service.serviceArtifactType) + ')')
        .concat(['All Services'])
      uiSchema.serviceId = {}
      uiSchema.configOverrideType = {
        'ui:widget': 'radio',
        'ui:options': { inline: true },
        classNames: '__override-type'
      }
      data.serviceId = ''
      data.configOverrideType = ''
      this.setState({
        schema,
        uiSchema,
        showConfigVarOverrideModal: false,
        showConfigFileOverrideModal: false,
        formData: data,
        configVarsData: null,
        configFilesData: null
      })
    }
    if (hide) {
      this.setState({ initialized: false })
      this.props.onHide()
    }
  }

  getSelectedServiceId = () => {
    let selectedServiceId
    const { service, selectedItem } = this.props
    if (this.props.params) {
      const { data } = this.props.params
      selectedServiceId = this.state.formData.serviceId

      if (selectedServiceId && selectedServiceId.toLowerCase() !== 'all') {
        selectedServiceId = data.find(serviceTemplate => serviceTemplate.uuid === selectedServiceId).serviceId
      }
    } else if (selectedItem && service !== 'All') {
      selectedServiceId = this.props.selectedItem.entityId
    } else {
      selectedServiceId = service
    }
    return selectedServiceId
  }

  getEnvId = (serviceId, selectedItem) => {
    const { envId } = this.props
    let environmentId

    if (envId) {
      environmentId = envId
    } else if (serviceId === 'All') {
      environmentId = selectedItem.entityId
    } else if (selectedItem) {
      environmentId = selectedItem.envId
    }
    return environmentId
  }

  setParamsForRendering = (configData, editingId) => {
    const { selectedItem, appId } = this.props
    const selectedServiceId = this.getSelectedServiceId()
    const environmentId = this.getEnvId(selectedServiceId, selectedItem)
    const applicationId = appId ? appId : selectedItem.appId

    let data
    let editId
    if (configData) {
      data = configData
      editId = editingId
    } else if (selectedItem) {
      data = [selectedItem]
      editId = selectedItem.uuid
    }
    return { environmentId, applicationId, data, editId, selectedServiceId }
  }

  renderConfigVarOverridesModal = () => {
    const params = {
      setEncryptVarModal: this.setEncryptVarModal
    }
    const { showConfigVarOverrideModal, configVarsData } = this.state
    const { editingId, templateVarsModalData, accountId } = this.props
    const { environmentId, applicationId, data, editId, selectedServiceId } = this.setParamsForRendering(
      editingId !== 0 ? templateVarsModalData : configVarsData,
      editingId
    )
    const { enableOnlySecretKeys } = this.props
    if (showConfigVarOverrideModal) {
      return (
        <TemplateConfigVarsModal
          serviceId={selectedServiceId}
          show={this.state.showConfigVarOverrideModal}
          data={data}
          serviceTemplate={this.state.serviceTemplate || this.props.selectedService}
          entityId={this.state.serviceTemplate ? this.state.serviceTemplate.uuid : this.props.editingId}
          entityType={'SERVICE_TEMPLATE'}
          catalogs={this.props.catalogs}
          editingId={editId}
          afterSubmit={res => this.props.afterSubmit(res)}
          resetSchema={this.resetSchema}
          envId={environmentId}
          appId={applicationId}
          reFetch={this.props.reFetch}
          hideModal={this.props.hideModal || this.props.onHide}
          envServiceVariables={this.props.envServiceVariables}
          enableOnlySecretKeys={enableOnlySecretKeys}
          accountId={accountId}
          params={params}
        />
      )
    }
  }

  renderConfigFileOverridesModal = () => {
    const { showConfigFileOverrideModal, configFilesData } = this.state
    const { configFileId, templateConfigModalData, accountId } = this.props

    const { environmentId, applicationId, data, editId, selectedServiceId } = this.setParamsForRendering(
      configFileId !== 0 ? templateConfigModalData : configFilesData,
      configFileId
    )
    const { enableOnlySecretKeys } = this.props
    if (showConfigFileOverrideModal) {
      return (
        <TemplateConfigModal
          show={this.state.showConfigFileOverrideModal}
          data={data}
          serviceTemplate={this.state.serviceTemplate || this.props.selectedService}
          entityId={this.state.serviceTemplate ? this.state.serviceTemplate.uuid : editId}
          entityType={'SERVICE_TEMPLATE'}
          catalogs={this.props.catalogs}
          configFileId={editId}
          afterSubmit={res => this.props.afterSubmit(res)}
          resetSchema={this.resetSchema}
          envId={environmentId}
          hideModal={this.props.hideModal || this.props.onHide}
          reFetch={this.props.reFetch}
          serviceId={selectedServiceId}
          appId={applicationId}
          enableOnlySecretKeys={enableOnlySecretKeys}
          accountId={accountId}
        />
      )
    }
  }

  render () {
    return (
      <WingsModal show={this.props.show} onHide={() => this.resetSchema(true)} className={css.main}>
        <Modal.Header closeButton>
          <Modal.Title>Service Configuration Override</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <span style={{ color: 'red' }}>{this.errText}</span>
          <WingsForm
            name="Service Template"
            ref="form"
            schema={this.state.schema}
            uiSchema={this.state.uiSchema}
            formData={this.state.formData}
            onChange={this.onChange}
            onSubmit={this.onSubmit}
            onError={log('errors')}
          >
            <button className="hidden" type="submit" />
          </WingsForm>
          {this.renderConfigVarOverridesModal()}
          {this.renderConfigFileOverridesModal()}
        </Modal.Body>
      </WingsModal>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/ServiceTemplatePage/ConfigOverrideModal.js