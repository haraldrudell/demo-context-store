import React from 'react'
import Select from 'react-select'
import { Modal } from 'react-bootstrap'
import {
  FormFieldTemplate,
  WingsModal,
  WingsForm,
  AutoComplete,
  Utils,
  ArtifactJobSelection
} from 'components'
import AcctConnectorModal from '../AcctConnectorPage/AcctConnectorModal'
import apis from 'apis/apis'
import css from './ArtifactStreamModal.css'

const LOADING_TEXT = 'Loading...'

const addSelect = '<New Source Server>'
const schema = {
  type: 'object',
  properties: {
    uuid: { type: 'string', title: 'uuid' },
    artifactStreamType: { type: 'string', title: 'Source Type' },
    settingId: { type: 'string', title: 'Source Server' }
  }
}

const customSelect = props => {
  const options = Utils.enumArrToSelectArr(
    props.schema.enum || [],
    props.schema.enumNames || []
  )
  let placeholder = 'Please select a value...'
  if (props.schema.enum && props.schema.enum[0] === LOADING_TEXT) {
    placeholder = LOADING_TEXT
  }
  return (
    <Select
      key={props.id}
      value={props.value ? props.value : null}
      placeholder={placeholder}
      options={options}
      onChange={selected => {
        const val = selected ? selected.value : null
        props.onChange(val)
      }}
    />
  )
}

const autosuggest = props => {
  const options = []

  for (const i in props.schema.suggestions) {
    options.push({
      value: props.schema.suggestions[i],
      name: props.schema.suggestions[i]
    })
  }

  const getSuggestions = value => {
    const inputValue = value ? value.trim().toLowerCase() : ''
    const inputLength = inputValue.length
    return inputLength === 0
      ? options
      : options.filter(el => el.name.toLowerCase().indexOf(inputValue) >= 0)
  }

  const val = props.value ? props.value : ''

  return (
    <AutoComplete
      key={props.id}
      value={val}
      getSuggestions={getSuggestions}
      onChange={(event, val) => {
        val = val || ''
        props.onChange(val.newValue)
      }}
    />
  )
}

const widgets = {
  customSelect: customSelect,
  autosuggest: autosuggest
}

const uiSchema = {
  uuid: { 'ui:widget': 'hidden' },
  serviceId: { 'ui:widget': 'hidden' },
  artifactStreamType: { classNames: '__selectElement' },
  settingId: { classNames: '__selectElement pull-right' },
  jobname: { 'ui:widget': 'customSelect' },
  // autoDownload: { classNames: '__checkbox' },
  autoApproveForProduction: { classNames: css.checkbox },
  artifactPaths: { classNames: css.artifactPathServices },
  artifactPattern: { 'ui:help': 'Pattern sample: path/artifactName*' }
}

const log = type => {} // console.log.bind(console, type)

export default class ArtifactStreamModal extends React.Component {
  static contextTypes = {
    pubsub: React.PropTypes.object, // isRequired
    catalogs: React.PropTypes.object // isRequired
  }
  state = {
    formData: {},
    schema: Utils.clone(schema),
    uiSchema: Utils.clone(uiSchema),
    submitting: false,
    key: '',
    showCloudProviderModal: false
  }
  pubsubToken = null
  skipOnchange = true
  // appIdFromUrl = Utils.appIdFromUrl()
  objArtifactSourceType = {}
  nexusGroupIds = []

  componentWillMount () {
    console.log(this.props.catalogs)
    this.appIdFromUrl = this.props.appIdFromUrl
    this.fetchData(this.props.serviceId)
  }

  componentWillUnmount () {
    this.context.pubsub.unsubscribe(this.pubsubToken)
  }

  componentWillReceiveProps (newProps) {
    if (newProps.show) {
      const isEditing = newProps.data ? true : false
      // Editing flow
      if (isEditing) {
        this.init(newProps)
      } else {
        // for  creation flow
        this.initSchema(newProps)
      }
    }
  }

  initSchema = () => {
    const _schema = Utils.clone(schema)
    _schema.properties.artifactStreamType.enum = Object.keys(
      this.objArtifactSourceType
    )
    _schema.properties.artifactStreamType.enumNames = Object.keys(
      this.objArtifactSourceType
    ).map(k => this.objArtifactSourceType[k])

    this.setState({ schema: _schema })
  }

  fetchData = serviceId => {
    apis.fetchBuildSourceTypes(this.appIdFromUrl, serviceId).then(r => {
      this.setArtifactStreamType(r.resource)
    })
    apis.fetchArtifactStreamStencils(this.appIdFromUrl, serviceId).then(r => {
      this.setState({ stencils: r.resource })
    })
    apis
      .fetchInstalledSettingSchema(this.acctId)
      .then(r => this.setState({ pluginSchema: r }))
    apis.fetchPlugins().then(r => this.setState({ plugins: r }))
  }

