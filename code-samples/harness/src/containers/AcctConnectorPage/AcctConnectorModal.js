import React from 'react'
import ReactDOM from 'react-dom'
import { Modal } from 'react-bootstrap'
import { WingsForm, WingsModal, AppStorage, Utils, SearchableSelect } from 'components'

import apis from 'apis/apis'
import css from './AcctConnectorModal.css'
import pubsub from 'pubsub-js'
import FormUtils from '../../components/Utils/FormUtils'

const GOOGLE_CLOUD_TYPE = 'GCP'
const log = type => {}

const nameFields = {
  JENKINS: 'jenkinsUrl',
  BAMBOO: 'bambooUrl',
  DOCKER: 'dockerRegistryUrl',
  APP_DYNAMICS: 'controllerUrl',
  NEXUS: 'nexusUrl',
  ECR: 'ecrUrl',
  SPLUNK: 'splunkUrl',
  SMTP: 'host',
  SLACK: 'outgoingWebhookUrl'
}

const sumoMessage = '(Requires SumLogic Enterprise license)'

const verificationProviders = ['JENKINS', 'SPLUNK', 'ELK', 'LOGZ', 'SUMO', 'APP_DYNAMICS', 'NEW_RELIC', 'ELB']

const artifactServers = ['JENKINS', 'BAMBOO', 'DOCKER', 'NEXUS', 'ARTIFACTORY', 'AMAZON_S3']

const collobProviders = ['SMTP', 'SLACK']

const FileWidget = props => {
  return (
    <input
      type="file"
      id="root_file"
      required={props.required}
      onChange={event => {
        props.onChange(event.target.value)
      }}
    />
  )
}

const widgets = {
  SearchableSelect
}

export default class AcctConnectorModal extends React.Component {
  baseSchema = {
    type: 'object',
    required: ['name'],
    properties: {
      uuid: { type: 'string', title: 'uuid' },
      type: { type: 'string', title: 'Type', enum: this.connectorTypes, enumNames: this.connectorTypes },

      value: {
        type: 'object',
        title: '  ',
        properties: { type: { type: 'string' } }
      },
      name: { type: 'string', title: 'Display Name', default: '' }
    }
  }
  baseUiSchema = {
    uuid: { 'ui:widget': 'hidden' },
    value: { password: { 'ui:widget': 'password' }, type: { 'ui:widget': 'hidden' } }
  }
  connectorTypes = []
  pluginSchema = null
  plugins = null
  schema = this.baseSchema
  uiSchema = this.baseUiSchema
  formData = {
    uuid: '',
    type: '',
    value: { type: '' }
  }
  state = {
    formData: this.formData,
    schema: this.schema,
    uiSchema: this.uiSchema,
    errorClass: 'hide',
    errorMessage: '',
    error: false,
    widgets,
    showWarning: false
  }
  isEdit = false
  componentWillMount () {
    if (this.props.schema && !this.pluginSchema) {
      if (this.props.data) {
        this.isEdit = true
      }
      const { plugins } = this.props
      if (plugins) {
        this.plugins = plugins
      }

      this.init(this.props)
      this.onLoad(this.props)
    }
  }

  componentWillReceiveProps (newProps) {
    /* if (newProps.schema && !this.pluginSchema) {
      this.init(newProps)
    }
    this.plugins = newProps.plugins

    if (newProps.show && !this.state.error) {
      this.onLoad(newProps)
    } else if (this.state.error) {
      this.debouncedInit(newProps)
    }*/
  }

  onLoad (newProps) {
    if (newProps.data) {
      this.isEdit = true
      this.initFormData(newProps.data)
    } else {
      this.filter(newProps)
      this.initFormData()
    }
  }

  debouncedInit = Utils.debounce(props => {
    this.onLoad.bind(this, props)
    // this.setState({ error: false })
  }, 500)

  init (props) {
    this.setState({ error: false })
    this.pluginSchema = props.schema
    this.connectorTypes = Object.keys(this.pluginSchema)
    this.schema.properties.type.enum = this.schema.properties.type.enumNames = this.connectorTypes

    this.updateCnctrTypes()
    // this.updateSchema(this.connectorTypes[0])
  }

