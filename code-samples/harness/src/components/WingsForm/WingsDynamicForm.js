import React from 'react'
import WingsForm from './WingsForm'
import Utils from '../Utils/Utils'
import FormUtils from '../Utils/FormUtils'
import CompUtils from '../Utils/CompUtils'
import { Tracker } from 'utils'

export default class WingsDynamicForm extends React.Component {
  state = {
    initialized: false,
    loading: false,
    formData: {},
    schema: {},
    uiSchema: {}
  }

  base = {
    schema: {},
    uiSchema: {},
    formData: {}
  }

  buffer = {
    schema: {},
    uiSchema: {},
    formData: {}
  }

  static toFormData = ({ data = {}, arrayToStringProps }) => {
    return FormUtils.toFormData({ data, arrayToStringProps })
  }

  componentWillMount = async () => {
    await this.initializeForm(this.props)
  }

  componentWillReceiveProps = async ({ schema, uiSchema, formData, loading }) => {
    const newState = {}
    let shouldStateUpdate = false
    if (schema !== this.base.schema) {
      newState.schema = schema
      this.base.schema = schema
      shouldStateUpdate = true
    }

    if (uiSchema !== this.base.uiSchema) {
      newState.uiSchema = uiSchema
      this.base.uiSchema = uiSchema
      shouldStateUpdate = true
    }

    if (formData !== this.base.formData) {
      newState.formData = formData
      this.base.formData = formData
      shouldStateUpdate = true
    }

    if (loading !== this.props.loading) {
      newState.loading = loading
      shouldStateUpdate = true
    }

    if (shouldStateUpdate) {
      await this.setFormState(newState)
    }
  }
  render () {
    if (this.state.loading) {
      return (
        <div className="big-loader-area">
          <i className="wings-spinner" />
          {this.props.loadingMessage || 'LOADING'}
        </div>
      )
    }

    return (
      <WingsForm
        {...this.props}
        schema={this.state.schema}
        uiSchema={this.state.uiSchema}
        formData={this.state.formData}
        onChange={this.onChange}
        formContext={this}
      >
        {this.props.children}
      </WingsForm>
    )
  }

  initializeForm = async ({ schema, uiSchema, formData, onInitializeForm, loading }) => {
    // Initialized is different from loading since you may do loading after initialization
    const initialized = this.state.initialized
    loading = loading || this.state.loading

    this.initializeFormSchema(schema, uiSchema, formData)
    await this.updateChanges()
    const baseSchema = (this.base && this.base.schema) || {}

    if (Object.keys(baseSchema).length === 0) {
      this.base = { schema, uiSchema, formData }
    }

    const onInitializeFormFunc = onInitializeForm || this.props.onInitializeForm

    if (loading) {
      await this.setFormState({ loading })
    }

    if (!initialized) {
      if (onInitializeFormFunc) {
        const result = await onInitializeFormFunc(this)
        if (result) {
          this.buffer = result
        }
      }
      await this.setFormState({ ...this.buffer, initialized: true, loading: false })
    }
  }

  initializeFormSchema (schema, uiSchema, formData) {
    if (schema && schema !== this.state.schema) {
      this.buffer.schema = FormUtils.clone(schema)
    }

    if (uiSchema && uiSchema !== this.state.uiSchema) {
      this.buffer.uiSchema = FormUtils.clone(uiSchema)
    }

    if (formData !== this.state.formData) {
      this.buffer.formData = FormUtils.clone(formData || {})
    }
  }

  setFormState = async state => {
    await CompUtils.setComponentState(this, state)

    if (state.formData) {
      this.buffer.formData = FormUtils.clone(this.state.formData)
    }

    if (state.schema) {
      this.buffer.schema = FormUtils.clone(this.state.schema)
    }

    if (state.uiSchema) {
      this.buffer.uiSchema = FormUtils.clone(this.state.uiSchema)
    }
  }

  getFormData = () => {
    return this.buffer && this.buffer.formData
  }

  getFieldValue = fieldName => {
    return this.getFormData()[fieldName]
  }

  setFieldValue = (fieldName, value) => {
    this.buffer.formData[fieldName] = value
  }