  init (props) {
    const formData = props.data
      ? Utils.clone(props.data)
      : {
        artifactStreamType: Object.keys(this.objArtifactSourceType)[0] // default to the 1st: 'JENKIN'
      }
    if (Array.isArray(formData.artifactPaths)) {
      formData.artifactPaths = formData.artifactPaths[0]
    }
    this.setState({ formData })
    this.updateSchema(formData.artifactStreamType)
    setTimeout(() => {
      this.updateServices(props.appServices)
      this.fetchSourceTypeNames(
        formData.artifactStreamType,
        this.props.serviceId
      )
      if (formData.jobname) {
        if (formData.artifactStreamType === 'NEXUS') {
          this.fetchGroupIds(formData.jobname, formData.settingId)
          this.fetchArtifactPaths(
            formData.jobname,
            formData.settingId,
            formData.groupId
          )
        } else if (formData.artifactStreamType === 'ARTIFACTORY') {
          this.fetchGroupIds(formData.jobname, formData.settingId)
        } else if (formData.artifactStreamType === 'JENKINS') {
          this.fetchArtifactJenkinsJobPaths(
            formData.jobname,
            formData.settingId
          )
        } else if (formData.artifactStreamType === 'AMAZON_S3') {
          this.fetchS3ArtifactPaths(formData.jobname, formData.settingId)
        } else {
          this.fetchArtifactPaths(formData.jobname, formData.settingId)
        }
      }
    })
  }

  setArtifactStreamType (resource) {
    if (!resource) {
      return
    }
    for (const key in resource) {
      this.objArtifactSourceType[key] = resource[key]
    }
  }

  updateSchema = artifactStreamType => {
    if (!this.state.stencils || this.state.stencils.length <= 0) {
      return
    }

    let _stencil = this.state.stencils.find(o => o.type === artifactStreamType)

    if (!_stencil) {
      return
    }

    const service = this.props.appServices.find(
      svc => svc.uuid === this.props.serviceId
    )
    // #TODO: Refactor this requirement: when user chooses 'ARTIFACTORY' => use ARTIFACTORYDOCKER's jsonSchema
    if (_stencil.type === 'ARTIFACTORY') {
      if (service && service.artifactType === 'DOCKER') {
        _stencil = this.state.stencils.find(o => o.type === 'ARTIFACTORYDOCKER')
      }
    }
    const _schema = Utils.clone(schema)
    _schema.properties = Object.assign(
      {},
      Utils.clone(schema.properties),
      Utils.clone(_stencil.jsonSchema.properties)
    )

    const _uiSchema = Object.assign(
      {},
      Utils.clone(uiSchema),
      Utils.clone(_stencil.uiSchema)
    )
    if (_schema.properties.artifactPaths) {
      _schema.properties.artifactPaths = {
        type: 'string',
        title: _schema.properties.artifactPaths.title,
        enum: [],
        enumNames: []
      }
    }
    _schema.properties.artifactStreamType.enum = Object.keys(
      this.objArtifactSourceType
    )
    _schema.properties.artifactStreamType.enumNames = Object.keys(
      this.objArtifactSourceType
    ).map(k => this.objArtifactSourceType[k])
    //  _schema.properties.artifactStreamType.default = artifactStreamType

    switch (artifactStreamType) {
      case 'DOCKER':
        this.removeDisableOnFields(_uiSchema)
        _schema.required = _schema.required || [
          'artifactStreamType',
          'settingId',
          'imageName'
        ]
        break
      case 'ECR':
        this.addDisableOnFields(_uiSchema)
        _schema.required = _schema.required || [
          'artifactStreamType',
          'settingId',
          'imageName'
        ]
        break
      case 'GCR':
        this.removeDisableOnFields(_uiSchema)
        _schema.required = _schema.required || [
          'artifactStreamType',
          'settingId',
          'registryHostName',
          'dockerImageName'
        ]
        break
      case 'NEXUS':
        this.addDisableOnFields(_uiSchema)
        _schema.required = _schema.required || [
          'artifactStreamType',
          'settingId',
          'jobname',
          'groupId',
          'artifactPaths'
        ]
        break
      case 'ARTIFACTORY':
        this.addDisableOnFields(_uiSchema)
        if (service && service.artifactType === 'DOCKER') {
          _schema.required = _schema.required || [
            'artifactStreamType',
            'settingId',
            'jobname',
            'groupId'
          ]
        } else {
          _schema.required = _schema.required || [
            'artifactStreamType',
            'settingId',
            'jobname'
          ]
        }
        break
      case 'AMAZON_S3':
        this.addDisableOnFields(_uiSchema)
        _schema.required = _schema.required || [
          'artifactStreamType',
          'settingId',
          'jobname',
          'artifactPaths'
        ]
        break
      default:
        this.addDisableOnFields(_uiSchema)
        _schema.required = _schema.required || [
          'artifactStreamType',
          'settingId',
          'jobname',
          'artifactPaths'
        ]
        break
    }

    this.setState({ schema: _schema, uiSchema: _uiSchema })
  }
  // disabling the fields while the data is being Loaded
  addDisableOnFields = __uiSchema => {
    const uiClassName = { classNames: '__selectElement', 'ui:disabled': true }
    __uiSchema.artifactStreamType = uiClassName
    __uiSchema.settingId = {
      classNames: '__selectElement pull-right',
      'ui:disabled': true
    }
    //  uiSchema.jobname = { 'ui:widget': 'customSelect' }
  }