  updateCnctrTypes () {
    if (this.props.selectedType) {
      this.schema.properties.type.enum = [this.props.selectedType]
      this.schema.properties.type.enumNames = [this.props.title]
    }

    if (!this.plugins) {
      return
    }
    this.schema.properties.type.enum = this.connectorTypes
    this.schema.properties.type.enumNames = this.connectorTypes.map(
      type => this.plugins.find(p => p.type === type).displayName
    )
  }

  filter (props) {
    this.categoryType = props.categoryType

    this.connectorTypes = this.plugins
      .map(p => (p.pluginCategories.find(el => el === this.categoryType) ? p.type : null))
      .filter(el => el !== null)
    this.updateCnctrTypes()
  }

  initFormData (data) {
    this.isEdit = data ? true : false
    const formData = data ? data : { value: { type: this.connectorTypes[0] } }
    formData.type = formData.value.type

    const cloudProviderName = Utils.getCloudProviderName(formData.type)
    if (cloudProviderName !== undefined && formData.name === undefined && formData.type !== 'GCP') {
      formData.name = Utils.slugifyHttpStencilUrl(formData.type)
    }
    this.setState({ formData, error: false })
    this.updateSchema(formData.value.type)
  }

  updateUISchema = (isEdit, uiSchema, customProperties) => {
    const { enableOnlySecretKeys } = this.props

    if (isEdit) {
      uiSchema.type = { 'ui:disabled': true }
    } else {
      delete uiSchema.type
    }

    if (isEdit && enableOnlySecretKeys) {
      this.enableOnlySecretKeys(customProperties, uiSchema)
    }
  }

  enableOnlySecretKeys = (encryptedFields, uiSchema) => {
    const schemaProperties = this.schema.properties

    this.addDisabilityToSchemaProps(schemaProperties, uiSchema, encryptedFields)
  }

  addDisabilityToSchemaProps = (schemaProperties, uiSchema, encryptedFields) => {
    Object.keys(schemaProperties).map(property => {
      const schemaProp = schemaProperties[property]
      if (property !== 'required' && schemaProp.type !== 'object') {
        const secretField = this.isSecretKey(property, encryptedFields)
        if (!secretField) {
          this.addDisableToField(property, uiSchema)
        }
      } else {
        this.addDisabilityToSchemaProps(schemaProp.properties, uiSchema[property], encryptedFields)
      }
    })
  }

  addDisableToField = (property, uiSchema) => {
    if (!uiSchema[property]) {
      uiSchema[property] = {}
    }
    uiSchema[property]['ui:disabled'] = true
  }

  isSecretKey = (property, encryptedFields) => {
    const secretKeyProperties = encryptedFields

    if (secretKeyProperties && !secretKeyProperties.includes(property)) {
      return false
    } else {
      return true
    }
  }

  addELKEnumNames = () => {
    const { catalogs } = this.props

    const elkConnectorCatalogs = catalogs.ELK_CONNECTOR_TYPE

    const elkConnectorProperty = this.schema.properties.value.properties.elkConnector

    elkConnectorProperty['enumNames'] = elkConnectorCatalogs.map(item => item.name)
  }

  addEnumNamesForSumoUrl = () => {
    const sumoUrlProperty = this.schema.properties.value.properties.sumoUrl

    sumoUrlProperty['enumNames'] = sumoUrlProperty['enum'] = [
      'https://api.sumologic.com/api/v1/',
      'https://api.us2.sumologic.com/api/v1/',
      'https://api.eu.sumologic.com/api/v1/',
      'https://api.au.sumologic.com/api/v1/'
    ]

    this.uiSchema.value.sumoUrl = {
      'ui:widget': 'SearchableSelect',
      'ui:placeholder': 'Select SumoLogic Url'
    }
  }

