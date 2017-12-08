import React from 'react'
import ReactDOM from 'react-dom'
import { WingsForm, Utils, FormUtils } from 'components'
import apis from 'apis/apis'
import OverrideSelect from './OverrideSelect'
import css from './ConfigOverride.css'
import pubsub from 'pubsub-js'
import { EncryptService } from 'services'
// import Form from 'react-jsonschema-form'

import EncryptFilesModal from '../SecretsManagementPage/EncryptResources/EncryptFilesModal'

const schema = {
  type: 'object',
  required: ['file'],
  properties: {
    uuid: { type: 'string', title: 'uuid', default: '' },
    configurationFiles: { type: 'string', title: 'Relative File Path' },
    overrideType: {
      type: 'string',
      title: 'Override Scope',
      default: 'ALL',
      enum: ['All', 'instances', 'custom'],
      enumNames: ['Entire Environment', 'Override Specific Instances', 'Override Specific Zone/Tags etc.']
    },
    file: { type: 'string', title: 'File' },
    md5: { type: 'string', title: 'MD5 (checksum)', default: '' },
    encrypted: { type: 'boolean', title: 'Encrypt File' }
  }
}

const FileWidget = props => {
  return (
    <input
      type="file"
      id="root_file"
      required={props.required}
      onChange={event => props.onChange(event.target.value)}
    />
  )
}
const secretKeys = ['file']

const uiSchema = {
  uuid: { 'ui:widget': 'hidden' },
  file: { 'ui:widget': FileWidget },
  md5: {
    classNames: 'wings-short-input',
    'ui:placeholder': 'to ensure data integrity of the file uploaded',
    'ui:widget': 'hidden'
  },
  configurationFiles: {},
  overrideType: { 'ui:disabled': 'true' },
  encrypted: { 'ui:widget': 'checkbox', classNames: css.encrypted },
  'ui:order': ['configurationFiles', 'overrideType', 'md5', 'encrypted', 'file', 'uuid']
}

// const log = (type) => {}  console.log.bind(console, type)

export default class TemplateConfigModal extends React.Component {
  state = {
    schema,
    uiSchema,
    formData: {},
    errorMessage: '',
    errorClass: css.hide,
    configFileId: 0,
    formSubmitted: false
  }
  errText = ''
  entityId = null
  entityType = null
  isEdit = false

  componentWillReceiveProps (newProps) {
    if (newProps.show) {
      if (this.props.serviceId === 'All') {
        this.updateSchemaForAllServiceOverrides()
        this.entityId = newProps.envId
        this.entityType = 'ENVIRONMENT'
      } else {
        const configFileKeys = newProps.data.map(item => item.relativeFilePath)
        const fileSet = new Set(configFileKeys)
        const configFileNames = Array.from(fileSet)
        //  this.props = newProps
        this.updateSchema(configFileNames)

        this.errText = ''
        this.entityId = newProps.entityId
        this.entityType = newProps.entityType
      }
    }
  }

  customSelect = props => {
    const disabled = this.props.configFileId !== 0 ? true : false
    return <OverrideSelect selectprops={props} disabled={disabled} />
  }

  updateSchemaForAllServiceOverrides () {
    const { configFileId } = this.props
    const schema = Utils.clone(this.state.schema)
    let uiSchema = Utils.clone(this.state.uiSchema)
    const formData = Utils.clone(this.state.formData)
    const { enableOnlySecretKeys } = this.props

    const overrideScopes = this.props.catalogs.OVERRIDE_TYPE.map(type => type.value)
    const overrideScopeNames = this.props.catalogs.OVERRIDE_TYPE.map(type => type.name)
    schema.properties.overrideType.enum = overrideScopes
    schema.properties.overrideType.enumNames = overrideScopeNames
    uiSchema.file = { 'ui:widget': FileWidget }

    if (configFileId && configFileId !== 0) {
      const configFile = this.props.data[0]
      const initialRelativePath = configFile !== undefined ? configFile.relativeFilePath : ''
      if (configFile) {
        formData.configurationFiles = initialRelativePath
        formData.relativeFilePath = initialRelativePath
      }
      if (configFile.encrypted) {
        formData.encrypted = configFile.encrypted
        formData.file = configFile.encryptedFileId
      }
      return this.modifyFileWidget({ formData, schema, uiSchema })
      if (enableOnlySecretKeys) {
        uiSchema = Utils.disableNonSecretKeysOnSchema({ schema, uiSchema, secretKeys })
      }
    }

    this.setState({ schema, uiSchema, formData })
  }

