import React from 'react'
import { Modal } from 'react-bootstrap'
import {
  WingsModal,
  Utils,
  AppStorage,
  CompUtils,
  MultiSelectDropdown,
  FormUtils,
  SearchableSelect,
  FormFieldTemplate,
  NestedFormTemplate
} from 'components'
import WingsTagInput from '../../components/WingsTagsInput/WingsTagsInput'
import { WingsForm } from 'components'
import apis from 'apis/apis'
import AcctConnectorModal from '../AcctConnectorPage/AcctConnectorModal'
import css from './InfraStructureMappingModal.css'
import SSHConnectionModal from './SSHConnectionModal'
import AcctSettingModal from '../AcctSettingPage/AcctSettingModal'
import { AWSLambdaInfraService, AWSCDInfraService, AWSSSHInfraService } from 'services'
import LogOptionsModal from '../ServiceDetailPage/LogOptionsModal'
const addSelect = '+ New Cloud Provider'
const DIRECT_KUBERNETES = 'DIRECT'

const log = type => {} // console.log.bind(console, type)
const disableString = { 'ui:disabled': true }
const LOADINGTEXT = ['Loading...']
const defaultAwsTagData = { key: '', value: '' }
const infraMappingTypes = {
  DC_SSH: 'PHYSICAL_DATA_CENTER_SSH',
  AWS_SSH: 'AWS_SSH',
  AWS_ECS: 'AWS_ECS',
  AWS_AWSLAMBDA: 'AWS_AWS_LAMBDA',
  AWS_AWSCODEDEPLOY: 'AWS_AWS_CODEDEPLOY',
  DIRECT_KUBERNETES: 'DIRECT_KUBERNETES',
  GCP_KUBERNETES: 'GCP_KUBERNETES'
}
const widgets = {
  SearchableSelect
}

export default class InfraStructureMappingModal extends React.Component {
  schema = {
    type: 'object',
    required: ['serviceId', 'deploymentType', 'computeProviderSettingId'],
    properties: {
      name: { 'type': 'string', 'title': 'Name' },
      autoPopulate: { 'type': 'boolean', 'title': 'Auto Populate', default: true },
      serviceId: { type: 'string', title: 'Service' },
      deploymentType: { type: 'string', title: 'Deployment Type' },
      computeProviderSettingId: {
        type: 'string',
        title: 'Cloud Provider',
        enum: [addSelect],
        enumNames: [addSelect]
      }
    }
  }

  uiSchema = {
    name: { 'ui:placeholder': 'Enter Custom Name', 'ui:disabled': true },
    computeProviderSettingId: { 'ui:disabled': true },
    autoPopulate: {},

    deploymentType: { 'ui:disabled': true },
    'ui:order': [ 'name', 'autoPopulate', 'serviceId', 'deploymentType', 'computeProviderSettingId']
  }

  initialData = {
    name: '',
    autoPopulate: false,
    serviceId: '',
    computeProviderId: ''
  }

  state = {
    schema: this.schema,
    uiSchema: this.uiSchema,
    formData: {},
    showConnectorModal: false,
    showLoadBalancerConnectorModal: false,
    testConnectivity: false,
    needsPassWord: false,
    error: false,
    errorClass: '__hide',
    errorMessage: '',
    showSettingModal: false,
    initialized: false,
    submitDisabled: false,
    formSubmitted: false,
    schemaLoading: false,
    spinnerText: '',
    showAwsTags: false,
    awsTags: [],
    widgets,
    infraMappingType: null
  }
  stencils = null
  acctId = AppStorage.get('acctId')
  infraMappingObject = {}
  computeProviderList = []
  deploymentList = []
  deploymentNames = []
  isNew
  serviceTemplate
  cloudProviders = []
  cloudProviderNames = []
  infraWithServiceSelected
  cloudProviderTypes = []
  error = false
  errorMessage = ''
  savedTagIdx = -1

  componentWillReceiveProps (newProps) {
    // console.log('in componentwillrecieve')
    // if it is not initialized --> initialise it again ,else no
    if (newProps.show && !this.state.error && this.checkForInit(newProps)) {
      this.checkForEdit(newProps)
      this.callForInit(newProps)
    } else if (this.state.error) {
      this.debouncedInit(newProps)
    }
  }
  debouncedInit = Utils.debounce(props => this.init.bind(this, props), 500)

  checkForInit = newProps => {
    if (newProps.selectedService && !this.state.initialized) {
      this.infraWithServiceSelected = newProps.selectedService
      return true
    } else if (!newProps.hasOwnProperty('selectedService') && newProps.params.data) {
      return true
    }
  }

  checkForEdit = newProps => {
    const isNew = newProps.data ? false : true
    this.isNew = isNew
    let formData = {}
    let tags = []

    if (!this.isNew) {
      formData = Utils.clone(newProps.data)
      formData.serviceId = newProps.data.serviceTemplateId

      this.clearComputeProviders()

      if (formData.infraMappingType === infraMappingTypes.AWS_SSH) {
        tags = this.setAWSInstanceFilterOnData(formData)
      }

      this.removeLoadBalancerOnFormData(formData)
      this.setSchemaLoading(true)
    } else if (this.infraWithServiceSelected) {
      formData = {}
      formData.autoPopulate = true
      formData.serviceId = (newProps.serviceTemplate) ? newProps.serviceTemplate.uuid : ''

      this.clearComputeProviders()
    }
    this.setState({ formData, initialized: true, awsTags: tags })
  }

  clearComputeProviders = () => {
    this.computeProviderList = []
    this.cloudProviderNames = []
    this.computeProviderTypes = []
  }

  removeLoadBalancerOnFormData = formData => {
    if (!formData.loadBalancerId || formData.loadBalancerId === '') {
      delete formData.loadBalancerId
      delete formData.loadBalancerName
    }
    if (formData.infraMappingType === infraMappingTypes.AWS_SSH && !formData.customName) {
      delete formData.customName
    }
  }

  setAWSInstanceFilterOnData = formData => {
    if (!formData.awsInstanceFilter) {
      formData.awsInstanceFilter = {}
      formData.awsInstanceFilter.vpcIds = []
      formData.awsInstanceFilter.subnetIds = []
      formData.awsInstanceFilter.securityGroupIds = []
      formData.awsInstanceFilter.tags = []
      formData.awsInstanceFilter.awsTags = ''
    }

    if (!formData.autoScalingGroupName) {
      delete formData.autoScalingGroupName

      if (formData.awsInstanceFilter && formData.awsInstanceFilter.tags && formData.awsInstanceFilter.tags.length > 0) {
        return this.updateTagsFromFormData(formData.awsInstanceFilter.tags)
      }
    }

    return []
  }

  updateTagsFromFormData = savedTags => {
    const tags = []

    if (savedTags && savedTags.length > 0) {
      for (const tag of savedTags) {
        const strTag = `${tag.key}:${tag.value}`
        tags.push(strTag)
      }
    }
    return tags
  }

  callForInit = newProps => {
    this.init(newProps)
  }

  init (newProps) {
    this.stencils = newProps.infraStencils || {}
    this.fetchPlugins(newProps)
    // this.fetchData(newProps)
  }

  fetchPlugins = newProps => {
    apis.fetchInstalledSettingSchema().then(r => this.setState({ pluginSchema: r }))
    apis.fetchPlugins().then(r => this.setState({ plugins: r }))
    // this.filterComputeProviders(this.props.objComputeProviders)

    if (this.isNew && !this.infraWithServiceSelected) {
      this.initialiseSchema()
    } else if (!this.isNew) {
      this.modifySchema(newProps.data.serviceTemplateId)
    } else if (this.infraWithServiceSelected) {
      this.modifySchemaFromDeployment(newProps.serviceTemplate)
    }
  }

  getCatalogArtifactName = serviceArtifactType => {
    if (serviceArtifactType) {
      return Utils.getCatalogDisplayText(this.props.catalogs, 'ARTIFACT_TYPE', serviceArtifactType)
    }
    return
  }

  initialiseSchema = () => {
    this.schema.properties.serviceId = { type: 'string', title: 'Service' }
    this.updateServicesForInfraMapping(this.schema)
    this.uiSchema.serviceId = {}
    this.setState({ schema: this.schema, uiSchema: this.uiSchema, submitDisabled: true })
    this.setState({
      error: false,
      errorMessage: '',
      errorClass: '',
      submitDisabled: false
    })
  }

  modifySchema = serviceTemplateId => {
    const serviceTemplates = this.props.params.data
    if (serviceTemplates.length > 0) {
      const serviceTemplate = serviceTemplates.find(item => item.uuid === serviceTemplateId)
      if (serviceTemplate !== null) {
        this.setCallToInfraMapping(serviceTemplate)
      }
    }
  }

  modifySchemaFromDeployment = serviceTemplate => {
    if (serviceTemplate !== null) {
      this.setCallToInfraMapping(serviceTemplate)
    }
  }

  setCallToInfraMapping = serviceTemplate => {
    if (serviceTemplate) {
      this.fetchInfraMapping(serviceTemplate).then(result => {
        this.serviceTemplate = serviceTemplate
        this.initializeModal(result.resource)
      }).catch(error => {
        this.setState({ error: true })
      })
    }
  }

  // fetches computeprovider-deptype mapping from backend
  fetchInfraMapping (serviceTemplate) {
    const serviceTemplateData = serviceTemplate ? serviceTemplate : this.serviceTemplate
    if (serviceTemplateData !== null) {
      const serviceId = serviceTemplateData.serviceId
      const appId = serviceTemplateData.appId
      const envId = serviceTemplateData.envId
      return apis.service.list(apis.fetchInfraEnvironmentMapping(appId, envId, serviceId))
    }
  }

  initializeModal (response, newProps) {
    if (response !== undefined) {
      this.infraMappingObject = response
      this.loadModal()
    }
  }

  /* filtering computeproviders based on the inframappings */
  filterComputeProviders = (computeProviders, depType) => {
    const computeProviderTypes = []
    const infraTypes = this.infraMappingObject[depType]
    const providerKeys = Object.keys(computeProviders)
    if (infraTypes.length > 0 && providerKeys.length > 0) {
      this.computeProviderList = Object.keys(computeProviders).reduce((result, key, index, keysArray) => {
        if (infraTypes.indexOf(computeProviders[key].value.type) > -1) {
          computeProviderTypes.push(computeProviders[key].value.type)
          result.push(computeProviders[key])
        }
        // result.push(computeProviders[key])
        return result
      }, [])
      this.cloudProviderNames = this.getCloudProviderNames()
    }
    if (depType === 'KUBERNETES') {
      this.computeProviderList.push(DIRECT_KUBERNETES)
      this.cloudProviderNames.push(this.getCatalogNameForDirect())
    }
    // this.computeProviderTypes = Object.values(infraTypes)

    // const providerSet = new Set(computeProviderTypes)
    // Array.from(providerSet)
    // console.log (this.computeProviderTypes)
    //  this.computeProviderTypes = Object.values(infraTypes)
  }
  getCatalogNameForDirect = () => {
    if (this.props.catalogs) {
      return Utils.getCatalogDisplayText(this.props.catalogs, 'CLOUD_PROVIDERS', DIRECT_KUBERNETES)
    }
  }