  updateSchema = connectorType => {
    const isEdit = this.isEdit
    if (!connectorType) {
      return
    }
    const connectorPlugin = this.pluginSchema[connectorType]
    if (!connectorPlugin || !connectorPlugin.jsonSchema) {
      return
    }

    const { schemaData } = this.props

    if (schemaData) {
      const { jsonSchema, uiSchema } = schemaData
      this.schema.properties.value.properties = jsonSchema.properties
      this.schema.properties.value.required = jsonSchema.required
      this.uiSchema.value = uiSchema
    } else {
      this.schema.properties.value.properties = this.pluginSchema[connectorType].jsonSchema.properties
      this.schema.properties.value.required = this.pluginSchema[connectorType].jsonSchema.required
      this.uiSchema.value = this.pluginSchema[connectorType].uiSchema
    }

    if (connectorType === Utils.connectorTypes.ELK) {
      this.addELKEnumNames()
    } else if (connectorType === Utils.connectorTypes.SUMO) {
      this.addEnumNamesForSumoUrl()
    }

    const customProperties = this.uiSchema.value['custom:encryptedFields']
    Utils.modifyEncryptedFieldsOnSchema(this.schema.properties.value, customProperties)

    if (connectorType === GOOGLE_CLOUD_TYPE) {
      // Google Cloud
      // append File Uploader to jsonSchema so user can upload Google Cloud's Account Service Key File
      this.schema.properties.value.properties.file = {
        type: 'string',
        title: 'Google Cloud\'s Account Service Key File',
        default: ''
      }
      this.uiSchema.value = {
        type: { 'ui:widget': 'hidden' },
        file: { 'ui:widget': FileWidget },
        serviceAccountKeyFileContent: { 'ui:widget': 'hidden' }
      }
    } else if (connectorType === 'ECR') {
      this.getAWSRegionNames()
    }
    const title = Utils.getCloudProviderName(connectorType)
    this.schema.properties.name.title = title !== undefined ? title : this.schema.properties.name.title
    this.updateUISchema(isEdit, this.uiSchema, customProperties)

    this.setState({
      schema: this.schema,
      uiSchema: this.uiSchema,
      errorMessage: '',
      errorClass: 'hide'
    })
  }

  setName (type, formData, prevFormData) {
    const data = Utils.clone(formData)
    const prevData = Utils.clone(prevFormData)
    let name
    if (collobProviders.includes(type)) {
      name = this.setNameByHost(type, data, prevData)
      formData.name = name === undefined ? formData.name : name
    } else if (nameFields[type] && (verificationProviders.includes(type) || artifactServers.includes(type))) {
      name = this.setNameByUrl(type, data, prevData)
      formData.name = name === undefined ? formData.name : name
    } else {
      formData.name = Utils.slugifyHttpStencilUrl(type)
    }
    this.setState({ formData })
  }

  setNameByUrl (type, formData, prevFormData) {
    let url
    let prevUrl

    if (type) {
      const urlField = nameFields[type]
      url = formData.value[urlField]
      if (prevFormData.value !== undefined) {
        prevUrl = prevFormData.value[urlField]
      }
      formData.name = url !== prevUrl ? this.updateCnctrTypes(url, prevUrl, formData.username) : formData.name
    }

    if (formData.value.hasOwnProperty('username') && prevFormData.value.hasOwnProperty('username')) {
      formData.name = url !== undefined ? this.limitCharecters(Utils.slugifyHttpStencilUrl(url)) : ''
      this.computeName(formData)
    }
    return formData.name
  }

  getUrlName (jenkinsUrl) {
    const url = jenkinsUrl
    const urlName = url.split('//')
    const domain = urlName[1].split('/')
    return this.limitCharecters(domain[0])
  }

  limitCharecters (url) {
    if (url === undefined) {
      return
    }
    const newUrl = url.substring(0, 24)
    // check for the last charecter not to be '_'
    if (newUrl.lastIndexOf('_') === newUrl.length - 1) {
      return newUrl.substring(0, newUrl.length - 1)
    } else {
      return newUrl
    }
  }

  updateCnctrUrl = (url, prevUrl, userName) => {
    if (url !== undefined) {
      const urlName = Utils.slugifyHttpStencilUrl(url)
      if (userName !== undefined) {
        return this.limitCharecters(urlName + '-' + userName)
      }
      return this.limitCharecters(urlName)
    }
  }

  setNameByHost (type, formData, prevFormData) {
    if (type && nameFields[type]) {
      const typeField = nameFields[type]
      if (
        formData.value[typeField] !== prevFormData.value[typeField] ||
        formData.value.username !== prevFormData.value.username
      ) {
        formData.name = this.limitCharecters(Utils.slugifyHttpStencilUrl(formData.value.host))

        this.computeName(formData)
      }
    } else {
      this.computeName(formData)
    }
    return formData.name
  }

  computeName = formData => {
    if (formData.value.username !== undefined) {
      if (formData.name !== undefined) {
        formData.name += '_' + formData.value.username
      } else {
        formData.name = formData.value.username
      }
    }
  }