  getFieldData = fieldName => {
    return (
      this.buffer &&
      this.buffer.schema.properties &&
      this.buffer.schema.properties[fieldName] &&
      this.buffer.schema.properties[fieldName].data
    )
  }

  updateChanges = async (options = {}) => {
    if (options.formData) {
      this.buffer.formData = options.formData
    }
    await this.setFormState(this.buffer)
  }

  onChange = async options => {
    const formData = options && options.formData
    if (!formData) {
      return
    }
    this.buffer.formData = formData
    await (this.props.onChange && this.props.onChange(options))
  }

  onSubmit = ev => {
    Tracker.log('Submit: ' + this.props.name, { appId: Utils.appIdFromUrl() })
    if (this.props.onSubmit) {
      this.props.onSubmit(ev)
    }
  }

  setEnumAndNames = (enumFieldName, fromArray, idField = 'uuid', nameField = 'name') => {
    const fields = this.buffer && this.buffer.schema && this.buffer.schema.properties
    if (!fields || !fields[enumFieldName]) {
      return
    }
    const field = this.buffer.schema.properties[enumFieldName]
    FormUtils.setEnumAndNames(field, fromArray, idField, nameField)
  }

  setEnumAndNamesWithArray = (enumFieldName, fromArray) => {
    const fields = this.buffer && this.buffer.schema && this.buffer.schema.properties
    if (!fields || !fields[enumFieldName]) {
      return
    }
    const field = this.buffer.schema.properties[enumFieldName]
    FormUtils.fillEnumAndNamesWithSimpleArray(field, fromArray)
  }

  getEnumNameFromValue (fieldName, value) {
    value = value || this.buffer.formData[fieldName]
    const schema = this.buffer.schema
    const index = schema.properties[fieldName].enum.indexOf(value)
    const name = schema.properties[fieldName].enumNames[index]
    return name
  }

  getFieldDataFromEnum (fieldName, idField = 'uuid') {
    if (!fieldName) {
      return ''
    }

    const fields = this.buffer && this.buffer.schema && this.buffer.schema.properties
    if (!fields) {
      return ''
    }
    const field = fields[fieldName]

    if (!field) {
      return ''
    }

    if (!field.data) {
      return ''
    }
    const value = this.getFieldValue(fieldName)
    return field.data.find(item => item[idField] === value)
  }

  showFields = fieldNamesArr => {
    FormUtils.showFields(this.base.uiSchema, this.buffer.uiSchema, fieldNamesArr)
  }

  hideFields = fieldNamesArr => {
    FormUtils.hideFields(this.base.uiSchema, this.buffer.uiSchema, fieldNamesArr)
  }

  toggleFields = (fieldNamesArr, show) => {
    FormUtils.showFields(this.base.uiSchema, this.buffer.uiSchema, fieldNamesArr, show)
  }

  setLoadingFields = (fieldNamesArr, isLoading, loadingText = 'Loading...') => {
    FormUtils.setLoadingFields(this.base.uiSchema, this.buffer.uiSchema, fieldNamesArr, isLoading, loadingText)
  }

  setRequired = (fieldNamesArr, flag) => {
    FormUtils.setRequired(this.buffer.schema, fieldNamesArr, flag)
  }

  disableFields = (fields = [], isDisabled = true) => {
    const uiSchema = this.buffer.uiSchema
    fields.forEach(fieldName => {
      uiSchema[fieldName]['ui:disabled'] = isDisabled
    })
  }

  enableFields = (fields = []) => {
    this.disableFields(fields, false)
  }

  isFieldChanged = (fieldName, formData = this.buffer.formData) => {
    const previousValue = this.state.formData[fieldName]
    const currentValue = formData[fieldName]
    return typeof currentValue !== 'undefined' && currentValue !== previousValue
  }

  autoProcessInitialize = async (fieldGroupOrder = [], formData = this.buffer.formData, dataProviders) => {
    const buffer = await FormUtils.autoProcessChange(
      this,
      formData,
      this.base.uiSchema,
      fieldGroupOrder,
      dataProviders,
      false
    )

    if (buffer) {
      this.buffer = buffer
    }
  }