  updateSchema (configFileNames, configFileId) {
    const schema = Utils.clone(this.state.schema)
    let uiSchema = Utils.clone(this.state.uiSchema)
    const formData = Utils.clone(this.state.formData)
    const { enableOnlySecretKeys } = this.props

    schema.properties.configurationFiles = { title: 'Relative File Path', type: 'string' }
    if (configFileNames.length > 0) {
      schema.properties.configurationFiles.options = configFileNames
    }
    uiSchema.configurationFiles = { 'ui:widget': this.customSelect }
    uiSchema.file = { 'ui:widget': FileWidget }
    const overrideScopes = this.props.catalogs.OVERRIDE_TYPE.map(type => type.value)
    const overrideScopeNames = this.props.catalogs.OVERRIDE_TYPE.map(type => type.name)
    schema.properties.overrideType.enum = overrideScopes
    schema.properties.overrideType.enumNames = overrideScopeNames

    if (this.props.configFileId !== 0) {
      const configFile = this.props.data[0]
      const initialRelativePath = configFile !== undefined && configFileId !== 0 ? configFile.relativeFilePath : ''
      if (configFile) {
        formData.configurationFiles = initialRelativePath
        formData.relativeFilePath = initialRelativePath
        formData.encrypted = configFile.encrypted
        uiSchema.configurationFiles = { 'ui:widget': this.customSelect }
        if (formData.encrypted) {
          formData.file = configFile.encryptedFileId
        }
        return this.modifyFileWidget({ formData, schema, uiSchema })
        // uiSchema.file = { 'ui:widget': FileWidget }
      }
      if (enableOnlySecretKeys) {
        uiSchema = Utils.disableNonSecretKeysOnSchema({ schema, uiSchema, secretKeys })
      }
    }

    this.setState({ schema, uiSchema, formData })
  }

  filterConfigFileData (prevData, formData, createFileOverride = false) {
    const serviceTemplate = this.props.serviceTemplate
    const uiSchema = Utils.clone(this.state.uiSchema)
    const { currentConfiguration, overrideType } = formData

    const configFile = serviceTemplate.configFilesOverrides.filter(
      file => file.relativeFilePath === currentConfiguration
    )

    const data = {}
    let configFileId
    data.overrideType = overrideType
    data.configurationFiles = currentConfiguration

    if (currentConfiguration !== '' && configFile.length > 0) {
      data.relativeFilePath = configFile[0].relativeFilePath
      configFileId = configFile[0].uuid
      /* uiSchema.relativeFilePath = { 'ui:disabled': true }*/
    } else {
      configFileId = 0
      // uiSchema.relativeFilePath = { }
    }
    // fixed the onchange
    if (prevData.file && prevData.relativeFilePath) {
      data.file = prevData.file
      data.relativeFilePath = prevData.relativeFilePath
    }
    uiSchema.configurationFiles = { 'ui:widget': this.customSelect }
    uiSchema.file = { 'ui:widget': FileWidget }
    this.setState({ formData, uiSchema, configFileId })
  }

  onSubmit = ({ formData }) => {
    if (this.isValid(formData)) {
      this.setState({ formSubmitted: true })
      if (!formData.encrypted) {
        const el = ReactDOM.findDOMNode(this.refs.form)
        formData.configFile = el.querySelector('input[type="file"]').files[0]
      } else {
        formData.configFile = {
          encryptedFileId: formData.file
        }
      }

      formData.relativeFilePath = formData.configurationFiles

      if (this.props.serviceId === 'All') {
        this.onSubmitAllServicesFileOveride(formData)
      } else {
        this.submitForm(formData)
      }
    }
  }