  loadModal = () => {
    const data = Utils.clone(this.state.formData)
    const appId = this.serviceTemplate !== null ? this.serviceTemplate.appId : Utils.appIdFromUrl()

    if (this.infraMappingObject) {
      this.addCloudProviderToSchema(data)
      this.updateModalForInfraMappingType(appId)
    } else {

      const schema = Utils.clone(this.state.schema)
      const uiSchema = Utils.clone(this.state.uiSchema)
      schema.properties.serviceId = { type: 'string', title: 'Service' }
      schema.properties.computeProviderSettingId = {
        type: 'string',
        title: 'Cloud Provider',
        enum: [addSelect],
        enumNames: [addSelect]
      }
      uiSchema.computeProviderSettingId = {}

      this.disablePropertiesForEdit()
      if (this.infraWithServiceSelected) {
        this.updateServicesFromDeployment(schema)
      } else {
        this.updateServicesForInfraMapping(schema)
      }
      this.setState({ schema, uiSchema })
    }
  }

  // creates json schema and ui schema for the first load
  addCloudProviderToSchema (formData) {
    this.schema.properties.serviceId = { type: 'string', title: 'Service' }
    if (this.infraWithServiceSelected) {
      this.updateServicesFromDeployment(this.schema)
    } else {
      this.updateServicesForInfraMapping(this.schema)
    }
    this.updateDeploymentType(formData, this.schema)
    const providerList = this.computeProviderList
    this.fillComputeProviders(providerList, this.schema)
    this.disablePropertiesForEdit()
    this.modifyNameandAutoPuplate(formData)
    this.setState({ schema: this.schema, uiSchema: this.uiSchema, formData })
  }

  modifyNameandAutoPuplate = (formData) => {
    if (formData.autoPopulate) {
      this.disableName()
    } else {
      this.enableName()
    }
  }

  disableName = () => {
    this.uiSchema.name['ui:disabled'] = true
    if (!this.isNew) {
      this.uiSchema.autoPopulate['ui:disabled'] = true
    }
  }

  enableName = () => {
    if (this.isNew) {
      delete this.uiSchema.name['ui:disabled']
    }
  }

  disablePropertiesForEdit = () => {
    if (this.infraWithServiceSelected) {
      this.uiSchema.serviceId = disableString
      this.uiSchema.computeProviderSettingId = {}
      this.uiSchema.deploymentType = {}
    } else if (!this.isNew) {
      this.disableName()
      this.uiSchema.computeProviderSettingId = disableString
      this.uiSchema.deploymentType = disableString
      this.uiSchema.serviceId = disableString
    } else {
      this.uiSchema.computeProviderSettingId = {}
      this.uiSchema.deploymentType = {}
      this.uiSchema.serviceId = {}
    }
  }


  updateServicesFromDeployment = schema => {

    schema.properties.name = { type: 'string', title: 'Name', 'ui:disabled': true }

    schema.properties.autoPopulate = { type: 'boolean', title: 'Auto Populate', default: true }
    schema.properties.serviceId = { type: 'string', title: 'Service' }
    schema.properties.serviceId['enum'] = [this.props.serviceTemplate.uuid]
    const serviceName = this.props.serviceTemplate.name + '(' + this.props.serviceTemplate.serviceArtifactType + ')'
    schema.properties.serviceId['enumNames'] = [serviceName]
  }

  updateServicesForInfraMapping = schema => {

    schema.properties.name = { type: 'string', title: 'Name', 'ui:disabled': true }

    schema.properties.autoPopulate = { type: 'boolean', title: 'Auto Populate', default: true }
    schema.properties.serviceId = { type: 'string', title: 'Service' }
    schema.properties.serviceId['enum'] = this.props.params.data.map(service => service.uuid)
    schema.properties.serviceId['enumNames'] = this.props.params.data.map(
      service => service.name + '(' + this.getCatalogArtifactName(service.serviceArtifactType) + ')'
    )
    // this.getCatalogArtifactName(service.serviceArtifactType) + ': ' +
  }
  fillComputeProviderEnum = (providerList, schema) => {
    return providerList.map(k => (k !== DIRECT_KUBERNETES ? k.uuid : k)).concat([addSelect])
  }
  // creates deployment type property on the schema
  fillComputeProviders (providerList, schema) {
    // this.filterCloudProvidersBasedOnDeployment(providerList)
    schema.properties.computeProviderSettingId = {
      type: 'string',
      title: 'Cloud Provider',
      enum: [addSelect],
      enumNames: [addSelect]
    }

    if (providerList.length > 0) {
      schema.properties.computeProviderSettingId.enum = this.fillComputeProviderEnum(providerList)
      schema.properties.computeProviderSettingId.enumNames = this.cloudProviderNames
    } else {
      schema.properties.computeProviderSettingId.enum = [addSelect]
      schema.properties.computeProviderSettingId.enumNames = [addSelect]
    }
  }

  // updates deployment type  control with the keys of the computeprovider type
  // from the inframapping object
  updateDeploymentType (formData, currentSchema) {
    this.deploymentList = Object.keys(this.infraMappingObject)
    // this.getDeploymentTypes(this.getComputeProviderType(formData.computeProviderSettingId))
    this.deploymentNames = this.getDeploymentTypeName(this.deploymentList)
    // this.cloudProviderTypes =Object.values(this.infraMappingObject)
    currentSchema.properties.deploymentType = { type: 'string', title: 'Deployment Type' }
    if (this.deploymentList.length > 0) {
      currentSchema.properties.deploymentType.enum = this.deploymentList
      currentSchema.properties.deploymentType.enumNames = this.deploymentNames
      formData.deploymentType =
        formData.hasOwnProperty('deploymentType') && formData.deploymentType
          ? formData.deploymentType
          : this.deploymentList[0]
      if (this.computeProviderList.length === 0) {
        this.filterComputeProviders(this.props.objComputeProviders, formData.deploymentType)
      }
    } else {
      formData.deploymentType = ''
    }
  }

  getDeploymentTypes = computeProviderType => {
    const infraMappingObject = this.infraMappingObject
    return infraMappingObject.hasOwnProperty(computeProviderType)
      ? Object.keys(infraMappingObject[computeProviderType])
      : []
  }

  getDeploymentTypeName = deploymentTypes => {
    if (this.props.catalogs.DEPLOYMENT_TYPE === undefined) {
      return
    } else if (this.props.catalogs.DEPLOYMENT_TYPE.length === 0) {
      return
    } else if (deploymentTypes === null || deploymentTypes.length === 0) {
      return
    }
    const depCatalogs = this.props.catalogs.DEPLOYMENT_TYPE

    if (deploymentTypes.length > 0) {
      const depNames = []
      deploymentTypes.find(deploymentType => {
        const dTypeObj = depCatalogs.find(depItem => depItem.value === deploymentType)
        if (dTypeObj) {
          depNames.push(dTypeObj.displayText)
        }
      })
      return depNames
    }
  }

  // gets computeprovider type based on filtered computeprovider list
  getComputeProviderType = computeProviderSettingId => {
    if (computeProviderSettingId !== DIRECT_KUBERNETES) {
      const providerElement = this.computeProviderList.find(item => item.uuid === computeProviderSettingId)
      if (providerElement) {
        return providerElement.value.type
      }
    } else {
      return computeProviderSettingId
    }
  }
  /* Displaying displayText of cloud providers from catalogs */
  getCatalogCloudProviderName = type => {
    if (this.props.catalogs && type) {
      const catalogs = this.props.catalogs
      if (catalogs.hasOwnProperty('CLOUD_PROVIDERS')) {
        const catalogCloudProviders = this.props.catalogs.CLOUD_PROVIDERS
        const filterType = catalogCloudProviders.find(provider => provider.value === type)
        return filterType.displayText
      }
    }
    return
  }

  getCloudProviderNames = () => {
    const providerList = this.computeProviderList
    return Object.keys(providerList).reduce((result, key, index, keysArray) => {
      const displayTypeText = this.getCatalogCloudProviderName(providerList[key].value.type)
      let name
      if (displayTypeText) {
        name = displayTypeText + ': ' + providerList[key].name
      } else {
        name = providerList[key].name
      }
      result.push(name)
      return result
    }, [])
  }

  getArtifactType = serviceId => {
    let currentService
    if (this.props.hasOwnProperty('params')) {
      currentService = this.props.params.data.find(service => service.uuid === serviceId)
      if (currentService.serviceArtifactType) {
        return this.getCatalogArtifactName(currentService.serviceArtifactType)
      }
    } else if (this.props.hasOwnProperty('selectedServiceArtifact') && this.props.selectedServiceArtifact) {
      return this.getCatalogArtifactName(this.props.selectedServiceArtifact)
    }
  }
  /* inframapping type -computeproviderttype + Deptype
  based on the inframapping type updates jsonschema and ui schema accordingly
  */
  getInfraMappingType = (depType, computeProviderId) => {
    if (depType && computeProviderId !== DIRECT_KUBERNETES) {
      return this.getComputeProviderType(computeProviderId) + '_' + depType
    } else if (depType === 'KUBERNETES' && computeProviderId === DIRECT_KUBERNETES) {
      return computeProviderId + '_' + depType
    }
  }
  updateModalForInfraMappingType (appId) {
    const formData = Utils.clone(this.state.formData)
    const infraMappingType = formData.infraMappingType
      ? formData.infraMappingType
      : this.getInfraMappingType(formData.deploymentType, formData.computeProviderSettingId)

    if (!this.stencils[infraMappingType]) {
      const uiSchema = Utils.clone(this.state.uiSchema)
      const schema = Utils.clone(this.state.schema)
      if (formData.autoPopulate) {
        uiSchema.name['ui:disabled'] = true
      }
      uiSchema.computeProviderSettingId = {}
      uiSchema.deploymentType = {}
      // const currentArtifactType = this.getArtifactType(formData.serviceId)
      // const errorMessage = 'Selected Cloud Provider does not support ' + currentArtifactType + ' artifact type'
      /* errorMessage: errorMessage,
      errorClass: '__error',*/
      this.setState({ submitDisabled: true, uiSchema, schema })

      return
    } else {
      this.setState({
        error: false,
        errorMessage: '',
        errorClass: '',
        submitDisabled: false
      })
    }

    // if there is  defined schemas for this inframapping type
    this.reviewModal(appId, infraMappingType)
  }

  buildMessages (r, type) {
    const messages = Utils.buildErrorMessage(r, type)
    this.setState({ errorMessage: messages, errorClass: '__error', testConnectivity: false })
  }

  setErrorOnState = () => {
    const uiSchema = Utils.clone(this.state.uiSchema)
    const schema = Utils.clone(this.state.schema)
    uiSchema.computeProviderSettingId = {}
    uiSchema.deploymentType = {}
    if (!this.state.error) {
      this.setState({
        error: true,
        testConnectivity: false,
        errorClass: '',
        errorMessage: '',
        schema,
        uiSchema: uiSchema
      })
    }
  }

  setRegion = defaultRegion => {
    const data = Utils.clone(this.state.formData)
    const region = data.region ? data.region : defaultRegion
    if (region !== data.region) {
      data.region = region
      this.setState({ formData: data })
    }
  }

