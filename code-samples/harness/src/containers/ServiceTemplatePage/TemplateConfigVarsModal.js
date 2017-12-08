import React from 'react'
import apis from 'apis/apis'
import { WingsForm, Utils } from 'components'
import OverrideSelect from './OverrideSelect'
import css from './ConfigOverride.css'
import FormUtils from '../../components/Utils/FormUtils'
import { EncryptService } from 'services'
import { MentionsType } from '../../utils/Constants'
import { MentionUtils } from 'utils'

import EncryptVariablesModal from '../SecretsManagementPage/EncryptResources/EncryptVariablesModal'

const types = {
  TEXT: 'TEXT',
  ENCRYPTED: 'ENCRYPTED_TEXT'
}
const schema = {
  type: 'object',
  required: ['value'],
  properties: {
    uuid: { type: 'string', title: 'uuid', default: '' },
    configurationVariables: { type: 'string', title: 'Configuration Variables' },
    overrideType: {
      type: 'string',
      title: 'Override Scope',
      default: 'ALL'
    },
    value: { type: 'string', title: 'Override Value', default: '' },
    type: { type: 'string', title: 'Type', default: 'TEXT' },
    entityType: { type: 'string', title: 'entityType', default: '' },
    entityId: { type: 'string', title: 'entityId', default: '' }
  }
}

const uiSchema = {
  uuid: { 'ui:widget': 'hidden' },
  entityId: { 'ui:widget': 'hidden' },
  entityType: { 'ui:widget': 'hidden' },
  value: {},
  type: {},
  configurationVariables: {},
  'ui:order': ['configurationVariables', 'overrideType', 'type', 'value', 'entityId', 'entityType', 'uuid']
}

export default class TemplateConfigVarsModal extends React.Component {
  state = {
    schema,
    uiSchema,
    formData: {},
    errorMessage: '',
    errorClass: css.hide,
    initialized: false,
    editingId: 0,
    formSubmitted: false
  }
  isEdit = false

  customSelect = props => {
    const { editingId } = this.props
    const disabled = editingId && editingId !== 0 ? true : false
    return <OverrideSelect selectprops={props} disabled={disabled} />
  }

  componentWillReceiveProps (newProps) {
    if (newProps.show) {
      const { serviceId } = this.props
      if (!this.state.initialized) {
        this.setState({ initialized: true })
        this.isEdit = newProps.data ? true : false

        if (newProps.data || serviceId !== 'All') {
          this.updateSchema(newProps.data)
          this.entityId = serviceId !== 'All' ? newProps.entityId : newProps.envId
          this.entityType = serviceId !== 'All' ? newProps.entityType : 'ENVIRONMENT'
        } else if (serviceId === 'All') {
          this.updateSchemaForAllServices()
          this.entityId = newProps.envId
          this.entityType = 'ENVIRONMENT'
        }
      }
    }
  }

  componentDidMount () {
    this.setupMentions()
  }

  componentDidUpdate () {
    this.setupMentions()
  }

  setupMentions () {
    if (this.props.show) {
      const { appId, envId: entityId, serviceId } = this.props

      MentionUtils.registerForField({
        field: 'value',
        type: MentionsType.ENVIRONMENT_OVERRIDES,
        args: {
          appId,
          entityType: 'ENVIRONMENT',
          entityId,
          serviceId
        }
      })
    }
  }

  cloneSchema = () => {
    const uiSchema = Utils.clone(this.state.uiSchema)
    const schema = Utils.clone(this.state.schema)

    return { schema, uiSchema }
  }

  modifyConfigVariableEnum = data => {}

  updateSchemaForAllServices () {
    const { schema, uiSchema } = this.cloneSchema()

    const overrideScopes = this.props.catalogs.OVERRIDE_TYPE.map(type => type.value)
    const overrideScopeNames = this.props.catalogs.OVERRIDE_TYPE.map(type => type.name)
    schema.properties.overrideType.enum = overrideScopes
    schema.properties.overrideType.enumNames = overrideScopeNames
    uiSchema.overrideType = { 'ui:disabled': true }
    const serviceVariableTypes = this.props.catalogs.SERVICE_VARIABLE_TYPE.map(type => type.value)
    const serviceVariableTypeNames = this.props.catalogs.SERVICE_VARIABLE_TYPE.map(type => type.name)

    schema.properties.type.enum = serviceVariableTypes
    schema.properties.type.enumNames = serviceVariableTypeNames
    this.setState({ schema, uiSchema })
  }