  onSubmit = ({ schema, formData }) => {
    const _data = Utils.clone(formData)
    delete _data.key
    delete _data.artifactStreamAttributes
    const streamType = formData.artifactStreamType

    const service = this.props.appServices.find(
      svc => svc.uuid === this.props.serviceId
    )
    _data.serviceId = this.props.serviceId
    if (schema.properties.jobname) {
      const jobindex = schema.properties.jobname.enum.findIndex(
        el => el === _data.jobname
      )
      _data.sourceName = schema.properties.jobname.enumNames[jobindex]
    } else if (schema.properties.imageName) {
      _data.sourceName = _data.imageName
    }

    if (schema.properties.artifactPaths) {
      _data.artifactPaths = [_data.artifactPaths]
    }
    if (streamType === 'NEXUS') {
      _data.sourceName = _data.sourceName
        .concat('/')
        .concat(formData.groupId)
        .concat('/')
        .concat(_data.artifactPaths)
    }
    if (streamType === 'ARTIFACTORY') {
      if (service && service.artifactType === 'DOCKER') {
        _data.sourceName = _data.sourceName.concat('/').concat(formData.groupId)
      } else {
        const jobindex = schema.properties.jobname.enum.findIndex(
          el => el === _data.jobname
        )
        _data.sourceName = schema.properties.jobname.enumNames[jobindex]
        if (_data.artifactPattern) {
          _data.sourceName = _data.sourceName
            .concat('/')
            .concat(_data.artifactPattern)
        }
      }
    }

    if (streamType === 'AMAZON_S3') {
      const jobindex = schema.properties.jobname.enum.findIndex(
        el => el === _data.jobname
      )
      _data.sourceName = schema.properties.jobname.enumNames[jobindex]
      if (_data.artifactPaths) {
        _data.sourceName = _data.sourceName
          .concat('/')
          .concat(_data.artifactPaths)
      }
    }

    if (streamType === 'GCR') {
      _data.sourceName = _data.registryHostName
        .concat('/')
        .concat(_data.dockerImageName)
    }

    const isEdit = _data.uuid ? true : false
    this.submitData(_data, isEdit)
  }

  submitData = (data, isEdit) => {
    if (isEdit) {
      Utils.request(
        this,
        apis.service.replace(
          apis.getArtifactStreamsEndPoint(this.appIdFromUrl, data.uuid),
          { body: JSON.stringify(data) }
        )
      )
        .then(() => {
          this.hideModal()
          this.props.onSubmit()
        })
        .catch(error => {
          this.props.setCurrentStepStatus('paused')
          throw error
        })
    } else {
      Utils.request(
        this,
        apis.service.create(
          apis.getArtifactStreamsEndPoint(this.appIdFromUrl),
          { body: JSON.stringify(data) }
        )
      )
        .then(() => {
          this.hideModal()
          this.props.onSubmit()
        })
        .catch(error => {
          this.props.setCurrentStepStatus('paused')
          throw error
        })
    }
  }

  onAddSourceServer = () => {
    this.setState({ showConnectorModal: true })
  }

  onShowCloudProviderModal = () => {
    this.setState({ showCloudProviderModal: true })
  }