  // reviews modal based on the newproperties added from the inframapping schema
  reviewModal (appId, infraMappingType) {
    let data = Utils.clone(this.state.formData)
    const computeProviderId = data.computeProviderSettingId
    const newSchema = this.stencils[infraMappingType].jsonSchema
    const newUiSchema = this.stencils[infraMappingType].uiSchema
    const newSchemaProperties = newSchema.properties

    if (newSchemaProperties.hasOwnProperty('region')) {
      this.setRegion(newSchema.properties.region.default)
      // reset as it is set at region level
      data = Utils.clone(this.state.formData)
      newUiSchema.region = {
        'ui:widget': 'SearchableSelect',
        'ui:placeholder': 'Select Region',
        classNames: this.infraMappingType === infraMappingTypes.AWS_SSH ? css.leftField : ''
      }

      if (newSchema.properties.hasOwnProperty('clusterName')) {
        this.getClusterMappings(appId, computeProviderId, newSchema, infraMappingType, data.region)
      } else if (data.deploymentType === 'AWS_CODEDEPLOY') {
        if (this.isNew) {
          this.updateSchema(infraMappingType)
        } else {
          this.updateSchemaWithPropertiesAWSCD(data, infraMappingType, newSchema, newUiSchema)
        }
      } else if (data.deploymentType === Utils.AWSDeploymentTypes.Lambda) {
        this.updateSchemaForAWSLambda(data, infraMappingType, newSchema, newUiSchema)
      } else {
        this.updateSchema(infraMappingType)
      }
    } else if (
      newSchemaProperties.hasOwnProperty('clusterName') &&
      data.computeProviderSettingId !== DIRECT_KUBERNETES
    ) {
      this.getClusterMappings(appId, computeProviderId, newSchema, infraMappingType)
    } else {
      this.updateSchema(infraMappingType)
    }
  }

  updateSchemaForAWSSSH = async (data, infraMappingType, schema, uiSchema) => {
    await this.updatePropertiesForAWSSSH(data, schema, uiSchema)
    // this.updateSchema(infraMappingType, data.region)
  }

  updatePropertiesForAWSSSH = async (data, schema, uiSchema) => {
    const editData = this.props.data
    const isEditing = !this.isNew
    const appId = this.props.appId
    const computeProviderId = data.computeProviderSettingId
    const region = data.region

    const tagRequest = await AWSSSHInfraService.getTags({ appId, computeProviderId, region })
    const loadBalancerRequest = await AWSSSHInfraService.getClassicLoadBalancers({
      appId,
      computeProviderId,
      region
    })
    const vpcRequest = await this.fetchVPC(appId, computeProviderId, region)

    const [loadBalancerResult, vpcResult, tagResult] = await Promise.all([loadBalancerRequest, vpcRequest, tagRequest])

    const loadBalancerIdProperty = schema.properties.loadBalancerId
    loadBalancerIdProperty.enum = []
    loadBalancerIdProperty.enumNames = []
    FormUtils.fillEnumAndNamesWithSimpleArray(loadBalancerIdProperty, loadBalancerResult)
    uiSchema.loadBalancerId = {
      'ui:widget': 'SearchableSelect',
      'ui:placeholder': 'Select LoadBalancer',
      classNames: css.rightField
    }
    uiSchema.region['classNames'] = css.leftField
    if (!data.loadBalancerId) {
      delete data.loadBalancerId
    }
    // this.setLoadBalancerId(data, loadBalancerResult.length, loadBalancerResult[0])
    if (!isEditing || (isEditing && !editData.provisionInstances) || !data.provisionInstances) {
      await this.updateAWSInstanceFilterProperties(data, schema, uiSchema, vpcResult, tagResult)
    } else {
      await this.updateSchemaWithAutoScalingGroups(data, schema, uiSchema, false)
    }
  }

  updateAWSInstanceFilterProperties = async (data, schema, uiSchema, vpcResult, tagResult) => {
    this.customizeVpcIdOnSchema(schema)
    uiSchema.awsInstanceFilter['vpcIds'] = {
      classNames: css.vpcField,
      'ui:widget': this.renderUiWidgetForAWSLambda.bind(this, vpcResult)
    }

    this.customiseSubnetAndSecurityGroups(schema.properties.awsInstanceFilter)
    this.hideProperties(['autoScalingGroupName', 'setDesiredCapacity', 'desiredCapacity'], uiSchema)

    const awsInstanceFilterProperties = schema.properties.awsInstanceFilter.properties
    const vpcIdProperty = awsInstanceFilterProperties.vpcIds.items
    FormUtils.fillEnumAndNamesWithSimpleArray(vpcIdProperty, vpcResult)

    this.customiseTagsProperty(schema, uiSchema)
    const { tags } = tagResult
    this.awsRegionTags = tags

    if (this.isNew || (!this.isNew && data.awsInstanceFilter)) {
      await this.updateSchemaWithSubnetAndSecurityGroupForAWSSSH(schema, uiSchema, data)
    }
  }

  editFlowForAWSSSH = () => {}

  hideSchemaProperty = (property, uiSchema) => {
    uiSchema[property] = { 'ui:widget': 'hidden' }
  }

  /*
    Customising Tags Property to renderit with tags component
  */
  customiseTagsProperty = (schema, uiSchema) => {
    delete schema.properties.awsInstanceFilter.properties.tags

    schema.properties.awsInstanceFilter.properties['awsTags'] = { type: 'string', title: 'AWS Tags' }

    uiSchema.awsInstanceFilter['awsTags'] = {
      'ui:widget': this.renderTagsComponent.bind(this),
      classNames: `${css.tagField} __tagsField`
    }
    const awsInstanceFilterUiOrder = uiSchema['awsInstanceFilter']['ui:order']
    if (!awsInstanceFilterUiOrder.includes('awsTags')) {
      const tagsIdx = uiSchema['awsInstanceFilter']['ui:order'].indexOf('tags')
      uiSchema['awsInstanceFilter']['ui:order'].splice(tagsIdx, 1, 'awsTags')
    }
  }

  onAddLogOptionClick = () => {
    this.style = this.getOverlayTarget()
    const { top } = this.style
    this.top = top
    this.setState({
      showAwsTags: true,
      awsTagData: defaultAwsTagData,
      savedtagIndex: -1
    })
  }

  getOverlayTarget = () => {
    const target = Utils.queryRef(this.refs.form, '.__tagsField')
    const targetRect = target.getBoundingClientRect()
    return { bottom: targetRect.bottom, left: targetRect.left, top: targetRect.top, right: targetRect.right }
  }

  hideLogOptions = () => {
    this.overLayClass = css.hide
    this.savedTagIdx = -1
    this.setState({ showAwsTags: false, awsTagData: defaultAwsTagData })
  }

  renderTagsComponent = props => {
    return (
      <WingsTagInput
        value={this.state.awsTags}
        addOption={this.onAddLogOptionClick}
        hideLogOptions={this.hideLogOptions}
        className={'form-control'}
        onTagClick={this.onTagClick}
        handleChange={this.handleChange}
      />
    )
  }

  onTagClick = event => {
    const savedData = FormUtils.clone(this.state.formData)
    const awsTags = FormUtils.clone(this.state.awsTags)
    const currentTag = event.currentTarget.textContent
    const tagIdx = awsTags.findIndex(tag => tag === currentTag)

    if (savedData.awsInstanceFilter && savedData.awsInstanceFilter.tags && tagIdx > -1) {
      const tagData = savedData.awsInstanceFilter.tags
      const currentTagData = tagData[tagIdx]

      const data = {}
      data.key = currentTagData.key
      data.value = currentTagData.value
      this.savedTagIdx = tagIdx
      this.tagFormData = data

      this.setState({ showAwsTags: true, awsTagData: data })
    }
  }

  handleChange = (tags, changedIndexes) => {
    const savedData = FormUtils.clone(this.state.formData)

    if (savedData.awsInstanceFilter && savedData.awsInstanceFilter.tags) {
      savedData.awsInstanceFilter.tags.splice(changedIndexes, 1)
    }

    this.setState({ awsTags: tags, formData: savedData })
  }

  updateSchemaForAWSLambda = async (data, infraMappingType, schema, uiSchema) => {
    this.customiseSubnetAndSecurityGroups(schema)
    uiSchema.vpcId = { classNames: css.hide }
    uiSchema.subnetIds = { classNames: css.hide }
    uiSchema.securityGroupIds = { classNames: css.hide }
    this.updateSchema(infraMappingType)
  }
  customizeVpcIdOnSchema = schema => {
    const awsInstanceFilterProperties = schema.properties.awsInstanceFilter.properties
    awsInstanceFilterProperties.vpcIds['showLabel'] = true
    awsInstanceFilterProperties.securityGroupIds['showLabel'] = true
    awsInstanceFilterProperties.subnetIds['showLabel'] = true
    schema.properties.awsInstanceFilter['addExpand'] = true
    awsInstanceFilterProperties.vpcIds.items.enum = []
    awsInstanceFilterProperties.vpcIds.items.enumNames = []
    awsInstanceFilterProperties.vpcIds.uniqueItems = true
  }

  customiseSubnetAndSecurityGroups = schema => {
    schema.properties.subnetIds.items.enum = []
    schema.properties.subnetIds.items.enumNames = []
    schema.properties.subnetIds.uniqueItems = true
    schema.properties.securityGroupIds.items.enum = []
    schema.properties.securityGroupIds.items.enumNames = []
    schema.properties.securityGroupIds.uniqueItems = true
  }

  editFlowForAWSLamda = async (data, schema, uiSchema) => {
    this.setState({ schemaLoading: true })
    const applicationId = this.props.appId
    const computeProviderId = data.computeProviderSettingId
    const region = data.region
    const vpcId = data.vpcId

    const vpcRequest = await this.fetchVPC(this.props.appId, computeProviderId, data.region)
    const subnetIdRequest = await AWSLambdaInfraService.getSubnetIdsForApplication({
      applicationId,
      computeProviderId,
      region,
      vpcId
    })
    const securityGroupIdRequest = await AWSLambdaInfraService.getSecurityGroupIdsForApplication({
      applicationId,
      computeProviderId,
      region,
      vpcId
    })
    const [vpcResult, subnetResult, securityGroupResult] = await Promise.all([
      vpcRequest,
      subnetIdRequest,
      securityGroupIdRequest
    ])

    const { subnets } = subnetResult
    const { securityGroups } = securityGroupResult
    const vpcOptions = Object.values(vpcResult)
    this.updateEnumOptionsForVpcId(schema, uiSchema, vpcOptions)
    this.updateOptionsOnAWSLambdaSchema(schema, uiSchema, 'subnetIds', subnets)
    this.updateOptionsOnAWSLambdaSchema(schema, uiSchema, 'securityGroupIds', securityGroups)
  }

  getUiOptionsForLambda = options => {
    if (options) {
      const optionsArr = []
      options.map(option => {
        optionsArr.push({ label: option, value: option })
      })
      return optionsArr
    }
  }
  renderUiWidgetForAWSLambda = (options, props) => {
    const schema = props.schema
    const title = schema.title
    const titleGroups = {
      VPC: 'vpcIds',
      Subnets: 'subnetIds',
      'Security Groups': 'securityGroupIds'
    }
    const placeHolders = {
      subnetIds: 'Select a subnet',
      securityGroupIds: 'Select a security group',
      vpcIds: 'Select a vpc'
    }
    const label = titleGroups[title]
    const modifiedOptions = this.getUiOptionsForLambda(options)
    const placeHolder = placeHolders[label]
    return (
      <MultiSelectDropdown
        description="Select"
        data={modifiedOptions}
        description={placeHolder}
        {...props}
        onChange={async val => {
          await this.onChangeOfMultiSelect(val, label)
        }}
      />
    )
  }