  updateSchema (serviceVariables) {
    const { schema, uiSchema } = this.cloneSchema()
    const formData = Utils.clone(this.state.formData)

    schema.properties.configurationVariables = { title: 'Configuration Variable', type: 'string' }
    if (serviceVariables && serviceVariables.length > 0) {
      const serviceVariableKeys = serviceVariables.map(item => item.name)
      const variableSet = new Set(serviceVariableKeys)
      schema.properties.configurationVariables.options = Array.from(variableSet)
      uiSchema.type = { 'ui:disabled': true }
    } else {
      uiSchema.type = { 'ui:disabled': true }
    }

    uiSchema.configurationVariables = { 'ui:widget': this.customSelect }

    const overrideScopes = this.props.catalogs.OVERRIDE_TYPE.map(type => type.value)
    const overrideScopeNames = this.props.catalogs.OVERRIDE_TYPE.map(type => type.name)
    schema.properties.overrideType.enum = overrideScopes
    schema.properties.overrideType.enumNames = overrideScopeNames
    uiSchema.overrideType = { 'ui:disabled': true }
    const serviceVariableTypes = this.props.catalogs.SERVICE_VARIABLE_TYPE.map(type => type.value)
    const serviceVariableTypeNames = this.props.catalogs.SERVICE_VARIABLE_TYPE.map(type => type.name)

    schema.properties.type.enum = serviceVariableTypes
    schema.properties.type.enumNames = serviceVariableTypeNames

    const { editingId } = this.props

    if (editingId && editingId !== 0) {
      const variableData = serviceVariables[0]
      const initialKey = variableData !== undefined ? variableData.name : ''

      if (variableData) {
        formData.configurationVariables = initialKey
        formData.type = variableData.type
        formData.value = formData.type === types.ENCRYPTED ? variableData.encryptedValue : variableData.value
        uiSchema.type = { 'ui:disabled': true }
      }
      if (formData.type === types.ENCRYPTED) {
        formData.value = variableData.encryptedValue
        formData.encryptedValue = variableData.encryptedValue
        return this.updateValuePropertyWithEnums({ formData, schema, uiSchema })
      } else {
        return this.updateValuePropertyWithMentions({ formData, schema, uiSchema })
      }
    }

    this.setState({ schema, uiSchema, formData })
  }

  addConfigVarToSchema (serviceVariableKeys) {}

  filterConfigVarData (currentConfiguration, overrideType, createVariable = false) {
    const serviceTemplate = this.props.serviceTemplate
    const { uiSchema } = this.cloneSchema()
    const variableData = serviceTemplate.serviceVariablesOverrides.find(
      variable => variable.name === currentConfiguration
    )
    const formData = {}
    let editingId
    formData.name = currentConfiguration

    formData.overrideType = overrideType
    if (variableData && currentConfiguration !== '') {
      formData.configurationVariables = currentConfiguration
      formData.type = variableData.type
      formData.value = variableData.value
      uiSchema.type = { 'ui:disabled': true }
      editingId = variableData.uuid
    } else if (currentConfiguration !== '') {
      formData.configurationVariables = currentConfiguration
      if (createVariable) {
        uiSchema.type = {}
      }
    }
    uiSchema.configurationVariables = { 'ui:widget': this.customSelect }
    this.setState({ formData, uiSchema, editingId })
  }

  disableControls (data) {
    const uiSchema = this.state.uiSchema
    uiSchema.type = { 'ui:disabled': true }
    this.setState({ formData: data || {} })
  }

  onSubmit = ({ formData }) => {
    const { editingId } = this.props

    this.setState({ formSubmitted: true })

    if (this.isValid(formData)) {
      /* const type = formData.type
      if (type === types.ENCRYPTED) {
        formData.encryptedValue = formData.value
        formData.value = null
        formData.updateReference = true
      }*/
      this.isEdit = editingId && editingId !== 0 ? true : false

      if (this.props.serviceId !== 'All') {
        this.onSubmitForRegularConfigs(formData, this.isEdit)
      } else if (this.props.serviceId === 'All') {
        formData.entityId = this.entityId
        formData.entityType = this.entityType

        if (this.isEdit) {
          delete formData.configurationVariables
          formData.uuid = this.props.editingId
        }
        this.onSubmitVarsModalForAll(formData, this.isEdit)
      }
    }
  }