  onSubmitAllServicesFileOveride = data => {
    const { configFileId } = this.props
    const handleResp = resp => {
      if (!resp.ok) {
        return resp.json().then(Promise.reject.bind(Promise))
      } else {
        return resp.json()
      }
    }
    this.isEdit = configFileId && configFileId !== 0 ? true : false

    const formData = new FormData()
    formData.append('relativeFilePath', data.relativeFilePath)

    if (!data.encrypted) {
      formData.append('file', data.configFile)
      formData.append('fileName', data.configFile.name)
    } else {
      const fileName = Utils.getEncryptFileName(this.encryptFiles, data.file)

      formData.append('encryptedFileId', data.file)
      delete data.file
      formData.append('fileName', fileName)
    }

    formData.append('encrypted', data.encrypted)

    if (this.isEdit) {
      formData.append('uuid', configFileId)
    }
    formData.append('configOverrideType', data.overrideType.toUpperCase())
    formData.append('targetToAllEnv', false)
    const url = apis.getConfigEndpoint(this.props.appId, this.entityId, this.props.configFileId, this.entityType)
    const methodType = this.isEdit ? 'PUT' : 'POST'
    Utils.request(
      this,
      apis.service.fetch(url, {
        method: methodType,
        body: formData
      })
    )
      .then(res => handleResp(res))
      .then(res => {
        this.props.afterSubmit('All')
        this.props.resetSchema(true)
      })
      .catch(error => {
        this.setState({ formSubmitted: false })
        this.getErrorResponse(error, 'error')
        //  this.props.resetSchema()
      })
  }
  isValid (formData) {
    if (formData.configurationFiles !== undefined && formData.configurationFiles !== '') {
      this.setState({ errorMessage: '', errorClass: css.hide })
      return true
    }
    this.setState({ errorMessage: 'Configuration File is required', errorClass: css.errorMessage })
    return false
  }

  onChange = ({ formData }) => {
    const prevData = Utils.clone(this.state.formData)
    const prevConfiguration = this.state.formData.configurationFiles
    const currentConfiguration = formData.configurationFiles

    if (prevConfiguration !== currentConfiguration && this.props.serviceId !== 'All') {
      this.filterConfigFileData(prevData, formData, true)
    } else if (formData.encrypted !== prevData.encrypted) {
      // this.setState({ formData })
      formData.file = ''
      this.modifyFileWidget({ formData })
    } else if (formData.file === 'New') {
      this.setState({ showEncryptModal: true })
    } else if (!formData.relativeFilePath && formData.file && formData.file.length > 0) {
      const k = formData.file.split('\\')
      formData.relativeFilePath = k && k.length > 0 ? k[k.length - 1] : ''
      this.setState({ formData })
    }
  }

  modifyFileWidget = async ({
    formData,
    schema = FormUtils.clone(this.state.schema),
    uiSchema = FormUtils.clone(this.state.uiSchema)
  }) => {
    const { encrypted } = formData

    if (encrypted) {
      return this.updateFileWithEnums({ formData, schema, uiSchema })
    } else {
      return this.updateFileWidget({ formData, schema, uiSchema })
    }
  }

  updateFileWithEnums = async ({
    formData,
    schema = FormUtils.clone(this.state.schema),
    uiSchema = FormUtils.clone(this.state.uiSchema)
  }) => {
    const resource = await this.fetchEncryptedFiles()
    const sortedContent = Utils.sortDataByKey(resource, 'name', 'ASC')
    schema.properties.file['enum'] = sortedContent.map(item => item.uuid).concat(['New'])
    schema.properties.file['enumNames'] = sortedContent.map(item => item.name).concat(['+ Add New Encrypt File'])
    uiSchema.file = { 'ui:placeholder': 'Select Encrypt File' }
    this.setState({ schema, uiSchema, formData })
  }

  updateFileWidget = async ({
    formData,
    schema = FormUtils.clone(this.state.schema),
    uiSchema = FormUtils.clone(this.state.uiSchema)
  }) => {
    delete schema.properties.file.enum
    delete schema.properties.file.enumNames
    uiSchema.file = { 'ui:widget': FileWidget }
    this.setState({ schema, uiSchema, formData })
  }