  onChangeOfMultiSelect = async (val, property) => {
    if (this.infraMappingType === infraMappingTypes.AWS_SSH) {
      await this.updateOptionsForAwsSSH(val, property)
    } else {
      this.updateOptionsForAwsLambda(val, property)
    }
  }
  updateOptionsForAwsSSH = async (selectedValue, property) => {
    const selectedArr = selectedValue ? selectedValue.split(',') : []
    const data = FormUtils.clone(this.state.formData)

    if (selectedArr && selectedArr.length > 0) {
      if (!data.awsInstanceFilter) {
        data['awsInstanceFilter'] = {}
      }

      data['awsInstanceFilter'][property] = selectedArr

      if (property === 'vpcIds') {
        this.selectedVpcIds = selectedArr
        if (data.awsInstanceFilter.subnetIds) {
          delete data.awsInstanceFilter.subnetIds
        }
        if (data.awsInstanceFilter.securityGroupIds) {
          delete data.awsInstanceFilter.securityGroupIds
        }

        this.debouncedApi()
        /* */
      }
    } else {
      delete data['awsInstanceFilter'][property]
    }

    this.setState({ formData: data })
  }

  debouncedApi = Utils.debounce(async () => {
    const apiKey = (this.apiKey = Date.now())
    const schema = FormUtils.clone(this.state.schema)
    const uiSchema = FormUtils.clone(this.state.uiSchema)
    const data = FormUtils.clone(this.state.formData)

    if (apiKey === this.apiKey) {
      this.setSchemaLoading(true)

      await this.updateSchemaWithSubnetAndSecurityGroupForAWSSSH(schema, uiSchema, data, this.selectedVpcIds)

      this.setState({ schema, uiSchema, schemaLoading: false })
    }
  }, 200)

  updateOptionsForAwsLambda = async (selectedValue, property) => {
    const selectedArr = selectedValue ? selectedValue.split(',') : []
    const data = FormUtils.clone(this.state.formData)
    if (selectedArr) {
      data[property] = selectedArr
      this.setState({ formData: data })
    }
  }

  updateSchemaWithSubnetAndSecurityGroupForAWSSSH = async (schema, uiSchema, formData, vpcIds = []) => {
    const applicationId = this.props.appId
    const region = formData.region
    const computeProviderId = formData.computeProviderSettingId
    const awsInstanceFilterSchema = schema.properties.awsInstanceFilter
    const awsInstanceFilterUiSchema = uiSchema.awsInstanceFilter
    // this.setState({ schemaLoading: true, formData })

    console.log(schema, 'schema', uiSchema, 'uiSchema')

    const { subnets } = await AWSSSHInfraService.getSubnetIdsForApplication({
      applicationId,
      computeProviderId,
      region,
      vpcIds
    })

    const subnetClassName = formData.deploymentType === 'SSH' ? css.subnetField : ''
    this.updateOptionsOnAWSLambdaSchema(
      awsInstanceFilterSchema,
      awsInstanceFilterUiSchema,
      'subnetIds',
      subnets,
      subnetClassName
    )

    const securityGroupClassName = formData.deploymentType === 'SSH' ? css.securityGroupField : ''
    const { securityGroups } = await AWSSSHInfraService.getSecurityGroupIdsForApplication({
      applicationId,
      computeProviderId,
      region,
      vpcIds
    })

    this.updateOptionsOnAWSLambdaSchema(
      awsInstanceFilterSchema,
      awsInstanceFilterUiSchema,
      'securityGroupIds',
      securityGroups,
      securityGroupClassName
    )
  }

  fetchVPC = async (applicationId, computeProviderId, region) => {
    const response = await AWSSSHInfraService.getVPCForApplication({
      applicationId,
      computeProviderId,
      region
    })
    return response
  }

  checkIfApplicationExists = (applicationName, applications) => {
    if (applications && applications.length > 0) {
      return applications.includes(applicationName)
    }

    return false
  }

  updateSchemaWithPropertiesAWSCD = async (data, infraMappingType, schema, uiSchema) => {
    if (data) {
      const appId = this.props.appId
      const region = data.region
      const applicationName = data.applicationName
      const computeProviderId = data.computeProviderSettingId

      if (!data.deploymentConfig) {
        delete data.deploymentConfig
      }

      const appRequest = await AWSCDInfraService.getApplicationNamesForCodeDeploy({ appId, region, computeProviderId })
      const depConfigRequest = await AWSCDInfraService.getDeploymentConfigsForCodeDeploy({
        appId,
        region,
        computeProviderId
      })
      const [appResponse, depConfigResponse] = await Promise.all([appRequest, depConfigRequest])
      const { applications } = appResponse
      const { deploymentConfigs } = depConfigResponse
      if (this.checkIfApplicationExists(applicationName, applications)) {
        const depGroupResponse = await AWSCDInfraService.getDeploymentGroupsForCodeDeploy({
          appId,
          region,
          computeProviderId,
          applicationName
        })
        const { deploymentGroups } = depGroupResponse
        schema.properties.deploymentGroup['enum'] = Object.values(deploymentGroups)
        schema.properties.deploymentGroup['enumNames'] = Object.values(deploymentGroups)
        uiSchema.deploymentGroup = {}
      } else {
        delete data.applicationName
        delete data.deploymentGroup
        // error
        this.error = true
        this.errorMessage = `Application ${applicationName} does not exist in AWS CodeDeploy`
        schema.properties.deploymentGroup['enum'] = []
        schema.properties.deploymentGroup['enumNames'] = []
        this.setState({ formData: data })
      }
      this.afterFetchApps(applications, schema)
      this.afterFetchDeploymentConfiguration(deploymentConfigs, schema)
      uiSchema.applicationName = { 'ui:widget': 'SearchableSelect', 'ui:placeholder': 'Select Application' }
      uiSchema.deploymentConfig = {}
      this.updateSchema(infraMappingType)
    }
  }

  getClusterMappings = (appId, computeProviderId, newSchema, infraMappingType, region) => {
    this.fetchClusterMapping(appId, computeProviderId, region)
      .then(result => {
        this.afterClusterLoad(newSchema, result, infraMappingType)
      })
      .catch(error => {
        this.setErrorOnState()
      })
  }

  afterClusterLoad = (newSchema, result, infraMappingType) => {
    const data = this.state.formData
    this.updateClusterNames(newSchema, result, data)
    this.updateSchema(infraMappingType, data.region)
    this.setState({ errorMessage: '', errorClass: '__hide' })
  }

  fetchClassicLoadBalancers = (appId, newSchema, infraMappingType, onChange = false) => {
    const data = Utils.clone(this.state.formData)
    if (newSchema.properties.hasOwnProperty('loadBalancerId')) {
      apis
        .fetchClassicLoadBalancers(appId, data.region, data.computeProviderSettingId)
        .then(result => {
          this.updateAwsLoadBalancerId(result, newSchema)
          //  this.setLoadBalancerId(data, loadBalancers.length, loadBalancers[0])
          this.setState({ formData: data })
          this.updateSchema(infraMappingType, data.region)
        })
        .catch(error => {
          this.setErrorOnState()
        })
    }
  }
  setLoadBalancerId = (data, loadBalLength, initialVal, onChange) => {
    if (this.isNew || onChange) {
      if (loadBalLength > 0) {
        data.loadBalancerId = initialVal
      } else {
        delete data['loadBalancerId']
      }
    } else if (data.hasOwnProperty('loadBalancerId') && !data.loadBalancerId) {
      delete data['loadBalancerId']
      delete data['loadBalancerName']
    }
  }

  fetchClusters (appId, region, computeProviderId, onChange = false) {
    const schema = Utils.clone(this.state.schema)
    const data = Utils.clone(this.state.formData)
    data.region = region
    this.fetchClusterMapping(appId, computeProviderId, region)
      .then(result => {
        this.updateClusterNames(schema, result, data, onChange)

        this.setState({ schema, error: false, formData: data })
      })
      .catch(error => {
        this.setErrorOnState()
      })
  }

  updateClusterNames (schema, result, data, onChange = false) {
    const clusterNames = result.resource
    schema.properties.clusterName['enum'] = [...clusterNames, 'RUNTIME']
    schema.properties.clusterName['enumNames'] = [...clusterNames, '< Create Cluster at runtime >']
    this.setCluster(data, clusterNames, onChange)
  }

  setCluster = (data, clusters, onChange = false) => {
    if (this.isNew || onChange) {
      if (clusters.length > 0) {
        data.clusterName = clusters[0]
      } else {
        delete data['clusterName']
      }
    } else if (data.hasOwnProperty('clusterName') && !data.clusterName) {
      delete data['clusterName']
    }
  }
  updateAwsLoadBalancerId (result, schema) {
    if (!result.hasOwnProperty('resource') || !result.resource) {
      return
    }
    const loadBalancers = result.resource
    /* let lbEnum = ['']
    let lbEnumNames = ['None']
    if (loadBalancers.length !== 0) {
      lbEnum = lbEnum.concat(Object.values(loadBalancers))
      lbEnumNames = lbEnumNames.concat(Object.values(loadBalancers))
    }*/
    if (loadBalancers.length > 0) {
      schema.properties.loadBalancerId['enum'] = [...Object.values(loadBalancers)]
      schema.properties.loadBalancerId['enumNames'] = [...Object.values(loadBalancers)]
    } else {
      schema.properties.loadBalancerId['enum'] = []
      schema.properties.loadBalancerId['enumNames'] = []
    }
    return loadBalancers
  }

  updatePhysicalLoadBalancerId (result, schema) {
    if (!result.hasOwnProperty('resource') || !result.resource) {
      return
    }
    const loadBalancers = result.resource
    let lbEnum = ['']
    let lbEnumNames = ['None']

    if (loadBalancers.length !== 0) {
      lbEnum = Object.keys(loadBalancers)
      lbEnumNames = Object.values(loadBalancers)
    }
    schema.properties.loadBalancerId['enum'] = lbEnum
    schema.properties.loadBalancerId['enumNames'] = lbEnumNames
  }

  fetchLoadBalancers (appId, region, computeProviderId, onChange = false) {
    const schema = Utils.clone(this.state.schema)
    const data = Utils.clone(this.state.formData)
    data.region = region
    apis
      .fetchClassicLoadBalancers(appId, region, computeProviderId)
      .then(result => {
        this.updateAwsLoadBalancerId(result, schema)
        // this.setLoadBalancerId(data, loadBalancers.length, loadBalancers[0], onChange)

        this.setState({ schema, error: false, formData: data })
      })
      .catch(error => {
        this.setErrorOnState()
      })
  }