  onChange = ({ formData }) => {
    const data = Utils.clone(this.state.formData)

    if (formData.value && formData.value.file) {
      if (formData.name === '' || formData.value.file !== data.value.file) {
        const arr = formData.value.file.split('\\')
        const fileName = arr[arr.length - 1].split('.')[0]

        data.name = fileName
          .split('-')
          .slice(0, -1)
          .join('-')
        data.value.name = formData.name
        data.value.file = formData.value.file
        this.setState({ formData: data })
      } else {
        this.setState({ formData })
      }
      return
    } else if (formData.type === 'ELB') {
      const accessKey = formData.value.accessKey
      const secretKey = formData.value.secretKey
      const region = formData.value.region
      if (accessKey && secretKey && region) {
        this.getLoadBalancerName(data, formData)
      }
    } else if (formData.type === 'ECR' && !formData.value.region) {
      this.getAWSRegionNames()
    }

    if (formData.type !== data.type) {
      delete formData.value
      this.updateSchema(formData.type)
      this.resetFormData(formData)
    }

    if (formData.value !== undefined && formData.name === data.name && formData.type !== 'GCP' && !this.isEdit) {
      this.setName(formData.type, Utils.clone(formData), Utils.clone(data))
    } else {
      this.setState({ formData })
    }
  }

  getAWSRegionNames = () => {
    const acctId = AppStorage.get('acctId')
    apis
      .getAWSRegionNames(acctId)
      .then(result => {
        const schema = Utils.clone(this.state.schema)
        const data = Utils.clone(this.state.formData)
        //   const uiSchema = Utils.clone(this.state.uiSchema)
        schema.properties.value.properties.region['enum'] = Object.keys(result.resource)
        schema.properties.value.properties.region['enumNames'] = Object.values(result.resource)
        data.value.region = 'us-east-1'
        this.setState({ schema, formData: data })
      })
      .catch(error => {})
  }

  getLoadBalancerName (prevFormData, currentData) {
    if (
      prevFormData.value.accessKey !== currentData.value.accessKey ||
      prevFormData.value.secretKey !== currentData.value.secretKey ||
      prevFormData.value.region !== currentData.value.region
    ) {
      this.fetchLoadBalancers(currentData.value.accessKey, currentData.value.secretKey, currentData.value.region)
        .then(result => {
          if (!result.resource || !result.hasOwnProperty('resource')) {
            return
          }
          this.setLoadBalancersOnSchema(result.resource)
        })
        .catch(error => [])
    }
  }

  setLoadBalancersOnSchema = loadbalancers => {
    const currentSchema = Utils.clone(this.state.schema)
    const schemaValue = currentSchema.properties.value.properties
    schemaValue.loadBalancerName.enum = loadbalancers
    schemaValue.loadBalancerName.enumNames = loadbalancers
    currentSchema.properties.value.properties = schemaValue
    this.setState({ schema: currentSchema })
  }

  fetchLoadBalancers = (accessKey, secretKey, region) => {
    const acctId = AppStorage.get('acctId')
    return apis.service.list(apis.fetchElasticLoadBalancerNames(acctId, accessKey, secretKey, region))
  }

  getNameForCloudProviders (type) {
    let name = ''
    const cloudProviderName = Utils.getCloudProviderName(type)
    if (cloudProviderName !== undefined) {
      name = Utils.slugifyHttpStencilUrl(type)
    }
    return name
  }

  resetFormData (formData) {
    formData.name = formData.type !== 'GCP' ? this.getNameForCloudProviders(formData.type) : ''
    formData.value = { type: formData.type }

    this.setState({ formData })
  }

  onSubmit = ({ formData }) => {
    formData.value.type = formData.type
    delete formData.type
    this.submitData(formData) // , (this.props.data ? true : false))
  }

  myFetchWrapper (url) {
    return fetch(url).then(response => {
      return response.json().then(json => {
        return response.ok ? json : Promise.reject(json)
      })
    })
  }