  fetchEncryptedFiles = async () => {
    const { accountId } = this.props
    const { error, resource } = await EncryptService.listEncryptedVariables({
      accountId,
      type: Utils.encryptTypes.FILE
    })

    if (error) {
      return
    }
    this.encryptFiles = resource
    return resource
  }

  submitForm = currentData => {
    const { serviceTemplate, data } = this.props
    const formData = new FormData()
    if (serviceTemplate) {
      const configs = serviceTemplate.serviceConfigFiles
      const configfile = configs.find(item => item.relativeFilePath === currentData.configurationFiles)
      if (configfile) {
        formData.append('parentConfigFileId', configfile.uuid)
      }
      formData.append('templateId', serviceTemplate.uuid)
    } else if (data && data.length > 0) {
      formData.append('templateId', data[0].entityId)
    }

    const handleResp = resp => {
      if (!resp.ok) {
        return resp.json().then(Promise.reject.bind(Promise))
      } else {
        return resp.json()
      }
    }

    this.isEdit = this.props.configFileId !== 0 ? true : false

    formData.append('relativeFilePath', currentData.relativeFilePath)

    if (!currentData.encrypted) {
      formData.append('file', currentData.configFile)
      formData.append('fileName', currentData.configFile.name)
    } else {
      const fileName = Utils.getEncryptFileName(this.encryptFiles, currentData.file)

      formData.append('encryptedFileId', currentData.file)
      delete currentData.file
      formData.append('fileName', fileName)
    }

    formData.append('encrypted', currentData.encrypted)

    if (this.isEdit) {
      formData.append('uuid', this.props.configFileId)
    }
    formData.append('configOverrideType', currentData.overrideType.toUpperCase())
    formData.append('targetToAllEnv', false)
    const url = apis.getConfigEndpoint(this.props.appId, this.entityId, this.props.configFileId, this.entityType)
    const methodType = this.isEdit ? 'PUT' : 'POST'

    Utils.request(
      this,
      apis.service.fetch(url, {
        method: methodType,
        body: formData
      })
    )
      .then(res => handleResp(res))
      .then(res => {
        const { serviceTemplate } = this.props
        const selectedService = serviceTemplate ? serviceTemplate.name : ''
        this.props.afterSubmit(selectedService)
        this.props.resetSchema(true)
      })
      .catch(error => {
        this.setState({ formSubmitted: false })
        this.getErrorResponse(error, 'error')
        //  this.props.resetSchema()
      })
  }

  getErrorResponse = (error, type) => {
    const messages = Utils.buildErrorMessage(error, type)
    Utils.publishErrorNotification(pubsub, [messages], type)
    this.setState({ error: true })
  }

  hideModal = () => {
    this.setState({
      errorMessage: '',
      errorClass: css.hide,
      formSubmitted: false
    })
    this.props.onHide()
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
  renderEncryptFileModal = () => {
    const { accountId } = this.props

    if (this.state.showEncryptModal) {
      return (
        <EncryptFilesModal
          show={this.state.showEncryptModal}
          accountId={accountId}
          onHide={this.hideEncryptModal}
          onSubmit={this.onSubmitOfNewFile}
        />
      )
    } else {
      return null
    }
  }

  hideEncryptModal = () => {
    this.setState({ showEncryptModal: false })
  }

  onSubmitOfNewFile = async result => {
    const formData = FormUtils.clone(this.state.formData)
    formData.encryptedFileId = formData.file = result

    await this.updateFileWithEnums({ formData })
  }
  render () {
    return (
      <div>
        <WingsForm
          name="Configuration"
          ref="form"
          schema={this.state.schema}
          uiSchema={this.state.uiSchema}
          formData={this.state.formData}
          onChange={this.onChange}
          onSubmit={this.onSubmit}
          showErrorList={false}
        >
          {this.renderButton()}
        </WingsForm>
        {this.renderEncryptFileModal()}
      </div>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/ServiceTemplatePage/TemplateConfigModal.js