  onSubmitForRegularConfigs = (formData, isEdit) => {
    const { serviceTemplate, data } = this.props

    if (serviceTemplate) {
      const serviceVariables = serviceTemplate.serviceVariables
      const serviceVariable = serviceVariables.find(item => item.name === formData.configurationVariables)
      formData.name = formData.hasOwnProperty('name') ? formData.name : formData.configurationVariables
      if (serviceVariable !== undefined) {
        formData.parentServiceVariableId = serviceVariable.uuid
      }
      formData.templateId = this.props.serviceTemplate.uuid
    } else if (data && data.length > 0) {
      formData.name = data[0].name
      formData.parentServiceVariableId = data[0].parentServiceVariableId
      formData.templateId = data[0].entityId
    }
    this.isEdit = this.props.editingId !== 0 ? true : false

    if (!this.isEdit) {
      delete formData.configurationVariables
      delete formData.uuid
    } else {
      delete formData.configurationVariables
      formData.uuid = this.props.editingId // savedOverride.uuid
    }
    formData.value = formData.value
    formData.type = formData.type

    formData.entityId = this.entityId
    formData.entityType = this.entityType
    this.onSubmitVarsModal(formData, this.isEdit)
  }

  onSubmitVarsModalForAll = (formData, isEdit) => {
    const data = Utils.clone(formData)
    const appId = this.props.appId // Utils.appIdFromUrl()
    const env = 'ENVIRONMENT'

    const handleResp = resp => {
      this.props.afterSubmit('All')
      this.props.resetSchema(true)
    }
    if (isEdit) {
      apis.service
        .replace(apis.getServiceVariablesEndpoint(appId, this.entityId, data.uuid, env), {
          body: JSON.stringify(data)
        })
        .then(handleResp)
        .catch(error => {
          this.setState({ formSubmitted: false })
          throw error
        })
    } else {
      delete data.uuid
      delete data.configurationVariables
      data.name = formData.configurationVariables
      //  data.parentServiceVariableId = 'All'
      apis.service
        .fetch(apis.getServiceVariablesEndpoint(appId, this.entityId, '', 'ENVIRONMENT'), {
          method: 'POST',
          body: JSON.stringify(data)
        })
        .then(handleResp)
        .catch(error => {
          this.setState({ formSubmitted: false })
          throw error
        })
    }
  }

  onSubmitVarsModal = (formData, isEdit) => {
    const data = Utils.clone(formData)
    const appId = this.props.appId

    const handleResp = resp => {
      const { serviceTemplate } = this.props
      const selectedService = serviceTemplate ? serviceTemplate.name : ''
      this.props.afterSubmit(selectedService)
      this.props.resetSchema(true)
    }
    if (isEdit) {
      apis.service
        .replace(apis.getServiceVariablesEndpoint(appId, data.templateId, data.uuid, 'SERVICE_TEMPLATE'), {
          body: JSON.stringify(data)
        })
        .then(handleResp)
        .catch(error => {
          this.setState({ formSubmitted: false })
          throw error
        })
    } else {
      apis.service
        .fetch(apis.getServiceVariablesEndpoint(appId, data.templateId, '', 'SERVICE_TEMPLATE'), {
          method: 'POST',
          body: JSON.stringify(data)
        })
        .then(handleResp)
        .catch(error => {
          this.setState({ formSubmitted: false })
          throw error
        })
    }
  }

  isValid (formData) {
    if (formData.configurationVariables !== undefined) {
      this.setState({ errorMessage: '', errorClass: css.hide })
      return true
    }
    this.setState({ errorMessage: 'Configuration Variable is required', errorClass: css.errorMessage })
    return false
  }

  setFormData (formData) {
    return data
  }