  updateSchema = async (infraMappingType, region = '') => {
    this.infraMappingType = infraMappingType
    // const isNew = this.isNew
    const data = Utils.clone(this.state.formData)
    const infraMappingObj = this.stencils[infraMappingType]
    const newSchema = Utils.clone(infraMappingObj.jsonSchema)
    const newUiSchema = Utils.clone(infraMappingObj.uiSchema)
    this.infraMappingType = infraMappingType

    this.fillComputeProviders(this.computeProviderList, newSchema)
    this.updateDeploymentType(data, newSchema)
    newSchema.required = this.updateSchemaRequired(newSchema)
    const customProperties = newUiSchema['custom:encryptedFields']
    Utils.modifyEncryptedFieldsOnSchema(newSchema, customProperties)

    if (newSchema.properties.hasOwnProperty('hostConnectionAttrs')) {
      const hostCnctsSchema = this.modifyConnectionTypeEnum(newSchema)
      newSchema.properties.hostConnectionAttrs.enum = hostCnctsSchema.enum
      newSchema.properties.hostConnectionAttrs.enumNames = hostCnctsSchema.enumNames
    }
    if (data.autoPopulate) {
      newUiSchema.name = {
        'ui:placeholder': 'Enter Custom Name '
      }
      newUiSchema.name['ui:disabled'] = true
    } else {
      newSchema.required.push('name')
    }

    newSchema.properties.serviceId = { type: 'string', title: 'Services' }
    if (this.infraWithServiceSelected) {
      this.updateServicesFromDeployment(newSchema)
    } else {
      this.updateServicesForInfraMapping(newSchema)
    }
    await this.updateSchemaForInfraMapping(infraMappingType, data, newSchema, newUiSchema)

    this.disableSchemaProperties(newSchema, newUiSchema)
    this.updateUiSchema(newSchema, newUiSchema)
    this.customizeFormData(region)
    const errorClass = this.error ? '__error' : ''
    const errorMessage = this.error ? this.errorMessage : ''
    this.setState({
      schema: newSchema,
      uiSchema: newUiSchema,
      error: false,
      errorClass,
      errorMessage,
      schemaLoading: false,
      key: Math.random(),
      infraMappingType: infraMappingType
    })
  }

  updateSchemaForInfraMapping = async (infraMappingType, data, schema, uiSchema) => {
    if (infraMappingType === infraMappingTypes.DC_SSH) {
      uiSchema.loadBalancerId = { 'ui:widget': 'hidden' }
    } else if (infraMappingType === infraMappingTypes.AWS_AWSLAMBDA) {
      await this.updateRolesForAWSLambda(data, schema, uiSchema, infraMappingType)
      if (!this.isNew) {
        await this.editFlowForAWSLamda(data, schema, uiSchema, infraMappingType)
      }
    } else if (infraMappingType === infraMappingTypes.AWS_SSH) {
      await this.updatePropertiesForAWSSSH(data, schema, uiSchema)
    }
  }

  updateRolesForAWSLambda = async (data, schema, uiSchema) => {
    const { appId } = this.props
    const { deploymentType, computeProviderSettingId } = data

    const roleResponse = await AWSLambdaInfraService.getRoles({
      appId,
      deploymentType,
      computeProviderId: computeProviderSettingId
    })

    const roleProperty = schema.properties.role
    const { error, roles } = roleResponse

    if (error) {
      this.setSchemaLoading(false)
      return
    }

    if (roles) {
      const roleKeys = Object.keys(roles)
      const roleValues = Object.values(roles)
      FormUtils.fillEnumAndNamesWithSimpleArray(roleProperty, roles, roleKeys, roleValues)
      uiSchema.role['ui:widget'] = 'SearchableSelect'
    }
  }

  disableSchemaProperties = (newSchema, newUiSchema) => {
    const isNew = this.isNew
    if (this.infraWithServiceSelected) {
      newUiSchema.serviceId = disableString
      newUiSchema.deploymentType = {}
      newUiSchema.computeProviderSettingId = {}
    } else if (!isNew) {
      newUiSchema.name = disableString
      newUiSchema.autoPopulate = disableString
      newUiSchema.serviceId = disableString
      newUiSchema.deploymentType = { 'ui:disabled': true }
      newUiSchema.computeProviderSettingId = { 'ui:disabled': true }
    } else {
      newUiSchema.deploymentType = {}
      newUiSchema.computeProviderSettingId = {}
      newUiSchema.serviceId = {}
    }
  }

  updateSchemaRequired (newSchema) {
    if (newSchema.properties.hasOwnProperty('hostNames')) {
      const hostNamesIdx = newSchema.required.indexOf('hostNames')
      newSchema.required.splice(hostNamesIdx, 1, 'hostNamesText')
    }
    let schemaRequired = newSchema.required
    if (!schemaRequired) {
      schemaRequired = []
    }
    schemaRequired.push('serviceId', 'computeProviderSettingId', 'deploymentType')
    return schemaRequired
  }

  modifyConnectionTypeEnum (updatedSchema) {
    if (updatedSchema.properties.hasOwnProperty('hostConnectionAttrs')) {
      const connectionTypeEnum = updatedSchema.properties.hostConnectionAttrs.enum
      const connectionTypeEnumNames = updatedSchema.properties.hostConnectionAttrs.enumNames
      updatedSchema.properties.hostConnectionAttrs.enum = [...connectionTypeEnum, 'NEW SSH']
      updatedSchema.properties.hostConnectionAttrs.enumNames = [...connectionTypeEnumNames, '+ New SSH Key']
      return updatedSchema.properties.hostConnectionAttrs
    }
  }

  // fetches clusternames from backend
  fetchClusterMapping (appId, computeProviderId, region) {
    if (appId !== null) {
      return apis.service.list(
        apis.getInfraClusterMappingEndPoint(appId, this.state.formData.deploymentType, region, computeProviderId)
      )
    }
  }

  updateInfraMappingModalWithNewHostConnectionAttribute (appId, data) {
    this.updateInfraMappingModalWithNewlyCreatedProperty(appId, data.resource, null)
  }

  updateInfraMappingModalWithNewLoadBalancer (appId, data) {
    this.updateInfraMappingModalWithNewlyCreatedProperty(appId, null, data.resource)
  }

  updateInfraMappingModalWithNewlyCreatedProperty (appId, newHostConnAttr, newLoadBalancer) {
    apis
      .fetchInfrastructuresStencils(appId)
      .then(result => {
        this.stencils = result.resource
        this.fetchInfraMapping()
          .then(result => {
            this.updateModalForInfraMappingType(appId)
            //   this.initializeModal(result.resource, this.props)
            const formData = Utils.clone(this.state.formData)
            if (newHostConnAttr && newHostConnAttr.uuid) {
              formData.hostConnectionAttrs = newHostConnAttr.uuid
            } else if (newLoadBalancer && newLoadBalancer.uuid) {
              formData.loadBalancerId = newLoadBalancer.uuid
            }
            this.setState({ formData })
          })
          .catch(error => {
            this.setErrorOnState()
          })
      })
      .catch(error => {
        this.setErrorOnState()
      })
  }

  // updates ui order-Adds new properties to the order array
  updateUiOrder (newSchema, newUiSchema, newUIOrder) {
    const orderArr = newUiSchema['ui:order']
    for (const property of newUIOrder) {
      if (newSchema.properties.hasOwnProperty(property)) {
        if (!(orderArr.indexOf(property) > -1)) {
          orderArr.push(property)
        }
      }
    }

    Object.keys(newSchema.properties).forEach(function callback (property) {
      if (!(orderArr.indexOf(property) > -1)) {
        orderArr.push(property)
      }
    })
    newUiSchema['ui:order'] = orderArr
    return newUiSchema
  }

  customizeSchema = (formData, tempSchema, tempUiSchema) => {
    if (!tempUiSchema.hasOwnProperty('ui:order')) {
      tempUiSchema['ui:order'] = []
    }
    if ('hostNames' in tempSchema.properties) {
      delete tempSchema.properties['hostNames']
      tempSchema.required = ['hostNamesText']

      tempSchema.properties['hostNamesText'] = { type: 'string', title: 'Host Name(s)' }
      tempUiSchema['hostNamesText'] = { 'ui:widget': 'hidden', 'ui:placeholder': 'hostname1\nhostname2' }
      const indx = tempUiSchema['ui:order'].indexOf('hostNames')
      tempUiSchema['ui:order'].splice(indx, 1, 'hostNamesText')
      const Cnctnindx = tempUiSchema['ui:order'].indexOf('hostConnectionAttrs')
      tempUiSchema['ui:order'].splice(Cnctnindx, 1)
      tempUiSchema['hostConnectionAttrs'] = { 'ui:widget': 'hidden' }
    }
    if ('restrictionType' in tempSchema.properties) {
      delete tempSchema.properties['restrictionType']
    }
    if ('restrictionExpression' in tempSchema.properties) {
      delete tempSchema.properties['restrictionExpression']
    }
    tempUiSchema.deploymentType = {}

    this.updateUiSchema(tempSchema, tempUiSchema, formData)
    this.setState({ schema: tempSchema, uiSchema: tempUiSchema })
  }

  checkServiceTemplateData = formData => {
    if (this.props.serviceTemplate) {
      const im = this.props.serviceTemplate.infrastructureMappings.find(
        im => im.computeProviderSettingId === formData.computeProviderSettingId
      )
      if (im) {
        return Utils.clone(im)
      }
    }
    return null
  }

  customizeFormData = (region = '') => {
    const formData = Utils.clone(this.state.formData)
    if ('hostNames' in formData) {
      formData['hostNamesText'] = formData.hostNames.join('\n')
      delete formData.hostNames
    }
    if (region !== '') {
      formData.region = formData.region !== undefined ? formData.region : region
      const infraMappingType = formData.infraMappingType
      if (infraMappingType === 'PHYSICAL_DATA_CENTER_SSH') {
        if (!formData.loadBalancerId) {
          formData.loadBalancerId = ''
        }
      } else if (formData.deploymentType === 'ECS' || formData.deploymentType === 'GCP') {
        if (!formData.clusterName) {
          delete formData.clusterName
        }
      }
    }
    if (formData.hasOwnProperty('deploymentConfig') && !formData.deploymentConfig) {
      delete formData.deploymentConfig
    }
    {
      this.setState({ formData })
    }
  }
  setTestConnectivityVisiblility = () => {
    const schema = Utils.clone(this.state.schema)
    if ('hostNames' in schema.properties) {
      this.setState({ testConnectivity: true })
    }
  }

  submitData = (data, isEditing) => {
    const appId = this.props.appId || Utils.appIdFromUrl()
    const envId = this.props.envId || Utils.envIdFromUrl()

    if (isEditing) {
      delete data.serviceId
      // const editData = this.modifyFormDataForEdit()
      apis.service
        .replace(apis.getInfrastructureMappingEndPoint(appId, envId, null, data.uuid), { body: JSON.stringify(data) })
        .then(() => {
          this.afterSubmit()
        })
        .catch(error => {
          this.setState({ formSubmitted: false })
          this.setTestConnectivityVisiblility()
          throw error
        })
    } else {
      delete data.uuid
      delete data.serviceId
      data.serviceTemplateId = this.serviceTemplate.uuid // this.props.serviceTemplate.uuid
      apis.service
        .create(apis.getInfrastructureMappingEndPoint(appId, envId), { body: JSON.stringify(data) })
        .then(res => {
          this.afterSubmit()
          if (this.props.hasOwnProperty('onSubmit')) {
            this.props.onSubmit(res.resource.uuid)
          }
        })
        .catch(error => {
          this.setState({ formSubmitted: false })
          this.setTestConnectivityVisiblility()
          throw error
        })
    }
  }