  onChange = ({ formData }, parentJobName) => {
    // formData.artifactStreamType = "JENKIN", "BAMBOO", "NEXUS"
    const streamType = formData.artifactStreamType
    const service = this.props.appServices.find(
      svc => svc.uuid === this.props.serviceId
    )
    if (streamType !== this.state.formData.artifactStreamType) {
      formData.settingId = '' // reset "Source Server" dropdown value
      this.updateSchema(streamType)
      for (const key of Object.keys(formData)) {
        if (!this.state.schema.properties[key]) {
          delete formData[key]
        }
      }
      this.setState({ formData })
      this.fetchSourceTypeNames(streamType, this.props.serviceId)
    } else if (
      formData.settingId &&
      formData.settingId !== this.state.formData.settingId
    ) {
      // when settingId ("Source Server"" dropdown) changed
      this.setState({ formData })
      if (formData.settingId === addSelect) {
        formData.settingId = this.state.formData.settingId
        if (streamType === 'GCR' || streamType === 'ECR') {
          this.onShowCloudProviderModal()
        } else {
          this.onAddSourceServer()
        }
      } else {
        if (streamType === 'ARTIFACTORY') {
          this.fetchJobNames(formData.settingId, serviceId)
        } else if (streamType === 'AMAZON_S3') {
          this.fetchS3Buckets(formData.settingId, streamType)
        } else if (streamType === 'JENKINS') {
          // Calling the right method for updating job names for jenkins
          this.fetchJenkinsJobNames(formData.settingId)
        } else {
          this.fetchJobNames(formData.settingId)
        }
      }
    } else if (
      typeof formData.metadataOnly !== 'undefined' &&
      formData.metadataOnly !== this.state.formData.metadataOnly
    ) {
      this.onMetadataOnlyChange(formData.metadataOnly)
      this.setState({ formData })
    } else if (
      formData.groupId &&
      formData.groupId !== this.state.formData.groupId
    ) {
      if (streamType !== 'ARTIFACTORY') {
        // for NEXUS, when groupId changed => fetch Nexus Artifact Paths
        formData.artifactPaths = '' // clear artifact paths
        this.setState({ formData })
        this.fetchArtifactPaths(
          formData.jobname,
          formData.settingId,
          formData.groupId
        )
      }
    } else if (
      formData.region &&
      formData.region !== this.state.formData.region
    ) {
      // region is only set for ECR
      formData.imageName = '' // clear image name
      this.setState({ formData })
      this.fetchDockerImageName(formData.settingId, formData.region)
    } else if (formData.jobname) {
      if (
        !this.state.formData.jobname ||
        formData.jobname !== this.state.formData.jobname
      ) {
        if (streamType === 'NEXUS') {
          // for NEXUS, also fetch "GroupIds" for the groupId dropdown.
          formData.groupId = ''
          formData.artifactPaths = ''
          this.fetchGroupIds(formData.jobname, formData.settingId)
        } else if (streamType === 'ARTIFACTORY') {
          if (service && service.artifactType === 'DOCKER') {
            formData.groupId = ''
            this.fetchGroupIds(formData.jobname, formData.settingId)
          }
        } else if (streamType === 'AMAZON_S3') {
          formData.artifactPaths = ''
          this.fetchS3ArtifactPaths(formData.jobname, formData.settingId)
        } else if (streamType === 'JENKINS') {
          formData.artifactPaths = '' // clear artifact paths
          this.fetchArtifactJenkinsJobPaths(
            formData.jobname,
            formData.settingId
          )
        } else {
          this.fetchArtifactPaths(formData.jobname, formData.settingId)
        }
      }

      this.setState({ formData })
    } else {
      this.setState({ formData })
    }
  }

  showArtifactPathsLoading () {
    const formData = this.state.formData
    const __schema = this.state.schema
    const __uiSchema = this.state.uiSchema

    if (!__schema.properties.artifactPaths) {
      return
    }
    __uiSchema.artifactPaths = {
      'ui:disabled': true,
      'ui:placeholder': 'Loading...'
    }
    __schema.properties.artifactPaths.enum = [LOADING_TEXT]
    __schema.properties.artifactPaths.enumNames = [LOADING_TEXT]
    formData.key = 'artifactPaths-Loading'
    this.setState({ formData, uiSchema: __uiSchema, schema: __schema })
  }

  updateArtifactStreamType () {
    if (!this.state.schema.properties.artifactStreamType) {
      return
    }
    const __schema = this.state.schema
    __schema.properties.artifactStreamType.enum = Object.keys(
      this.objArtifactSourceType
    )
    __schema.properties.artifactStreamType.enumNames = Object.keys(
      this.objArtifactSourceType
    ).map(k => this.objArtifactSourceType[k])
    __schema.properties.artifactStreamType.default = Object.keys(
      this.objArtifactSourceType
    )[0]
    this.setState({ schema: __schema })
  }

  updateServices (appServices) {
    if (appServices && this.state.schema.properties.serviceId) {
      const objServices = {}
      appServices.map(service => {
        objServices[service.uuid] = service.name
      })
      const __schema = this.state.schema
      __schema.properties.serviceId.enum = Object.keys(objServices)
      __schema.properties.serviceId.enumNames = Object.keys(objServices).map(
        k => objServices[k]
      )
      __schema.properties.serviceId.default = Object.keys(objServices)[0]
      this.setState({ schema: __schema })
    }
  }