  autoProcessSubfieldInitialize = async (subfieldName, fieldOrder = [], formData, dataProviders) => {
    const subSchema = this.buffer.schema.properties[subfieldName]
    const subUiSchema = this.buffer.uiSchema[subfieldName]
    const buffer = await FormUtils.autoProcessChange(
      this,
      formData,
      subUiSchema,
      fieldOrder,
      dataProviders,
      false,
      subfieldName,
      subSchema,
      subUiSchema,
      this.state.formData[subfieldName]
    )

    if (buffer) {
      this.buffer.formData[subfieldName] = buffer.formData
      this.buffer.schema.properties[subfieldName] = buffer.schema
      this.buffer.uiSchema[subfieldName] = buffer.uiSchema
    }
  }

  autoProcessChange = async (fieldOrder = [], formData = this.buffer.formData, dataProviders) => {
    const buffer = await FormUtils.autoProcessChange(this, formData, this.base.uiSchema, fieldOrder, dataProviders)

    if (buffer) {
      this.buffer = buffer
    }
  }

  autoProcessSubfieldChange = async (subfieldName, fieldOrder = [], formData, dataProviders) => {
    const subSchema = this.buffer.schema.properties[subfieldName]
    const subUiSchema = this.buffer.uiSchema[subfieldName]
    const buffer = await FormUtils.autoProcessChange(
      this,
      formData,
      subUiSchema,
      fieldOrder,
      dataProviders,
      true,
      subfieldName,
      subSchema,
      subUiSchema,
      this.state.formData[subfieldName]
    )

    if (buffer) {
      this.buffer.formData[subfieldName] = buffer.formData
      this.buffer.schema.properties[subfieldName] = buffer.schema
      this.buffer.uiSchema[subfieldName] = buffer.uiSchema
    }
  }

  refetchFieldData = async (fieldName, params, reset = false, dataProviderName = null) => {
    let field =
      this.buffer && this.buffer.schema && this.buffer.schema.properties && this.buffer.schema.properties[fieldName]

    if (!field) {
      return
    }
    this.setLoadingFields([fieldName], true)
    field.isLoading = true
    if (reset) {
      field.data = []
    }
    await this.updateChanges()
    const provider = schema.dataProviders[dataProviderName || field['custom:dataProvider']]

    const data = await provider(params)

    field =
      this.buffer && this.buffer.schema && this.buffer.schema.properties && this.buffer.schema.properties[fieldName]

    if (data && data.data && data.transformedData) {
      field.data = data.data
      if (field.enum) {
        this.setEnumAndNames(fieldName, data.transformedData)
      }
    } else {
      field.data = data
    }

    this.setLoadingFields([fieldName], false)
  }

  resetFields = (fields = []) => {
    FormUtils.resetFieldsInSchema(this.buffer.formData, this.buffer.schema, this.buffer.uiSchema, fields)
  }

  static mergeSchemas (schema1, schema2, fieldOrder) {
    return FormUtils.mergeSchema(schema1, schema2, fieldOrder, true)
  }

  mergeSchemaWith (schemaToMerge, fieldOrder = []) {
    this.buffer.schema = WingsDynamicForm.mergeSchemas(this.buffer.schema, schemaToMerge, fieldOrder)
  }

  static mergeUiSchemas (schema1, schema2, fieldOrder) {
    return FormUtils.mergeSchema(schema1, schema2, fieldOrder)
  }

  mergeUiSchemaWith (uiSchemaToMerge, fieldOrder = []) {
    this.buffer.uiSchema = WingsDynamicForm.mergeUiSchemas(this.buffer.uiSchema, uiSchemaToMerge, fieldOrder)
  }

  addTemplateFieldsToSchema (formData = this.buffer.formData) {
    FormUtils.addTemplateFieldsToSchema(this.buffer.schema, formData)
  }

  setDefaultTemplateFieldValue (stateName) {
    FormUtils.setDefaultTemplateFieldValue(this.buffer.schema, stateName)
  }

  setDependencyForFieldsOnSchema (dependencyMap, dependentFormData) {
    FormUtils.setDependencyForFieldsOnSchema(this.buffer.schema, dependencyMap, dependentFormData)
  }
}



// WEBPACK FOOTER //
// ../src/components/WingsForm/WingsDynamicForm.js