  afterSubmit = () => {
    this.resetSchema()
    this.setState({ initialized: false })
    this.props.onSubmit()
  }

  modifyFormDataForEdit () {
    const schema = Utils.clone(this.state.schema)
    const data = Utils.clone(this.state.formData)
    const copiedData = {}
    copiedData.uuid = data.uuid
    copiedData.serviceTemplateId = data.serviceTemplateId
    Object.keys(data).forEach(function (property) {
      if (schema.properties.hasOwnProperty(property)) {
        copiedData[property] = data[property]
      }
    })
    if ('hostNamesText' in copiedData) {
      copiedData['hostNames'] = copiedData.hostNamesText.split(/[\n|,]/).filter(o => o.length > 0)
      delete copiedData.hostNamesText
    }
    return copiedData
  }

  onAddInfraProvider = () => {
    this.setState({ showConnectorModal: true })
  }

  onSubmit = ({ formData }) => {
    //  console.log(formData.computeProviderSettingId)
    if (this.infraMappingType === infraMappingTypes.AWS_SSH) {
      delete formData.awsInstanceFilter.awsTags
    }
    if (!this.state.error) {
      this.setState({
        formSubmitted: true,
        testConnectivity: false,
        spinnerText: 'SUBMITTING...',
        schemaLoading: false
      })

      formData.computeProviderType = this.getComputeProviderType(formData.computeProviderSettingId)

      formData.infraMappingType = formData.computeProviderType + '_' + formData.deploymentType

      if ('hostNamesText' in formData) {
        formData['hostNames'] = formData.hostNamesText.split(/[\n|,]/).filter(o => o.length > 0)
        delete formData.hostNamesText

        if (!formData.loadBalancerId) {
          formData.loadBalancerId = ''
          formData.loadBalancerName = ''
        }
      }
      this.submitData(formData, this.props.data ? true : false)
    }
  }
  modifyFormDataForDirectKuberNetes = data => {
    const schema = Utils.clone(this.state.schema)
    const schemaProps = Object.keys(schema.properties)
    if (!this.isNew) {
      Object.keys(data).map(property => {
        if (schemaProps.indexOf(property) === -1) {
          delete data[property]
        }
      })
    }
  }
  resetDataOnServiceChange = formData => {
    const data = {}
    data.serviceId = formData.serviceId
    data.autoPopulate = formData.autoPopulate
    data.name = formData.name
    this.setState({ formData: data, testConnectivity: false })
  }
  onChangeOfRegion = async ({ formData }) => {
    delete formData.loadBalancerId
    if (formData.deploymentType === 'SSH') {
      const schema = FormUtils.clone(this.state.schema)
      const uiSchema = FormUtils.clone(this.state.uiSchema)
      this.setState({ schemaLoading: true, formData, showAwsTags: false })

      await this.updatePropertiesForAWSSSH(formData, schema, uiSchema)
      this.setState({ schema, uiSchema, schemaLoading: false })
    } else if (formData.deploymentType === 'ECS') {
      this.fetchClusters(this.props.appId, formData.region, formData.computeProviderSettingId, true)
    } else if (formData.deploymentType === 'AWS_CODEDEPLOY') {
      this.updateSchemaWithAppDeploymentConfigs(formData.region, formData.computeProviderSettingId)
    } else if (formData.deploymentType === Utils.AWSDeploymentTypes.Lambda) {
      this.updateSchemaWithVPC(formData.region, formData.computeProviderSettingId)
    }
  }
  onChangeForAWSCodeDeploy = ({ formData }) => {
    const prevFormData = FormUtils.clone(this.state.formData)
    if (formData.applicationName !== prevFormData.applicationName) {
      prevFormData.applicationName = formData.applicationName
      this.disableProperty(['deploymentGroup'])
      this.showLoading(['deploymentGroup'], prevFormData)

      this.updateSchemaWithDeploymentGroup(formData.region, formData.computeProviderSettingId, formData.applicationName)
    }
  }
  onChangeForDirectKubernetes = ({ formData }) => {
    const prevFormData = FormUtils.clone(this.state.formData)
    if (
      formData.deploymentType === prevFormData.deploymentType &&
      (formData.masterUrl !== prevFormData.masterUrl || formData.username !== prevFormData.username)
    ) {
      this.computeDisplayName(formData)
    }
  }
  onChangeOfService = ({ formData }) => {
    this.computeProviderList = []
    this.cloudProviderNames = []
    this.computeProviderTypes = []
    const serviceId = formData.serviceId
    this.resetDataOnServiceChange(formData)
    this.modifySchema(serviceId)
  }
  onChangeOfDeploymentType = ({ formData }) => {
    this.clearCloudProviders()
    this.resetFormData(formData, { deploymentChange: true, deploymentType: formData.deploymentType })
    const schema = Utils.clone(this.schema)
    const uiSchema = Utils.clone(this.uiSchema)
    uiSchema.computeProviderSettingId = {}
    uiSchema.deploymentType = {}

    this.filterComputeProviders(this.props.objComputeProviders, formData.deploymentType)
    const providerList = this.computeProviderList
    this.fillComputeProviders(providerList, schema)
    this.setState({ schema, uiSchema, testConnectivity: false })
  }

  onChangeOfAWSSSH = async ({ formData }) => {
    const prevFormData = FormUtils.clone(this.state.formData)
    const schema = FormUtils.clone(this.state.schema)
    const uiSchema = FormUtils.clone(this.state.uiSchema)
    this.setState({ formData })

    if (formData.provisionInstances !== prevFormData.provisionInstances) {
      await this.onChangeOfProvisionInstances(formData, schema, uiSchema)
    } else if (formData.setDesiredCapacity !== prevFormData.setDesiredCapacity) {
      this.onChangeOfSetDesiredCapacity(formData, uiSchema, schema)
    }
  }

  onChangeOfProvisionInstances = async (formData, schema, uiSchema) => {
    if (formData.provisionInstances) {
      if (formData.awsInstanceFilter) {
        delete formData.awsInstanceFilter
      }
      await this.updateSchemaWithAutoScalingGroups(formData, schema, uiSchema)
    } else {
      uiSchema['awsInstanceFilter']['classNames'] = ''
      this.setSchemaLoading(true)

      await this.updatePropertiesForAWSSSH(formData, schema, uiSchema)
      if (formData.autoScalingGroupName) {
        delete formData.autoScalingGroupName
      }

      this.setState({ uiSchema, schemaLoading: false, key: Math.random(), schema })
    }
  }

  onChangeOfSetDesiredCapacity = (formData, uiSchema, schema, canUpdate = true) => {
    if (formData.setDesiredCapacity) {
      this.showProperties(['desiredCapacity'], uiSchema)
      uiSchema.desiredCapacity = { classNames: css.desiredCapacity }
    } else {
      delete formData.setDesiredCapacity
      this.hideProperties(['desiredCapacity'], uiSchema)
    }
    if (canUpdate) {
      this.setState({ uiSchema, schemaLoading: false, schema })
    }
  }

  updateSchemaWithAutoScalingGroups = async (formData, schema, uiSchema, canUpdate = true) => {
    const appId = this.props.appId
    const computeProviderId = formData.computeProviderSettingId
    const region = formData.region

    uiSchema['awsInstanceFilter']['classNames'] = css.hide

    this.showProperties(['autoScalingGroupName', 'setDesiredCapacity'], uiSchema)
    this.setSchemaLoading(true)

    const { autoScalingGroups } = await AWSSSHInfraService.getAutoScalingGroups({ appId, computeProviderId, region })
    const autoScalingProperty = schema.properties.autoScalingGroupName
    FormUtils.fillEnumAndNamesWithSimpleArray(autoScalingProperty, autoScalingGroups)
    uiSchema.autoScalingGroupName = {
      'ui:widget': 'SearchableSelect',
      'ui:placeholder': 'Select AutoScaling Group'
    }

    if (canUpdate) {
      this.setState({ schema, uiSchema, schemaLoading: false })
    } else if (!this.isNew) {
      this.onChangeOfSetDesiredCapacity(formData, uiSchema, schema, false)
    }
  }

  setSchemaLoading = shouldLoad => {
    this.setState({ schemaLoading: shouldLoad })
  }

  showProperties = (properties, uiSchema) => {
    properties.map(property => {
      uiSchema[property] = {}
    })
  }

  hideProperties = (properties, uiSchema) => {
    properties.map(property => {
      uiSchema[property] = { 'ui:widget': 'hidden' }
    })
  }

  removeNameFromRequired = (formData) => {
    const schema = FormUtils.clone(this.state.schema)
    const uiSchema = FormUtils.clone(this.state.uiSchema)

    const requiredArr = schema.required
    const nameIdx = requiredArr.indexOf('name')
    if (nameIdx > -1) {
      requiredArr.splice(nameIdx, 1)
      schema.required = requiredArr
    }
    if (!uiSchema.name) {
      uiSchema['name'] = { 'ui:placeholder': 'Enter Custom Name For Service InfraStructure' }
    }


    uiSchema.name['ui:disabled'] = true
    this.setState({ schema, uiSchema, formData })
  }

  addNameToRequiredArr = (formData) => {

    const schema = FormUtils.clone(this.state.schema)
    const uiSchema = FormUtils.clone(this.state.uiSchema)
    const requiredArr = schema.required
    const nameIdx = requiredArr.indexOf('name')

    if (nameIdx <= -1) {
      requiredArr.push('name')
    }
    if (uiSchema.name) {
      delete uiSchema.name['ui:disabled']
    }
    this.setState({ schema, uiSchema, formData })
  }

  onChange = async ({ formData }) => {
    const prevFormData = this.state.formData

    if (prevFormData === null || formData.serviceId !== prevFormData.serviceId) {
      this.onChangeOfService({ formData })
    } else if (formData.deploymentType !== prevFormData.deploymentType) {
      this.onChangeOfDeploymentType({ formData })
    } else if (
      formData.computeProviderSettingId !== prevFormData.computeProviderSettingId &&
      formData.computeProviderSettingId !== addSelect &&
      formData !== undefined
    ) {
      this.updateValidChanges(prevFormData, formData)
    } else if (formData.autoPopulate !== prevFormData.autoPopulate) {
      this.onChangeForAutoPopulate(formData)
    } else if (formData.loadBalancerId !== prevFormData.loadBalancerId && !formData.loadBalancerId) {
      delete formData.loadBalancerId
    } else if (formData.region !== prevFormData.region) {
      this.onChangeOfRegion({ formData })
    } else if (formData.computeProviderSettingId === addSelect) {
      this.onAddInfraProvider()
    } else if (formData.hostConnectionAttrs === 'NEW SSH') {
      this.onAddNewSSHKey()
    } else if (formData.loadBalancerId === 'NEW ELB') {
      this.onAddNewElb()
    } else if (formData.deploymentType === 'AWS_CODEDEPLOY' && formData.applicationName) {
      this.onChangeForAWSCodeDeploy({ formData })
    } else if (formData.computeProviderSettingId === DIRECT_KUBERNETES) {
      this.onChangeForDirectKubernetes({ formData })
    } else if (formData.vpcId !== prevFormData.vpcId) {
      this.updateSchemaWithSubnetAndSecurityGroup({ formData })
    } else if (this.infraMappingType === infraMappingTypes.AWS_SSH) {
      await this.onChangeOfAWSSSH({ formData })
    } else {

      this.setState({ formData })
    }
  }