  updateSourceTypeNames = sourceTypeNames => {
    if (sourceTypeNames) {
      const formData = Utils.clone(this.state.formData)
      const objCatalogNames = {}
      sourceTypeNames.map(item => {
        objCatalogNames[item.uuid] = item.name
      })
      const catalogKeys = Object.keys(objCatalogNames)
      const firstSourceTypeName =
        catalogKeys.length === 1 ? catalogKeys[0] : catalogKeys[1]

      const __schema = Utils.clone(this.state.schema)
      const title = __schema.properties.settingId['title']
      __schema.properties.settingId = { type: 'string', title: title }
      __schema.properties.settingId['enum'] = catalogKeys.concat([addSelect])
      __schema.properties.settingId['enumNames'] = catalogKeys
        .map(k => objCatalogNames[k])
        .concat([addSelect])
      __schema.properties.settingId['default'] = firstSourceTypeName
      if (!formData.settingId) {
        formData.settingId = firstSourceTypeName
      }
      formData.key = `sourceTypeNames-Loaded-${Math.random()}`
      this.setState({ formData, schema: __schema })
    }
    if (sourceTypeNames.length === 0) {
      const __uiSchema = Utils.clone(this.state.uiSchema)
      this.removeDisableOnFields(__uiSchema)
      this.setState({ uiSchema: __uiSchema })
    }
  }

  updateJobs (jobs, showLoadingText = false) {
    if (jobs) {
      const __schema = Utils.clone(this.state.schema)
      const __uiSchema = Utils.clone(this.state.uiSchema)
      if (Array.isArray(jobs)) {
        __schema.properties.jobname['enum'] = jobs
        __schema.properties.jobname['enumNames'] = jobs
      } else {
        __schema.properties.jobname['enum'] = Object.keys(jobs)
        __schema.properties.jobname['enumNames'] = Object.values(jobs)

        // removing the disability on schema fields
        this.removeDisableOnFields(__uiSchema)
      }
      this.setState({ schema: __schema, uiSchema: __uiSchema })
    }
  }

  updateAwsRegions (regions) {
    if (regions) {
      const __schema = Utils.clone(this.state.schema)
      const __data = Utils.clone(this.state.formData)
      const __uiSchema = Utils.clone(this.state.uiSchema)
      if (Array.isArray(regions)) {
        __schema.properties.region['enum'] = regions
        __schema.properties.region['enumNames'] = regions
        __data.region = 'Loading...'
      } else {
        __schema.properties.region['enum'] = Object.keys(regions)
        __schema.properties.region['enumNames'] = Object.values(regions)

        // Auto select image that passed from props, if it's matched
        const { data } = this.props || {}

        if (data) {
          const { region } = data
          if (region) {
            __data.region = region
            this.fetchDockerImageName(__data.settingId, __data.region)
          }
        }

        this.removeDisableOnFields(__uiSchema)
      }

      this.setState({
        schema: __schema,
        formData: __data,
        uiSchema: __uiSchema
      })
    }
  }

  updateDockerImage (images) {
    if (images) {
      const formData = this.state.formData
      const __schema = Utils.clone(this.state.schema)
      const __uiSchema = Utils.clone(this.state.uiSchema)

      if (Array.isArray(images) && images.length > 0) {
        __schema.properties.imageName.enum = images
        __schema.properties.imageName.enumNames = images
        __schema.properties.imageName.suggestions = images
        //        __uiSchema.imageName = { 'ui:widget': 'customSelect' }
      } else {
        delete __schema.properties.imageName.suggestions
        __schema.properties.imageName.enum = [null]
        __schema.properties.imageName.enumNames = ['No images are available']
        //        __uiSchema.imageName = { 'ui:widget': 'customSelect', 'ui:disabled': true }
      }
      this.setState({ formData, uiSchema: __uiSchema, schema: __schema })
    }
  }

  updateGroupIdsDropdown (groupIdsArr) {
    const formData = this.state.formData
    const __schema = Utils.clone(this.state.schema)
    const __uiSchema = Utils.clone(this.state.uiSchema)

    if (Array.isArray(groupIdsArr) && groupIdsArr.length > 0) {
      __schema.properties.groupId.enum = groupIdsArr
      __schema.properties.groupId.enumNames = groupIdsArr
      __schema.properties.groupId.suggestions = groupIdsArr
      __uiSchema.groupId = { 'ui:widget': 'customSelect' }
      // __uiSchema.artifactPaths = { }
      // formData.key = 'groups-Loaded'
    } else {
      delete __schema.properties.groupId.suggestions
      __schema.properties.groupId.enum = [null]
      __schema.properties.groupId.enumNames = ['No Groups are available']
      __uiSchema.groupId = { 'ui:widget': 'customSelect', 'ui:disabled': true }
      this.updateArtifactPaths([])
      // formData.key = 'groups-Disabled'
    }
    this.setState({ formData, uiSchema: __uiSchema, schema: __schema })
  }