  submitData = data => {
    const acctId = AppStorage.get('acctId')
    const appId = this.appIdFromUrl ? this.appIdFromUrl : ''
    if (data.value.type === GOOGLE_CLOUD_TYPE) {
      /* special submit for Google Cloud Platform (to upload file)
      If File missing (not select file to Upload) => API is throwing 400 status code-this handleresp is used
      to handle the error messages on file upload
      */
      const handleResp = resp => {
        if (!resp.ok) {
          return resp.json().then(Promise.reject.bind(Promise))
        } else {
          return resp.json()
        }
      }
      const el = ReactDOM.findDOMNode(this.refs.form)
      const file = el.querySelector('input[type="file"]').files[0]

      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('type', GOOGLE_CLOUD_TYPE)
      formData.append('appId', appId)
      formData.append('accountId', acctId)
      formData.append('pluginSetting', true)
      formData.append('file', file || '')

      if (data.uuid === undefined) {
        Utils.request(
          this,
          apis.service.fetch(apis.getSettingsUploadEndpoint(appId, acctId, false), {
            method: 'POST',
            body: formData
          })
        )
          .then(res => handleResp(res))
          .then(res => {
            this.setState({ error: false })
            this.props.onSubmit(res)
          })
          .catch(error => {
            this.getErrorResponse(error, 'error')
          })

        // Success handler.
      } else {
        Utils.request(
          this,
          apis.service.fetch(apis.editGCPUploadEndPoint(data.uuid, appId, acctId), {
            method: 'PUT',
            body: formData
          })
        )
          // .then(res => handleResp(res))
          .then(res => {
            this.setState({ error: false })
            this.props.onSubmit()
          })
          .catch(error => {
            this.getErrorResponse(error, 'error')
          })
      }
    } else {
      // for other Cloud Providers
      // data.pluginSetting = true
      data.category = 'CLOUD_PROVIDER'
      Utils.request(this, apis.onSubmitForSettingsEndPoint(acctId, data))
        .then(data => {
          this.setState({ error: false })
          this.props.onSubmit(data)
        })
        .catch(error => {
          this.setState({ error: true })
        })
    }
  }

  submitForFileUpload = () => {}

  getErrorResponse = (error, type) => {
    const messages = Utils.buildErrorMessage(error, type)
    Utils.publishErrorNotification(pubsub, messages, type)
    this.setState({ error: true })
  }

  getCategoryTitle = type => {
    if (this.props.show) {
      if (this.props.title) {
        return this.props.title
      } else if (!type) {
        return this.props.pluginCategory.find(plugin => plugin.value === this.props.categoryType).displayText
      } else if (type) {
        return this.props.pluginCategory.find(plugin => plugin.value === type).displayText
      }
    }
  }

  hideModal = () => {
    this.isEdit = false
    this.plugins = []
    this.connectorTypes = []
    this.formData.type = this.connectorTypes[0]

    this.setState({ formData: this.formData, error: false })
    this.props.onHide()
  }

  getTitle = () => {
    const { show, data } = this.props
    const formData = FormUtils.clone(this.state.formData)
    const { type } = formData.value
    const title = this.getConnectorTitle(type)

    if (show) {
      if (data) {
        return this.getConnectorTitle(data.value.type)
      }
    }
    return title
  }

  getConnectorTitle = type => {
    const { catalogs } = this.props
    const cnctrTypeObj = catalogs && catalogs.CONNECTOR_TYPES.find(cnctr => cnctr.value === type)
    let title
    if (cnctrTypeObj) {
      title = cnctrTypeObj.name

      if (type === Utils.connectorTypes.SUMO) {
        return `${title} - ${sumoMessage}`
      }
    } else if (type) {
      title = Utils.getJsonValue(this, 'props.data.type') || this.getCategoryTitle() || 'Connector'
    }
    return title
  }

  render () {
    return (
      <WingsModal
        show={this.props.show}
        className={css.main}
        data-name="connector-modal"
        submitting={this.state.submitting}
        onHide={this.hideModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>{this.getTitle()}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <WingsForm
            name="Connector"
            ref="form"
            schema={this.state.schema}
            uiSchema={this.state.uiSchema}
            formData={this.state.formData || {}}
            onChange={this.onChange}
            onSubmit={this.onSubmit}
            onError={log('errors')}
            widgets={this.state.widgets}
          >
            <div>
              <button type="submit" className="btn btn-primary" disabled={this.state.submitting}>
                Submit
              </button>
            </div>
          </WingsForm>
        </Modal.Body>
      </WingsModal>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/AcctConnectorPage/AcctConnectorModal.js