  onChangeForAutoPopulate = (formData) => {
    if (formData.autoPopulate) {
      this.removeNameFromRequired(formData)
    } else {
      this.addNameToRequiredArr(formData)
    }
  }

  clearCloudProviders = () => {
    this.cloudProviderNames = []
    this.computeProviderList = []
  }
  computeDisplayName = formData => {
    const masterUrl = formData.masterUrl
    const userName = formData.username
    // const data = Utils.clone(this.state.formData)
    if (masterUrl) {
      const urlName = Utils.slugifyHttpStencilUrl(masterUrl)
      this.limitCharecters(masterUrl, userName, urlName)
    }
  }
  limitCharecters (masterUrl, userName, modifiedUrl) {
    const data = Utils.clone(this.state.formData)
    if (modifiedUrl === undefined) {
      return
    }
    if (masterUrl === undefined) {
      return
    }

    data.masterUrl = masterUrl
    if (userName) {
      data.username = userName
    }
    const modifiedName = userName ? `${modifiedUrl}${userName}` : modifiedUrl
    data.clusterName = modifiedName.substring(0, 24)
    this.setState({ formData: data })
  }
  showLoading = (propertyArr, data) => {
    const schema = Utils.clone(this.state.schema)

    propertyArr.map(property => {
      schema.properties[property]['enum'] = ['']
      schema.properties[property]['enumNames'] = LOADINGTEXT
    })

    this.setState({ schema, formData: data })
  }
  disableProperty = propertyArr => {
    const uiSchema = Utils.clone(this.state.uiSchema)
    propertyArr.map(property => {
      uiSchema[property] = { 'ui:disabled': true }
    })
    this.setState({ uiSchema })
  }
  updateSchemaWithAppDeploymentConfigs = (region, computeProviderId) => {
    if (this.isNew) {
    }
    const data = Utils.clone(this.state.formData)
    data.region = region
    data.applicationName = ''
    data.deploymentGroup = ''
    this.resetDeploymentConfig(data)
    // data.deploymentConfig = ''
    this.disableProperty(['applicationName', 'deploymentConfig', 'deploymentGroup'])
    this.showLoading(['applicationName', 'deploymentConfig'], data)
    const schema = Utils.clone(this.state.schema)

    const uiSchema = Utils.clone(this.state.uiSchema)
    const fetchArr = [
      this.updateSchemaWithApps(region, computeProviderId, schema),
      this.updateSchemaWithDeploymentConfiguration(region, computeProviderId, schema)
    ]
    Promise.all(fetchArr)
      .then(result => {
        uiSchema.applicationName = {
          'ui:widget': 'SearchableSelect',
          'ui:placeholder': 'Select Application'
        }
        uiSchema.deploymentConfig = {}
        const data = Utils.clone(this.state.formData)

        this.setState({ schema, formData: data, error: false, uiSchema })
      })
      .catch(error => {
        this.setErrorOnState()
      })
  }

  updateSchemaWithVPC = async (region, computeProviderId) => {
    const schema = Utils.clone(this.state.schema)
    const uiSchema = Utils.clone(this.state.uiSchema)
    const data = Utils.clone(this.state.formData)
    data.region = region
    this.addHideToProperties(uiSchema, ['subnetIds', 'securityGroupIds'])
    this.showLoadingPlaceHolder(uiSchema, 'vpcId', data)
    const response = await this.fetchVPC(this.props.appId, computeProviderId, region)
    const vpcIdProperty = schema.properties.vpcId
    if (vpcIdProperty) {
      const vpcOptions = Object.values(response)
      this.updateEnumOptionsForVpcId(schema, uiSchema, vpcOptions)
    }

    this.setState({ schema, formData: data, schemaLoading: false })
  }

  showLoadingPlaceHolder = (uiSchema, property, data) => {
    uiSchema[property] = { 'ui:placeholder': 'Loading...' }
    this.setState({ uiSchema, formData: data, schemaLoading: true })
  }
  addHideToProperties = (uiSchema, properties) => {
    properties.map(property => {
      uiSchema[property] = { classNames: css.hide }
    })
    // this.setState({ uiSchema })
  }
  updateSchemaWithApps = (region, computeProviderId, schema) => {
    if (region && computeProviderId) {
      return this.fetchApplications(region, computeProviderId)
        .then(result => {
          this.afterFetchApps(result.resource, schema)
        })
        .catch(error => {
          // throw error
          this.setErrorOnState()
        })
    }
  }
  fetchApplications = (region, computeProviderId) => {
    if (region && computeProviderId) {
      return apis.fetchApplicationNamesForCodeDeploy(this.props.appId, region, computeProviderId)
    }
  }

  afterFetchApps = (applications, schema) => {
    // / const schema = Utils.clone(this.state.schema)
    // const uiSchema = Utils.clone(this.state.uiSchema)
    schema.properties.applicationName['enum'] = Object.values(applications)
    schema.properties.applicationName['enumNames'] = Object.values(applications)
    // this.setState({ schema, error: false })
  }

  resetDeploymentConfig = data => {
    if (data.hasOwnProperty('deploymentConfig') && !data.deploymentConfig) {
      delete data.deploymentConfig
    }
  }
  updateSchemaWithDeploymentGroup = (region, computeProviderId, applicationName) => {
    const data = Utils.clone(this.state.formData)

    if (region && computeProviderId && applicationName) {
      data.applicationName = applicationName
      this.resetDeploymentConfig(data)
      this.fetchDeploymentGroup(region, computeProviderId, applicationName)
        .then(result => {
          this.afterFetchDeploymentGroups(result.resource, data)
        })
        .catch(error => {
          this.setErrorOnState()
        })
    }
  }

  updateSchemaWithSubnetAndSecurityGroup = async ({ formData }) => {
    const uiSchema = FormUtils.clone(this.state.uiSchema)
    const schema = FormUtils.clone(this.state.schema)
    const applicationId = this.props.appId
    const region = formData.region
    const vpcIds = [formData.vpcId]

    const computeProviderId = formData.computeProviderSettingId

    this.setState({ schemaLoading: true, formData })
    const { subnets } = await AWSLambdaInfraService.getSubnetIdsForApplication({
      applicationId,
      computeProviderId,
      region,
      vpcIds
    })

    const subnetClassName = formData.deploymentType === 'SSH' ? css.subnetField : ''
    this.updateOptionsOnAWSLambdaSchema(schema, uiSchema, 'subnetIds', subnets, subnetClassName)

    const securityGroupClassName = formData.deploymentType === 'SSH' ? css.securityGroupField : ''
    const { securityGroups } = await AWSLambdaInfraService.getSecurityGroupIdsForApplication({
      applicationId,
      computeProviderId,
      region,
      vpcIds
    })

    this.updateOptionsOnAWSLambdaSchema(schema, uiSchema, 'securityGroupIds', securityGroups, securityGroupClassName)

    this.setState({ schema, uiSchema, key: Math.random(), formData, schemaLoading: false })
  }

  updateOptionsOnAWSLambdaSchema = (schema, uiSchema, property, response, className = null) => {
    schema.properties[property].items.enum = [...response]
    schema.properties[property].items.enumNames = [...response]
    uiSchema[property] = { 'ui:widget': this.renderUiWidgetForAWSLambda.bind(this, response), classNames: className }
  }

  updateEnumOptionsForVpcId = (schema, uiSchema, options) => {
    schema.properties.vpcId['enum'] = [...options]
    schema.properties.vpcId['enumNames'] = [...options]
    uiSchema.vpcId = {}
  }

  setSchemaWithDeploymentGroup = (region, computeProviderId, applicationName, schema) => {
    if (region && computeProviderId && applicationName) {
      return this.fetchDeploymentGroup(region, computeProviderId, applicationName)
        .then(result => {
          const deploymentGroupList = result.resource
          console.log(Object.values(deploymentGroupList))
          schema.properties.deploymentGroup['enum'] = Object.values(deploymentGroupList)
          schema.properties.deploymentGroup['enumNames'] = Object.values(deploymentGroupList)
        })
        .catch(error => {
          this.setErrorOnState()
        })
    }
  }

  fetchDeploymentGroup = (region, computeProviderId, applicationName) => {
    if (region && computeProviderId && applicationName) {
      return apis.fetchDeploymentGroupsForCodeDeploy(this.props.appId, region, computeProviderId, applicationName)
    }
  }
  afterFetchDeploymentGroups = (deploymentGroupList, data, newSchema) => {
    const schema = Utils.clone(this.state.schema)
    const uiSchema = Utils.clone(this.state.uiSchema)
    schema.properties.deploymentGroup['enum'] = Object.values(deploymentGroupList)
    schema.properties.deploymentGroup['enumNames'] = Object.values(deploymentGroupList)
    uiSchema.deploymentGroup = {}
    this.setState({ schema, error: false, formData: data, uiSchema })
  }

  updateSchemaWithDeploymentConfiguration = (region, computeProviderId, schema) => {
    // const data = Utils.clone(this.state.formData)
    if (region && computeProviderId) {
      return this.fetchDeploymentConfiguration(region, computeProviderId)
        .then(result => {
          this.afterFetchDeploymentConfiguration(result.resource, schema)
        })
        .catch(error => {
          this.setErrorOnState()
        })
    }
  }
  afterFetchDeploymentConfiguration = (configList, schema) => {
    // const schema = Utils.clone(this.state.schema)
    schema.properties.deploymentConfig['enum'] = Object.values(configList)
    schema.properties.deploymentConfig['enumNames'] = Object.values(configList)
    // this.setState({ schema, error: false, formData: data })
  }
  fetchDeploymentConfiguration = (region, computeProviderId) => {
    if (region && computeProviderId) {
      return apis.fetchDeploymentConfigsForCodeDeploy(this.props.appId, region, computeProviderId)
    }
  }
  onAddNewElb = () => {
    this.setState({ showLoadBalancerConnectorModal: true })
  }

  hideElbModal = () => {
    this.setState({ showLoadBalancerConnectorModal: false })
  }

  onAddNewSSHKey = () => {
    this.setState({ showSettingModal: true })
  }

  hideSettingsModal = () => {
    this.setState({ showSettingModal: false })
  }

  /*
    updates modal/schema if cloud provider/dep type is changed
  */
  updateValidChanges (prevFormData, formData) {
    const prevComputeProviderId = Utils.getJsonValue(prevFormData.computeProviderSettingId) || ''
    const prevDeploymentType = Utils.getJsonValue(prevFormData.deploymentType) || ''
    // formData.hostConnectionAttrs = ''

    if (formData.computeProviderSettingId && formData.computeProviderSettingId !== prevComputeProviderId) {
      this.resetFormData(formData)
      //  this.addCloudProviderToSchema(this.state.formData)
      // this.resetSchema(data)
      this.updateModalForInfraMappingType(this.props.appId)
      // this.updateFormData(data)
    } else if (formData.deploymentType !== prevDeploymentType) {
      this.resetFormData(formData, { deploymentChange: true, deploymentType: formData.deploymentType })
      const dataObj = Utils.clone(this.state.formData)
      this.addCloudProviderToSchema(dataObj)

      this.updateModalForInfraMappingType(this.props.appId)
    } else if (
      !formData.computeProviderSettingId !== prevComputeProviderId &&
      !formData.deploymentType !== prevDeploymentType
    ) {
      if (formData.hasOwnProperty('loadBalancerId') && !formData.loadBalancerId) {
        delete formData.loadBalancerId
      } else if (formData.hasOwnProperty('clusterName') && !formData.clusterName) {
        delete formData.clusterName
      }
      this.setState({ formData })
    }
  }