  updateArtifactPaths (artPaths) {
    const formData = this.state.formData

    if (formData.metadataOnly === true) {
      if (formData.artifactStreamType !== 'NEXUS') {
        this.onMetadataOnlyChange(true)
        return // 'Artifact Paths' is not applicable when metadataOnly === true
      }
    }

    const __schema = this.state.schema
    const __uiSchema = this.state.uiSchema

    // __schema.properties.artifactPaths = { 'type': 'string' }
    if (Array.isArray(artPaths) && artPaths.length > 0) {
      // __schema.properties.artifactPaths.enum = artPaths
      // __schema.properties.artifactPaths.required = false
      // __schema.properties.artifactPaths.enumNames = artPaths
      __schema.properties.artifactPaths.type = 'string'
      delete __schema.properties.artifactPaths.enum
      delete __schema.properties.artifactPaths.enumNames
      __schema.properties.artifactPaths.suggestions = artPaths
      __uiSchema.artifactPaths = { 'ui:widget': 'autosuggest' }
      // __uiSchema.artifactPaths = { }
      formData.key = `artifactPaths-Loaded${Math.random()}`
    } else {
      delete __schema.properties.artifactPaths.suggestions
      __schema.properties.artifactPaths.enum = [null]
      __schema.properties.artifactPaths.enumNames = ['No Paths are available']
      __uiSchema.artifactPaths = {
        'ui:disabled': true,
        'ui:placeholder': 'No Paths are available'
      }
      formData.key = 'artifactPaths-Disabled'
    }
    this.removeDisableOnFields(__uiSchema)
    this.setState({ formData, uiSchema: __uiSchema, schema: __schema })
  }

  onMetadataOnlyChange = metadataOnly => {
    const formData = this.state.formData
    const __schema = this.state.schema
    const __uiSchema = this.state.uiSchema

    if (metadataOnly === true) {
      if (
        formData.artifactStreamType !== 'NEXUS' &&
        formData.artifactStreamType !== 'AMAZON_S3'
      ) {
        __schema.properties.artifactPaths.enum = ['']
        __schema.properties.artifactPaths.enumNames = ['']
        __uiSchema.artifactPaths = { 'ui:disabled': true }
        // delete formData['artifactPaths']
        formData.artifactPaths = ''
        Utils.setFormRequired(__schema, 'artifactPaths', false)
      }
    } else {
      __uiSchema.artifactPaths = { 'ui:disabled': false }
      Utils.setFormRequired(__schema, 'artifactPaths', true)
    }

    this.setState({ formData, uiSchema: __uiSchema, schema: __schema })
  }

  fetchSourceTypeNames (streamType = 'JENKINS', serviceId) {
    let fetchStreamType = streamType
    if (streamType === 'AMAZON_S3' || streamType === 'ECR') {
      fetchStreamType = 'AWS'
    } else if (streamType === 'GCR') {
      fetchStreamType = 'GCP'
    } else if (streamType === 'AMAZON_S3') {
      fetchStreamType = 'AWS'
    }

    apis.service
      .list(
        apis.getSettingsConfigEndpoint(this.props.appIdFromUrl, fetchStreamType)
      )
      .then(res => {
        if (res.resource && res.resource.response) {
          this.updateSourceTypeNames(res.resource.response)
          if (
            Array.isArray(res.resource.response) &&
            res.resource.response.length > 0
          ) {
            switch (streamType) {
              case 'DOCKER':
                break
              case 'ECR':
                this.fetchAwsRegions()
                break
              case 'GCR':
                // do nothing
                break
              case 'ARTIFACTORY':
                this.fetchJobNames(res.resource.response[0].uuid, serviceId)
                break
              case 'AMAZON_S3':
                this.fetchS3Buckets(res.resource.response[0].uuid)
                break
              case 'JENKINS':
                this.fetchJenkinsJobNames(res.resource.response[0].uuid, null)
                break
              default:
                const settingUuid = res.resource.response[0].uuid
                this.fetchJobNames(settingUuid)
                break
            }
          }
        } else {
          log('No source names available')
        }
      })
      .catch(error => {
        throw error
      })
  }

  fetchDockerImageName (settingUuid, region) {
    this.updateDockerImage([LOADING_TEXT])
    apis.service
      .list(
        apis.getBuildSourcePathsEndPoint(
          this.props.appIdFromUrl,
          region,
          settingUuid
        )
      )
      .then(res => {
        if (res.resource) {
          this.updateDockerImage(res.resource)
        } else {
          // log('No docker images available')
        }
      })
      .catch(error => {
        throw error
      })
  }

  async fetchAwsRegions () {
    this.updateAwsRegions([LOADING_TEXT])
    const response = await apis.getAWSRegionNames()
    if (response.resource) {
      this.updateAwsRegions(response.resource)
    }
  }

  fetchJobNames (settingUuid, serviceId) {
    this.updateJobs([LOADING_TEXT], true)
    apis.service
      .list(
        apis.getBuildSourcePlansEndpoint(
          this.props.appIdFromUrl,
          settingUuid,
          serviceId
        )
      )
      .then(res => {
        if (res.resource) {
          this.updateJobs(res.resource)
        } else {
          log('No job names available')
        }
      })
      .catch(error => {
        throw error
      })
  }