  onChange = ({ formData }) => {
    const refocus = !this.state.formData.value && formData.value && formData.value.length === 1

    const { serviceId } = this.props

    const prevConfiguration = this.state.formData.configurationVariables
    const currentConfiguration = formData.configurationVariables
    const prevData = FormUtils.clone(this.state.formData)

    if (prevConfiguration !== currentConfiguration) {
      if (serviceId === 'All') {
        this.setState({ formData })
      } else {
        this.filterConfigVarData(currentConfiguration, formData.overrideType, true)
      }
    } else if (prevData.type !== formData.type) {
      formData.value = formData.type === types.ENCRYPTED || prevData.type === types.ENCRYPTED ? '' : formData.value
      if (formData.type === types.ENCRYPTED) {
        this.updateValuePropertyWithEnums({ formData })
      } else {
        this.updateValuePropertyWithMentions({ formData })
      }
    } else if (formData.value === 'New') {
      this.setEncryptVarModal()
    }
    // For some unknown reason (might be because of too many setState() calls in this component),
    // mention input got rendered with fresh new state again when its value is
    // empty and lost its focus. Until the root cause is found, manually set focus
    // to the newly rendered mention input
    if (refocus) {
      setTimeout(() => {
        const input = document.querySelector('.mentions-form-control__input')
        if (input) {
          input.focus()

          if (input.value && input.value.length === 1) {
            input.setSelectionRange(1, 1)
          }
        }
      }, 100)
    }
  }

  setEncryptVarModal = () => {
    this.setState({ showEncryptVarModal: true })
  }

  hideEncryptModal = () => {
    this.setState({ showEncryptVarModal: false })
  }

  updateValuePropertyWithEnums = async ({ formData, schema, uiSchema }) => {
    const resource = await this.fetchEncryptVariables()
    const formObject = { schema, uiSchema, formData }
    Utils.updateValuePropertyWithEnums({ formObject, result: resource, context: this })
  }

  fetchEncryptVariables = async () => {
    const { accountId } = this.props
    const { error, resource } = await EncryptService.listEncryptedVariables({
      accountId,
      type: Utils.encryptTypes.TEXT
    })

    if (error) {
      return
    }
    return resource
  }

  onSubmitOfNewKey = async result => {
    const resource = await this.fetchEncryptVariables()
    const formData = FormUtils.clone(this.state.formData)
    formData.encryptedValue = result
    const formObject = { formData }
    Utils.updateValuePropertyWithEnums({ formObject, result: resource, context: this })
  }

  updateValuePropertyWithMentions = ({ formData, schema, uiSchema }) => {
    const jsonSchema = schema ? schema : FormUtils.clone(this.state.schema)
    const displaySchema = uiSchema ? uiSchema : FormUtils.clone(this.state.uiSchema)

    displaySchema.value = { 'ui:placeholder': 'Value' }
    delete jsonSchema.properties.value.enum
    delete jsonSchema.properties.value.enumNames

    /* this.fetchMentions = Mentions.createFetch({
      appId,
      entityType: 'ENVIRONMENT',
      entityId: envId,
      serviceId: this.props.serviceId,
      ref: req => (this.mentionsRequest = req)
    })
    displaySchema.value = this.createValueFieldComponent()*/
    this.setState({ formData, schema: jsonSchema, uiSchema: displaySchema })
  }

  renderButton () {
    if (this.state.formSubmitted) {
      return (
        <div className={css.main + ' ' + 'buttonBar'}>
          <button type="submit" disabled className="btn btn-info disabled">
            SUBMITTING...
          </button>
          <span className="wings-spinner" />
        </div>
      )
    }

    return (
      <div className={css.main + ' ' + 'buttonBar'}>
        <button type="submit" className="btn btn-info">
          Submit
        </button>
      </div>
    )
  }

  updateConfigurationVariableInput = input => {
    const data = Utils.clone(this.state.formData)
    data.configurationVariables = input
    this.setState({ formData: data })
  }

  hideModal = () => {
    this.setState({
      errorMessage: '',
      errorClass: css.hide,
      initialized: false,
      formSubmitted: false
    })
    this.props.onHide()
  }

  renderEncryptVarModal = () => {
    const { accountId } = this.props

    if (this.state.showEncryptVarModal) {
      return (
        <EncryptVariablesModal
          show={this.state.showEncryptVarModal}
          accountId={accountId}
          onHide={this.hideEncryptModal}
          onSubmit={this.onSubmitOfNewKey}
        />
      )
    } else {
      return null
    }
  }

  render () {
    return (
      <div>
        <WingsForm
          name="Tag"
          ref="form"
          schema={this.state.schema}
          uiSchema={this.state.uiSchema}
          formData={this.state.formData}
          onSubmit={this.onSubmit}
          onChange={this.onChange}
          showErrorList={false}
        >
          {this.renderButton()}
        </WingsForm>
        {this.renderEncryptVarModal()}
      </div>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/ServiceTemplatePage/TemplateConfigVarsModal.js