  resetFormData (formData, deploymentObj = { deploymentChange: false }) {
    if (!formData) {
      formData = Utils.clone(this.state.formData)
    }
    const data = {}
    data.autoPopulate = formData.autoPopulate
    data.name = formData.name
    data.serviceId = formData.serviceId
    data.computeProviderSettingId = !deploymentObj.deploymentChange ? formData.computeProviderSettingId : ''
    data.deploymentType = !deploymentObj.deploymentChange ? formData.deploymentType : deploymentObj.deploymentType
    this.setState({ formData: data })
    if (!deploymentObj.deploymentChange) {
      this.setState({ schemaLoading: true })
    }
  }

  updateFormData (formData) {
    const schema = this.state.schema
    for (const key of Object.keys(formData)) {
      if (!schema.properties.hasOwnProperty(key) && key !== 'computeProviderType' && key !== 'serviceTemplateId') {
        delete formData[key]
      }
    }
    this.setState({ formData })
    this.customizeFormData()
  }

  updateUiSchema (currentSchema, currentUiSchema) {

    if ('hostNames' in currentSchema.properties) {
      delete currentSchema.properties['hostNames']
      delete currentUiSchema['hostNames']
      // currentSchema.required = ['hostNamesText']
      currentSchema.properties['hostNamesText'] = { type: 'string', title: 'Host Name(s)' }
      currentUiSchema['hostNamesText'] = { 'ui:widget': 'textarea', 'ui:placeholder': 'hostname1\nhostname2' }
      const indx = currentUiSchema['ui:order'].indexOf('hostNames')
      currentUiSchema['ui:order'].splice(indx, 1, 'hostNamesText')
      this.setState({ testConnectivity: true })
    } else {
      this.setState({ testConnectivity: false, errorClass: '', errorMessage: '' })
    }
    // this.setState( { schema: currentSchema, uiSchema: currentUiSchema } )
  }

  /*
  Sets SSHModal Visibility and formData
  If hostConnectionType is of user/password type to show username and password
  else start showing the progress of host
  */
  setSSHModal = () => {
    const formData = this.state.formData
    if (formData.hasOwnProperty('hostNamesText') && formData.hostNamesText && formData.hostNamesText.length > 0) {
      const hostList = this.removeHostDuplicates(formData.hostNamesText.split(/[\n|,]/).filter(o => o.length > 0))
      const idx = this.state.schema.properties.hostConnectionAttrs.enum.findIndex(
        item => item === formData.hostConnectionAttrs
      )
      const hostCnctnString = this.state.schema.properties.hostConnectionAttrs.enumNames[idx]
      if (hostCnctnString && hostCnctnString.includes('User/Password')) {
        this.setState({ needsPassWord: true })
      } else {
        this.setState({ needsPassWord: false })
      }
      this.setState({ showSSHModal: true, SSHModalData: hostList, errorClass: '', errorMessage: '' })
    } else {
      this.setState({
        errorClass: '__error',
        errorMessage: 'Host Names and Connection Type is required to test connectivity.'
      })
    }
  }

  removeHostDuplicates (hostList) {
    return hostList.reduce(function callback (result, key, index, keysArray) {
      if (result.indexOf(key) === -1) {
        result.push(key)
      }
      return result
    }, [])
  }

  hideSSHModal = () => {
    const formData = this.state.formData
    if (formData.hasOwnProperty('hostNamesText')) {
      formData['hostNamesText'] = this.state.SSHModalData.join('\n')
    }
    this.setState({ showSSHModal: false, formData })
  }

  hideInfraModal = () => {
    this.resetSchema()
    this.props.onHide()
  }

  resetSchema = () => {
    this.uiSchema.computeProviderSettingId = disableString
    this.uiSchema.deploymentType = disableString
    delete this.uiSchema.autoPopulate['ui:disabled']
    this.infraMappingType = ''
    this.setState({
      schema: this.schema,
      uiSchema: this.uiSchema,
      error: false,
      initialized: false,
      testConnectivity: false,
      showSSHModal: false,
      formSubmitted: false,
      schemaLoading: false,
      showAwsTags: false,
      infraMappingType: null
    })
  }

  afterConnectorSubmit = data => {
    this.setState({ showConnectorModal: false })
    CompUtils.fetchComputeProviders(this, () => {
      const formData = Utils.clone(this.state.formData)
      this.filterComputeProviders(this.state.computeProviders.resource.response, formData.deploymentType)
      const schema = Utils.clone(this.state.schema)
      this.fillComputeProviders(this.computeProviderList, schema)
      formData.computeProviderSettingId = data.resource.uuid
      this.setState({ formData, schema })
      this.updateModalForInfraMappingType(this.props.appId)
    })
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
    } else if (this.state.schemaLoading) {
      return (
        <div className={css.main + ' ' + 'buttonBar'}>
          <button type="submit" disabled className="btn btn-info disabled">
            LOADING...
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

  renderLogOptionsModal () {
    return (
      <LogOptionsModal
        show={this.state.showAwsTags}
        tags={this.state.awsTags}
        hideLogOptions={this.hideLogOptions}
        savedtagIndex={this.savedTagIdx}
        setTags={this.setTags}
        logData={this.state.awsTagData}
        awsRegionTags={this.awsRegionTags}
        editTag={this.updateTag}
        appId={this.props.appId}
        // There's a serviceTemplateId, should it be passed instead?
        entityId={this.state.formData.serviceId}
      />
    )
  }

  setTags = (tags, optionObj) => {
    const formData = FormUtils.clone(this.state.formData)

    let tagArray = []

    if (!formData.awsInstanceFilter) {
      formData.awsInstanceFilter = {}
    }

    if (!formData.awsInstanceFilter.tags) {
      formData.awsInstanceFilter.tags = []
    } else {
      tagArray = formData.awsInstanceFilter.tags
    }

    tagArray.push(optionObj)
    formData.awsInstanceFilter.tags = tagArray
    formData.awsInstanceFilter.awsTags = tags.join('')

    this.setState({ awsTags: tags, formData })
  }

  updateTag = async (tagIdx, updatedTag, keyValData) => {
    const formData = FormUtils.clone(this.state.formData)
    const tags = FormUtils.clone(this.state.awsTags)

    tags[tagIdx] = updatedTag

    if (formData.awsInstanceFilter && formData.awsInstanceFilter.tags) {
      const tagData = formData.awsInstanceFilter.tags
      tagData[tagIdx] = keyValData

      formData.awsInstanceFilter.tags = tagData
      formData.awsInstanceFilter.awsTags = tags.join('')
    }
    this.setState({ awsTags: tags, formData, key: Math.random() })
  }

  getFieldTemplate = () => {
    if (this.state.infraMappingType === infraMappingTypes.AWS_AWSLAMBDA) {
      return FormFieldTemplate
    } else if (this.state.infraMappingType === infraMappingTypes.AWS_SSH) {
      return NestedFormTemplate
    }
    return undefined
  }

  render () {
    const pluginSchema = Utils.getJsonValue(this, 'state.pluginSchema.resource')
    const plugins = Utils.getJsonValue(this, 'state.plugins.resource')
    const jsonSchema = Utils.getJsonValue(this, 'state.pluginSchema.resource.HOST_CONNECTION_ATTRIBUTES.jsonSchema')
    const uiSchema = Utils.getJsonValue(this, 'state.pluginSchema.resource.HOST_CONNECTION_ATTRIBUTES.uiSchema')
    const testConnectionBtnCls = this.state.testConnectivity ? '__show' : '__hide'

    return (
      <WingsModal show={this.props.show} onHide={this.hideInfraModal} className={css.main}>
        <Modal.Header closeButton>
          <Modal.Title>Service Infrastructure</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <WingsForm
            name="Service Template"
            ref="form"
            schema={this.state.schema}
            uiSchema={this.state.uiSchema}
            formData={this.state.formData}
            onChange={this.onChange}
            onSubmit={this.onSubmit}
            onError={log('errors')}
            key={this.state.key}
            widgets={this.state.widgets}
            FieldTemplate={this.getFieldTemplate()}
          >
            {this.renderButton()}
          </WingsForm>
          <button
            className={`__test-connectivity-btn ${testConnectionBtnCls}`}
            type="button"
            onClick={this.setSSHModal}
          >
            Test Host Connectivity
          </button>

          <span className={this.state.errorClass}>{this.state.errorMessage}</span>
        </Modal.Body>
        {this.state.showConnectorModal && <AcctConnectorModal
          plugins={plugins}
          categoryType={'CloudProvider'}
          schema={pluginSchema}
          computeProviderId={this.state.formData && this.state.formData.computeProviderId}
          show={this.state.showConnectorModal}
          onHide={() => this.setState({ showConnectorModal: false })}
          onSubmit={data => {
            this.resetFormData()
            this.afterConnectorSubmit(data)
            //  this.props.onSubmitConnector(data)
          }}
          pluginCategory={this.props.catalogs && this.props.catalogs.PLUGIN_CATEGORY}
          catalogs = {this.props.catalogs}
        />}
        <AcctConnectorModal
          plugins={plugins}
          categoryType={'LoadBalancer'}
          schema={pluginSchema}
          computeProviderId={this.state.formData && this.state.formData.computeProviderId}
          show={this.state.showLoadBalancerConnectorModal}
          onHide={() => this.setState({ showLoadBalancerConnectorModal: false })}
          onSubmit={data => {
            this.updateInfraMappingModalWithNewLoadBalancer(this.props.appId, data)
            this.hideElbModal()
          }}
          pluginCategory={this.props.catalogs && this.props.catalogs.PLUGIN_CATEGORY}
          catalogs = {this.props.catalogs}
        />
        <SSHConnectionModal
          show={this.state.showSSHModal}
          data={this.state.SSHModalData}
          onHide={this.hideSSHModal}
          infraModalData={this.state.formData}
          usrPwdType={this.state.needsPassWord}
          appId={this.props.appId}
          envId={this.props.envId}
        />
        <AcctSettingModal
          show={this.state.showSettingModal}
          onHide={this.hideSettingsModal}
          jsonSchema={jsonSchema}
          uiSchema={uiSchema}
          onSubmit={data => {
            this.hideSettingsModal()
            this.updateInfraMappingModalWithNewHostConnectionAttribute(this.props.appId, data)
          }}
          SshKey={true}
        />

        {this.state.showAwsTags && (
          <div className={`__tags-form-control ${css.tagsComponent}`}>

            <div className={css.tagFormArrow}> </div>
            {this.renderLogOptionsModal()}
          </div>
        )}
      </WingsModal>
    )
  }
}




// WEBPACK FOOTER //
// ../src/containers/ServiceTemplatePage/InfraStructureMappingModal.js