  fetchS3Buckets (settingUuid) {
    this.updateJobs([LOADING_TEXT], true)
    apis.service
      .list(
        apis.getBuildSourcePlansWithStreamTypeEndpoint(
          this.props.appIdFromUrl,
          settingUuid,
          'AMAZON_S3'
        )
      )
      .then(res => {
        if (res.resource) {
          this.updateJobs(res.resource)
        } else {
          log('No job names available')
        }
      })
      .catch(error => {
        throw error
      })
  }

  updateJenkinsJobName = (result, settingUuId) => {
    const __schema = Utils.clone(this.state.schema)
    const __uiSchema = Utils.clone(this.state.uiSchema)
    const formData = Utils.clone(this.state.formData)
    const jobList = this.filterJobList(result)

    __schema.properties.jobname.enum = jobList
    __schema.properties.jobname.enumNames = jobList
    __uiSchema.jobname = {
      'ui:widget': this.modifyJobUiSchema.bind(this, result, settingUuId)
    }
    formData.key = `jenkins-uiwidget-${Math.random()}`
    this.removeDisableOnJenkinsFields(__uiSchema)
    this.setState({
      schema: __schema,
      uiSchema: __uiSchema,
      formData
    })
  }

  filterJobList = result => {
    return Object.values(result).map(res => {
      if (!res.folder) {
        return res.jobName
      }
    })
  }

  modifyJobUiSchema = (result, settingUuid) => {
    const data = Utils.clone(this.state.formData)
    return (
      <ArtifactJobSelection
        jobList={result}
        appIdFromUrl={this.props.appIdFromUrl}
        settingUuId={settingUuid}
        modifyJobName={this.modifyJobName.bind(this)}
        modifyJobNameEnum={this.modifyJobNameEnum.bind(this)}
        jobName={data.jobname}
        parentJobName={data.parentJobName}
      />
    )
  }

  modifyJobNameEnum = list => {
    const __schema = Utils.clone(this.state.schema)
    const oldList = __schema.properties.jobname.enum
    __schema.properties.jobname.enum = oldList.concat(list)

    __schema.properties.jobname.enumNames = oldList.concat(list)
    this.setState({ schema: __schema })
  }

  modifyJobName = (jobName, parentJobName) => {
    const formData = Utils.clone(this.state.formData)
    formData.jobname = this.getJobPath(jobName, parentJobName)
    // formData.parentJobName = parentJobName
    this.onChange({ formData })
  }

  getJobPath = (jobName, parentJobName, encode = false) => {
    const path = parentJobName ? `${parentJobName}/${jobName}` : jobName
    return encode ? encodeURIComponent(path) : path
  }

  fetchJenkinsJobNames (settingUuid, parentJobName = null) {
    this.updateJobs([LOADING_TEXT], true)
    apis.service
      .list(
        apis.getJenkinsBuildJobsEndPoint(
          this.props.appIdFromUrl,
          settingUuid,
          parentJobName
        )
      )
      .then(res => {
        if (res.resource) {
          this.updateJenkinsJobName(res.resource, settingUuid)
          // this.updateJobs(res.resource)
        } else {
          log('No job names available')
        }
      })
      .catch(error => {
        throw error
      })
  }

  fetchGroupIds (jobName, settingId) {
    apis.service
      .list(
        apis.getBuildSourceJobsEndpoint(
          this.props.appIdFromUrl,
          jobName,
          'groupIds',
          settingId
        )
      )
      .then(res => {
        if (res.resource) {
          this.updateGroupIdsDropdown(res.resource)
        } else {
          log('No Groups available')
        }
      })
      .catch(error => {
        throw error
      })
  }

  fetchArtifactPaths (jobName, settingId, groupId = '') {
    this.showArtifactPathsLoading()
    let url = ''
    if (groupId) {
      url = apis.getBuildSourceJobsEndpoint(
        this.props.appIdFromUrl,
        jobName,
        'paths',
        settingId,
        groupId
      )
    } else {
      url = apis.getBuildSourcePathsEndPoint(
        this.props.appIdFromUrl,
        jobName,
        settingId
      )
    }
    apis.service
      .list(url)
      .then(res => {
        if (res.resource) {
          this.updateArtifactPaths(res.resource)
        } else {
          log('No artifactpaths available')
        }
      })
      .catch(error => {
        throw error
      })
  }

  fetchS3ArtifactPaths (bucketName, settingId) {
    this.showArtifactPathsLoading()
    apis.service
      .list(
        apis.getBuildSourcePathsWithStreamTypeEndPoint(
          this.props.appIdFromUrl,
          bucketName,
          settingId,
          'AMAZON_S3'
        )
      )
      .then(res => {
        if (res.resource) {
          this.updateArtifactPaths(res.resource)
        } else {
          log('No artifactpaths available')
        }
      })
      .catch(error => {
        throw error
      })
  }

  fetchArtifactJenkinsJobPaths (jobName, settingId) {
    this.showArtifactPathsLoading()
    const encodedPath = encodeURIComponent(jobName)
    const url = apis.getBuildSourcePathsEndPoint(
      this.props.appIdFromUrl,
      encodedPath,
      settingId
    )
    apis.service
      .list(url)
      .then(res => {
        if (res.resource) {
          this.updateArtifactPaths(res.resource)
        } else {
          log('No artifactpaths available')
        }
      })
      .catch(error => {
        throw error
      })
  }

  // removing disability after data is being loaded

  removeDisableOnFields = uiSchema => {
    if (uiSchema) {
      const formData = Utils.clone(this.state.formData)
      const uiClassName = { classNames: '__selectElement' }
      uiSchema.artifactStreamType = uiClassName
      uiSchema.settingId = { classNames: '__selectElement pull-right' }
      if (formData.artifactStreamType !== 'JENKINS') {
        uiSchema.jobname = { 'ui:widget': 'customSelect' }
      }
    }
  }
  removeDisableOnJenkinsFields = uiSchema => {
    if (uiSchema) {
      const uiClassName = { classNames: '__selectElement' }
      uiSchema.artifactStreamType = uiClassName
      uiSchema.settingId = { classNames: '__selectElement pull-right' }
    }
  }

  hideModal = () => {
    const __schema = Utils.clone(schema)
    const __uiSchema = Utils.clone(uiSchema)
    const data = { artifactStreamType: '', settingId: '' }
    this.setState({ schema: __schema, uiSchema: __uiSchema, formData: data })
    this.props.onHide()
  }
  afterConnectorSubmit = (data, cloudProviders = false) => {
    if (data) {
      const formData = Utils.clone(this.state.formData)
      formData.settingId = data.resource.uuid
      if (cloudProviders) {
        this.setState({ showCloudProviderModal: false, formData })
      } else {
        this.setState({ showConnectorModal: false, formData })
      }
      this.fetchSourceTypeNames(
        this.state.formData.artifactStreamType,
        this.props.serviceId
      )
    }
  }

  render () {
    const pluginSchema = Utils.getJsonValue(this, 'state.pluginSchema.resource')
    const plugins = Utils.getJsonValue(this, 'state.plugins.resource')
    const filteredPlugins = []

    if (plugins && this.state.formData) {
      if (this.state.formData.artifactStreamType === 'GCR') {
        filteredPlugins.push(plugins.find(pl => pl.type === 'GCP'))
      } else if (this.state.formData.artifactStreamType === 'ECR') {
        filteredPlugins.push(plugins.find(pl => pl.type === 'AWS'))
      } else if (this.state.formData.artifactStreamType === 'AMAZON_S3') {
        filteredPlugins.push(plugins.find(pl => pl.type === 'AWS'))
      } else {
        filteredPlugins.push(
          plugins.find(pl => pl.type === this.state.formData.artifactStreamType)
        )
      }
    }

    return (
      <WingsModal
        show={this.props.show}
        className={css.main}
        submitting={this.state.submitting}
        onHide={this.hideModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>Artifact Source</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <WingsForm
            name="Artifact Stream"
            ref="form"
            schema={this.state.schema}
            uiSchema={this.state.uiSchema}
            FieldTemplate={FormFieldTemplate}
            widgets={widgets}
            showErrorList={false}
            formData={this.state.formData}
            onChange={this.onChange}
            onSubmit={this.onSubmit}
            onError={log('errors')}
            key={this.state.key}
          >
            <div>
              <button
                type="submit"
                className="btn btn-primary submit-button"
                disabled={this.state.submitting}
              >
                Submit
              </button>
            </div>
          </WingsForm>
        </Modal.Body>
        <AcctConnectorModal
          plugins={filteredPlugins}
          categoryType={'Artifact'}
          schema={pluginSchema}
          show={this.state.showConnectorModal}
          onHide={() => this.setState({ showConnectorModal: false })}
          onSubmit={data => {
            this.afterConnectorSubmit(data)
          }}
          pluginCategory={this.props.pluginCategory}
        />
        <AcctConnectorModal
          plugins={filteredPlugins}
          categoryType={'CloudProvider'}
          schema={pluginSchema}
          show={this.state.showCloudProviderModal}
          onHide={() => this.setState({ showCloudProviderModal: false })}
          onSubmit={data => {
            this.afterConnectorSubmit(data, true)
          }}
          pluginCategory={this.props.pluginCategory}
        />
      </WingsModal>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/ArtifactStreamPage/ArtifactStreamModal.js