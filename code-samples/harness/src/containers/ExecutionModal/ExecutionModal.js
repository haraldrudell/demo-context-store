import React from 'react'
import { Button, Modal } from 'react-bootstrap'
import { WingsModal, WingsForm, Utils, ServiceArtifactSelect, FormUtils } from 'components'
// import Form from 'react-jsonschema-form'
import css from './ExecutionModal.css'
import { InfrasService } from 'services'
import apis from 'apis/apis'
const entityTypes = {
  envEntity: 'ENVIRONMENT',
  serviceEntity: 'SERVICE',
  infraEntity: 'INFRASTRUCTURE_MAPPING'
}

const schema = {
  type: 'object',
  required: ['orchestrationWorkflow'],
  properties: {
    uuid: { type: 'string', title: 'uuid', default: '' },
    applicationId: { type: 'string', title: 'Application', enum: [], enumNames: [] },
    // environment: { type: 'string', title: 'Environment', enum: [], enumNames: [] },
    orchestrationWorkflow: { type: 'string', title: 'Workflows', enum: [], enumNames: [] },
    workflowVariables: {
      type: 'object',
      title: '',
      required: [],
      properties: {}
    },
    workflowVariableList: { type: 'string', title: 'Workflow Variables' },
    artifactSelect: {
      type: 'string',
      title: 'Artifacts',
      data: { enum: [], enumNames: [] }
    },
    executionCredential: {
      type: 'object',
      title: 'Host\'s Credentials',
      properties: {
        sshUser: { type: 'string', title: 'SSH User', default: '', description: '' },
        sshPassword: { type: 'string', title: 'SSH Password', default: '', description: '' }
      }
    }
  }
}

const uiSchema = {
  uuid: { 'ui:widget': 'hidden' },
  applicationId: { 'ui:placeholder': 'Select Application' },
  // environment: { 'ui:placeholder': 'Select Environment' },
  orchestrationWorkflow: { 'ui:placeholder': 'Select Workflow' },
  workflowVariables: {
    'ui:widget': 'hidden'
  },
  workflowVariableList: { 'ui:widget': 'hidden' },
  artifactSelect: { 'ui:widget': 'hidden' },
  sshUser: { 'ui:widget': 'hidden' },
  sshPassword: { 'ui:widget': 'hidden' },
  executionCredential: {
    sshUser: { classNames: '__sshUser' },
    sshPassword: { 'ui:widget': 'password', classNames: '__sshPassword' },
    classNames: '__executionCredential __hidden'
  }
}

export default class ExecutionModal extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired,
    ...Utils.getDefaultContextTypes()
  }
  state = {
    key: '',
    schema,
    formSchema: Utils.clone(schema),
    formUiSchema: uiSchema,
    formData: {},
    formReady: true,
    error: '',
    dropdownClassName: '',
    initialized: false,
    serviceArray: [],
    artifacts: {},
    workflowVariablesFor: ''
  }
  selectedServices = {}
  isRerun = false
  renderArtifactComponent = (result, props) => {
    /* const selectedApp = Utils.findApp(this)
    const result = this.groupArtifactBuildsByService(selectedApp)*/
    const serviceNames = result.serviceNames
    const resultObj = result.groupedArtifacts
    const uniqServices = new Set(serviceNames)
    const data = Utils.clone(this.state.formData)
    const serviceArray = Array.from(uniqServices)
    if (serviceArray.length > 0) {
      return (
        <ServiceArtifactSelect
          services={serviceArray}
          selectedArtifacts={data.artifacts}
          parentProps={props}
          stopPropogation={this.stopPropogation}
          dropdownClassName={this.state.dropdownClassName}
          setDropDownClass={this.setDropDownClass}
          artifacts={resultObj}
          setArtifactsOnFormData={this.setArtifactsOnFormData}
          filterArtifactSelectByBuildNumber={this.filterArtifactSelectByBuildNumber}
        />
      )
    } else {
      return <div />
    }
  }

  setArtifactsOnFormData = selectedArtifactStreams => {
    const data = Utils.clone(this.state.formData)
    data.artifactSelect = selectedArtifactStreams
    this.setState({ formData: data })
  }
  getArtifactStream = (serviceId, streamData, artifactStreamId) => {
    const artifactsObj = this.artifacts

    const filteredArtifacts = artifactsObj.find(artifact => artifact.serviceId === serviceId)
    const result = {}
    //  const artifactStreamObj = streamData.find ( (item) => item.uuid === artifactsObj.artifactStreamId)
    if (filteredArtifacts) {
      for (const artifact of filteredArtifacts) {
        const artifactStreamObj = streamData.find(item => item.uuid === artifact.artifactStreamId)
        if (result.hasOwnProperty(sourceName)) {
          result[artifactStreamObj.sourceName] = []
        }
        result[artifactStreamObj.sourceName].push(artifact)
      }
    }

    return result
  }

  setDropDownClass = className => {
    this.setState({ dropdownClassName: className })
  }
  stopPropogation = event => {
    event.stopPropagation()
    event.nativeEvent.stopImmediatePropagation()
    return false
  }
  componentWillMount () {
    Utils.loadChildContextToState(this, 'app')
  }

  componentWillUnmount () {
    Utils.unsubscribeAllPubSub(this)
  }

  getSelectedEnv = envId => {
    const selectedApp = Utils.findApp(this)
    let selectedEnv = null
    if (selectedApp) {
      if (typeof envId === 'string') {
        selectedEnv = selectedApp.environments.find(env => env.uuid === envId)
      } else {
        selectedEnv = selectedApp.environments[0]
      }
    }
    return selectedEnv
  }

  setupApplications = _schema => {
    _schema.properties.applicationId['enum'] = this.props.apps.map(app => app.uuid)
    _schema.properties.applicationId['enumNames'] = this.props.apps.map(app => app.name)
  }

  setupEnvironments = (_schema, app) => {
    if (_schema && app) {
      _schema.properties.environment.enum = app.environments.map(item => item.uuid)
      _schema.properties.environment.enumNames = app.environments.map(item => item.name)
    }
  }

  componentWillReceiveProps (newProps) {
    if (newProps.show && !this.state.initialized) {
      this.setState({ formSchema: Utils.clone(schema) })

      const formData = {
        uuid: Utils.getJsonValue(newProps, 'data.uuid') || '',
        ...newProps.data
      }
      this.updateFormSchema(newProps, formData)
      this.setState({ initialized: true })
      if (!newProps.data) {
        this.setState({ formData })
      }
    }
  }
  /*
   For Templatized workflow -> traversing through uservariables
   and finding out service entity type and using their serviceIdS
   and for regular using regular serviceids
*/
  filterWorkflow = workflowId => {
    const orchestrations = this.orchestrations
    if (workflowId) {
      const filteredWorkflow = orchestrations.find(item => item.uuid === workflowId)
      if (filteredWorkflow && !this.isTemplateWorkflow) {
        return filteredWorkflow.services
      } else if (this.isTemplateWorkflow) {
        const userVariables = filteredWorkflow.orchestrationWorkflow.userVariables
        const serviceVariable = Utils.filterWorkflowVariablesByEntityType(userVariables, Utils.entityTypes.service)
        if (!serviceVariable) {
          return filteredWorkflow.services
        } else {
          return []
        }
      } else {
        return []
      }
    } else {
      return []
    }
  }
  updateForm = (params, formData, selectedApp, onLoad = false) => {
    const formSchema = Utils.clone(this.state.formSchema)
    const formUiSchema = Utils.clone(uiSchema)

    if (params.artifacts) {
      formSchema.properties.artifactSelect.data.enum = params.artifacts.map(item => item.uuid)
      formSchema.properties.artifactSelect.data.enumNames = params.artifacts.map(item => item.displayName)
    }

    if (params.orchestrations) {
      const workflows = Utils.clone(params.orchestrations)
      for (const wf of workflows) {
        if (wf.orchestrationWorkflow.valid === false) {
          wf.name += ' (Incomplete)'
        }
      }

      formSchema.properties.orchestrationWorkflow = {
        type: 'string',
        title: 'Workflow',
        enum: [...workflows.map(item => item.uuid)],
        enumNames: [...workflows.map(item => item.name)]
      }

      formUiSchema.orchestrationWorkflow = {}
    }

    const entityTypes = params.requiredEntityTypes
    formUiSchema['executionCredential'].classNames = '__executionCredential __hidden'
    Utils.setFormRequired(formSchema, 'artifactSelect', false)

    let serviceList = selectedApp && selectedApp.hasOwnProperty('services') ? selectedApp.services : []
    let groupedArtifactsObj
    if (entityTypes && Array.isArray(entityTypes)) {
      serviceList = formData ? this.filterWorkflow(formData.orchestrationWorkflow) : serviceList
      groupedArtifactsObj = ServiceArtifactSelect.groupArtifactBuildsByService(
        serviceList,
        this.artifacts,
        this.artifactStreamData
      )

      if (entityTypes.indexOf('ARTIFACT') >= 0) {
        Utils.setFormRequired(formSchema, 'artifactSelect', true)
        const uiWidget =
          groupedArtifactsObj.serviceNames.length > 0
            ? this.renderArtifactComponent.bind(this, groupedArtifactsObj)
            : 'hidden'
        formUiSchema.artifactSelect = { 'ui:widget': uiWidget, classNames: '__artifactSelect' }
      }

      if (entityTypes.indexOf('SSH_USER') >= 0) {
        formUiSchema['executionCredential'].classNames = '__executionCredential'
        // delete formUiSchema['sshUser'] // show sshUser
        formUiSchema['sshPassword'] = { 'ui:widget': 'password' }
        Utils.setFormRequired(formSchema, 'executionCredential', true)
      }

      // TODO: Respond to requiredArgs call to control where to show or hide variables entry
      // if (entityTypes.indexOf('WORKFLOW_VARIABLES') >= 0) {
      //   Utils.setFormRequired( formSchema, 'workflowVariables', true )
      // }
    }

    const workflowVariablesFor = this.state.workflowVariablesFor

    const workflowVariables = params.workflow
      ? FormUtils.clone(params.workflow.orchestrationWorkflow.userVariables)
      : []

    if (workflowVariables.length > 0 && formData.orchestrationWorkflow !== workflowVariablesFor) {
      this.setWorkFlowVariablesOnSchema(workflowVariablesFor, workflowVariables, formData, formSchema, formUiSchema)
    } else if (workflowVariables.length === 0) {
      this.removeWorkflowVariablesFromSchema(formSchema, formUiSchema)
    }

    if (this.props.forPipeline === true) {
      if (!onLoad) {
        const uiWidget =
          groupedArtifactsObj.serviceNames.length > 0 ? this.ArtifactSelect.bind(this, groupedArtifactsObj) : 'hidden'
        formUiSchema.artifactSelect = { 'ui:widget': uiWidget, classNames: '__artifactSelect' }
      }
    }

    setTimeout(() => {
      const selectEl = Utils.queryRef(this.refs.form, '.__artifactSelect', '.Select')
      if (selectEl) {
        selectEl.onclick = () => CompUtils.toggleArtifactDropdownItems(this.refs.form, this.artifacts)
      }
    }, 50)

    this.setState({ formSchema, formUiSchema, workflowVariablesFor, formData, key: Math.random() })
  }
  /*
    removing/clearing properties from the schema
  */
  removeWorkflowVariablesFromSchema = (formSchema, formUiSchema) => {
    formSchema.properties.workflowVariables.properties = {}
    formSchema.properties.workflowVariables.required = []
    formSchema.properties.workflowVariables.title = ''
  }
  /*
   Setting workflow variables on the schema and uiSchema
  */
  setWorkFlowVariablesOnSchema = (workflowVariablesFor, workflowVariables, formData, formSchema, formUiSchema) => {
    workflowVariablesFor = formData.orchestrationWorkflow
    const workflowVariablesLength = formData.workflowVariables ? Object.keys(formData.workflowVariables).length : 0
    const workflowVariableSchema = formSchema.properties.workflowVariables

    workflowVariableSchema.properties = {}
    workflowVariableSchema.required = []
    formUiSchema.workflowVariables = {}
    formData.workflowVariables = workflowVariablesLength === 0 ? {} : formData.workflowVariables
    workflowVariableSchema.properties['header'] = { type: 'string' }
    formUiSchema.workflowVariables['header'] = {
      'ui:widget': this.setUiWidgetForWorkflowVariablesHeader,
      classNames: css.workflowVariableTitle
    }
    if (workflowVariables.length > 0) {
      workflowVariableSchema['title'] = 'Workflow Variables'
    }
    workflowVariables.forEach(v => {
      workflowVariableSchema.properties[v.name] = {
        type: 'string'
      }
      if (v.value) {
        workflowVariableSchema.properties[v.name].default = formData.workflowVariables[v.name] = v.value
      }
      if (v.metadata.entityType) {
        const entityType = v.metadata.entityType
        const artifactType = v.metadata.artifactType
        workflowVariableSchema.properties[v.name]['enum'] = this.getEntityEnums(entityType, artifactType)
        workflowVariableSchema.properties[v.name]['enumNames'] = this.getEntityEnumNames(entityType, artifactType)
        workflowVariableSchema.properties[v.name]['entityType'] = entityType
      }
      if (v.mandatory) {
        workflowVariableSchema.required.push(v.name)
      }

      //  formUiSchema.workflowVariables[v.name] = { classNames: 'workflow-variable-field' }
      if (v.description && formUiSchema.workflowVariables[v.name]) {
        formUiSchema.workflowVariables[v.name]['ui:help'] = v.description
      }
      formUiSchema.workflowVariables[v.name] = {
        classNames: css.workflowField,
        'ui:widget': this.setUiWidgetForVariable.bind(this, v.name, v.metadata.entityType)
      }
    })
    formSchema.properties.workflowVariables = workflowVariableSchema
  }
  /* Setting ui Widget for each property of workflow variable */
  setUiWidgetForVariable = (property, entityType, props) => {
    const entityTypes = {
      ENVIRONMENT: 'Environment',
      SERVICE: 'Service',
      INFRASTRUCTURE_MAPPING: 'Service InfraStructure'
    }
    return (
      <div className={css.workflowVariable}>
        <span className={css.varCol}>{property}</span>
        <span className={css.varCol}> {entityTypes[entityType]}</span>
        <span className={css.valueField}>{this.renderWorkflowVariableInputField(props, property)}</span>
      </div>
    )
  }
  /* On change for workflow variables */
  onChangeOfWorklowVariable = (property, value) => {
    let isServiceChange = false
    const data = Utils.clone(this.state.formData)
    const workflowVariables = this.selectedWorkflow.orchestrationWorkflow.userVariables
    const variable = this.getWorkflowVariableOfEnvEntityType(workflowVariables, property)
    if (!data.workflowVariables) {
      data.workflowVariables = {}
    }
    if (!data.workflowVariables[property]) {
      data.workflowVariables[property] = {}
    }
    if (data.workflowVariables[property] !== value) {
      data.workflowVariables[property] = value
      if (variable.metadata.entityType === entityTypes.envEntity) {
        this.envVarible = value
        isServiceChange = false
      } else if (variable.metadata.entityType === entityTypes.serviceEntity) {
        this.modifiedService = value
        isServiceChange = true
        this.selectedServices[variable.name] = value
      }
      let serviceIdArr = Object.values(this.selectedServices)
      const serviceUserVariables = this.filterWorkflowVariableByEntityType(entityTypes.serviceEntity)
      if (this.envVarible) {
        // const dependentEntity = this.getWorkflowVariableOfEnvEntityType(workflowVariables, variable.relatedField)
        if (serviceIdArr.length > 0) {
          this.fetchServiceInfraMapping(data, this.envVarible, serviceIdArr, isServiceChange)
        } else if (serviceUserVariables.length === 0) {
          // If there is no service template expression -> using regular serviceids
          serviceIdArr = this.selectedWorkflow.services.map(service => service.uuid)
          this.fetchServiceInfraMapping(data, this.envVarible, serviceIdArr, true)
        }
      }
    }
    this.setState({ formData: data })
  }

  /* Rendering uiWidgets for Workflow variables */
  renderWorkflowVariableInputField = (props, property) => {
    const selValue = this.state.formData ? this.state.formData.workflowVariables[property] : ''
    if (props.schema.enum && props.schema.enumNames) {
      return (
        <select
          className="form-control"
          value={selValue}
          required={props.required}
          ref={props.ref}
          id={props.id}
          onChange={event => this.onChangeOfWorklowVariable(property, event.target.value)}
        >
          <option />
          {props.schema.enum.map((item, index) => {
            return <option value={item}>{props.schema.enumNames[index]}</option>
          })}
        </select>
      )
    } else {
      return (
        <input
          className="form-control"
          type="text"
          value={props.value}
          required={props.required}
          ref={props.ref}
          id={props.id}
          onChange={event => this.onChangeOfWorklowVariable(property, event.target.value)}
        />
      )
    }
  }
  /* Setting uiWidget for header */
  setUiWidgetForWorkflowVariablesHeader = () => {
    return (
      <div className={css.workflowVariableHeader}>
        <span className={css.varCol}> Variable Name</span>
        <span className={css.varCol}> Entity Type</span>
        <span className={css.valueCol}> Value</span>
      </div>
    )
  }
  /* Get entity names for workflow variable dropdowns */
  getEntityEnums = (entityType, artifactType) => {
    const app = this.application
    if (entityType === 'ENVIRONMENT') {
      const envList = app && app.hasOwnProperty('environments') ? app.environments : []
      if (envList) {
        return envList.map(env => env.uuid)
      }
    } else if (entityType === 'SERVICE') {
      return this.filterServiceByArtifactType(app, artifactType, 'uuid')
    } else {
      return []
    }
  }

  getEntityEnumNames = (entityType, artifactType) => {
    const app = this.application
    if (entityType === 'ENVIRONMENT') {
      const envList = app && app.hasOwnProperty('environments') ? app.environments : []
      if (envList) {
        return envList.map(env => env.name)
      }
    } else if (entityType === 'SERVICE') {
      return this.filterServiceByArtifactType(app, artifactType, 'name')
    } else {
      return []
    }
  }
  filterServiceByArtifactType = (app, artifactType, filterBy) => {
    const serviceList = app && app.hasOwnProperty('environments') ? app.services : []
    let filteredServices = []
    if (artifactType) {
      filteredServices = serviceList.filter(service => service.artifactType === artifactType)
    }
    if (filterBy) {
      return filteredServices.map(service => service[filterBy])
    }
    return filteredServices
  }

  updateFormSchema = (params, formData, onLoad = false) => {
    const formSchema = Utils.clone(this.state.formSchema)
    const formUiSchema = Utils.clone(uiSchema)
    this.setupApplications(formSchema)
    if (formData.applicationId) {
      this.application = this.filterAppById(formData.applicationId)
      const app = this.props.apps.find(o => o.uuid === formData.applicationId)
      this.isRerun = true
      formData.orchestrationWorkflow = formData.workflowId

      formData.environment = formData.envId // this.getEnvIdFromWorkflow(formData.orchestrationWorkflow)
      formData.artifactSelect = formData.artifacts.join(',')
      formData.workflowVariables = formData.workflowVariables
      this.fetchAndUpdateWorkflows(formData, app.uuid, formData.environment, () => {
        setTimeout(() => {
          this.setTemplatize(formData.workflowId)
          if (!this.isTemplateWorkflow) {
            this.fetchAndUpdateArtifacts(formData)
          } else {
            this.onRerun(formData)
          }
        }, 500)
      })
    } else {
      this.isRerun = false
    }

    // const selectedApp = this.props.apps[0]
    this.setState({ formSchema, formUiSchema, formData, key: Math.random() })
  }

  onRerun = formData => {
    this.updateForm({ orchestrations: this.orchestrations }, formData, this.application)
    this.fetchInfraMappingForTemplateWorkflowOnRerun(formData)
  }
  fetchInfraMappingForTemplateWorkflowOnRerun = formData => {
    if (this.isTemplateWorkflow) {
      let serviceIdArr = []
      const serviceVariables = this.filterWorkflowVariableByEntityType(Utils.entityTypes.service)
      if (serviceVariables.length > 0) {
        for (const variable of serviceVariables) {
          const serviceName = variable.name
          const wokflowVariablesOnFormData = formData.workflowVariables
          if (wokflowVariablesOnFormData[serviceName]) {
            this.selectedServices[serviceName] = wokflowVariablesOnFormData[serviceName]
            serviceIdArr.push(wokflowVariablesOnFormData[serviceName])
          }
        }
      } else {
        serviceIdArr = this.selectedWorkflow.services.map(service => service.uuid)
      }
      this.fetchServiceInfraMapping(formData, formData.environment, serviceIdArr, true)
    }
  }
  filterAppById = appId => {
    const apps = this.props.apps
    return apps.find(app => app.uuid === appId)
  }

  fetchAndUpdateWorkflows = (formData, appId, envId, callback) => {
    if (!appId) {
      return
    }
    this.props.fetchWorkflows(appId).then(data => {
      // const orchestrations = data.resource.response
      // this.props.fetchArtifacts(Utils.appIdFromUrl(), envId)
      //   .then((artifactsData) => {
      //     formData.artifactSelect = ''
      //     formData.orchestrationWorkflow = ''
      //     this.artifacts = artifactsData.resource.response
      //     this.orchestrations = orchestrations
      //     this.updateFormSchema({ artifacts: this.artifacts, orchestrations: this.orchestrations }, formData)
      //   })
      this.orchestrations = data.resource.response
      const selectedApp = Utils.findByUuid(this.props.apps, appId)
      this.updateForm({ orchestrations: this.orchestrations }, formData, selectedApp)
      if (callback) {
        callback()
      }
    })
  }

  fetchAndUpdateArtifacts = formData => {
    const envId = formData.environment
    const appId = formData.applicationId
    const selectedApp = this.filterAppById(appId)
    this.setState({
      formReady: false,
      error: this.isValidWorkflow(formData.orchestrationWorkflow) === false ? 'INVALID_WORKFLOW' : ''
    })
    apis.service
      .fetch(`executions/required-args?appId=${formData.applicationId}&envId=${envId}`, {
        method: 'POST',
        body: {
          workflowType: 'ORCHESTRATION',
          orchestrationId: formData.orchestrationWorkflow
        }
      })
      .then(res => {
        // this.updateFormSchema({ requiredEntityTypes: res.resource.entityTypes }, formData)
        // this.setState({ formReady: true })

        // filter Artifacts by Services - 02/13/2017
        const selectedWorkflow = this.orchestrations.find(w => w.uuid === formData.orchestrationWorkflow)
        this.selectedWorkflow = selectedWorkflow
        const serviceIdArr = selectedWorkflow.services.map(s => s['uuid'])
        const appId = formData.applicationId
        const selectedEnv = this.getSelectedEnv(formData.environment)
        const fetchArr = [
          this.getArtifactStreams(appId, serviceIdArr),
          this.getArtifacts(appId, envId, selectedEnv, serviceIdArr)
        ]

        Promise.all(fetchArr).then(response => {
          // formData.artifactSelect = ['QIv5C07KRQuESxXuw5Bz1w']
          this.updateForm(
            {
              requiredEntityTypes: res.resource.entityTypes,
              artifacts: this.artifacts,
              workflow: selectedWorkflow
            },
            formData,
            selectedApp,
            true
          )
          this.setState({ formReady: true })
        })
      })
      .catch(error => {
        throw error
      })
  }
  fetchAndUpdateArtifactsForTemplateWorkflow = (formData, envId, serviceIdArr, schema, uiSchema) => {
    const selectedApp = this.application
    const appId = formData.applicationId
    const fetchArr = [
      this.getArtifactStreams(appId, serviceIdArr),
      this.getArtifacts(appId, envId, envId, serviceIdArr)
    ]
    Promise.all(fetchArr).then(response => {
      this.updateArtifactComponentForTemplateWorkflow(selectedApp, serviceIdArr, schema, uiSchema, formData)
    })
  }

  updateArtifactComponentForTemplateWorkflow = (selectedApp, serviceIdArr, schema, uiSchema, formData) => {
    const data = Utils.clone(this.state.formData)
    const serviceList = []
    for (const serviceId of serviceIdArr) {
      const serviceObj = selectedApp.services.find(service => service.uuid === serviceId)
      serviceList.push(serviceObj)
    }
    const groupedArtifactsObj = ServiceArtifactSelect.groupArtifactBuildsByService(
      serviceList,
      this.artifacts,
      this.artifactStreamData
    )
    schema.properties.artifactSelect.data.enum = this.artifacts.map(item => item.uuid)
    schema.properties.artifactSelect.data.enumNames = this.artifacts.map(item => item.displayName)
    const uiWidget =
      groupedArtifactsObj.serviceNames.length > 0
        ? this.renderArtifactComponent.bind(this, groupedArtifactsObj)
        : 'hidden'
    uiSchema.artifactSelect = { 'ui:widget': uiWidget, classNames: '__artifactSelect' }
    this.setState({ formSchema: schema, formUiSchema: uiSchema, formData: data, key: Math.random() })
  }

  getEnvIdFromWorkflow = workflowId => {
    const workflows = this.orchestrations
    if (workflows) {
      const filteredWorkflow = workflows.find(workflow => workflow.uuid === workflowId)
      if (filteredWorkflow) {
        this.isTemplateWorkflow = filteredWorkflow.templatized
        return filteredWorkflow.envId
      }
    }
  }
  setTemplatize = workflowId => {
    const workflows = this.orchestrations
    if (workflows) {
      const filteredWorkflow = workflows.find(workflow => workflow.uuid === workflowId)
      if (filteredWorkflow) {
        this.selectedWorkflow = filteredWorkflow
        this.isTemplateWorkflow = filteredWorkflow.templatized
      }
    }
  }

  onChange = ({ formData }) => {
    const prevAppId = Utils.getJsonValue(this, 'state.formData.applicationId') || ''
    const appId = formData.applicationId
    if (appId !== prevAppId && appId) {
      const LoadingText = 'Loading...'
      const _schema = Utils.clone(this.state.formSchema)
      _schema.properties.orchestrationWorkflow.enum = [LoadingText]
      _schema.properties.orchestrationWorkflow.enumNames = [LoadingText]
      const _uiSchema = Utils.clone(this.state.formUiSchema)
      _uiSchema.orchestrationWorkflow = { 'ui:disabled': true }
      formData.orchestrationWorkflow = LoadingText
      this.setState({ formUiSchema: _uiSchema, formSchema: _schema, formData })
      this.fetchAndUpdateWorkflows(formData, formData.applicationId)
      this.application = this.filterAppById(appId)
      this.selectedServices = {}
      // this.setupEnvironments(_schema, app)
      this.setState({ formSchema: _schema })
      this.setState({ formData, key: Math.random() })
      this.isTemplateWorkflow = false
    }
    const prevWorkflow = Utils.getJsonValue(this, 'state.formData.orchestrationWorkflow') || ''
    if (formData.orchestrationWorkflow && formData.orchestrationWorkflow !== prevWorkflow) {
      this.serviceList = []
      formData.environment = this.getEnvIdFromWorkflow(formData.orchestrationWorkflow)
      this.fetchAndUpdateArtifacts(formData)
      this.selectedServices = {}
      this.setState({ formData, key: Math.random() })
    }
  }
  filterInfraMappingsByServiceId = (infraMappings, serviceId) => {
    if (infraMappings) {
      const filteredInfraMappings = infraMappings.filter(mapping => mapping.serviceId === serviceId)
      const workflowPhases = this.selectedWorkflow ? this.selectedWorkflow.orchestrationWorkflow.workflowPhases : []
      const filteredPhaseByServiceId = workflowPhases.find(phase => phase.serviceId === serviceId)
      /*
        Added comments
        To filter inframappings by the deployment Type
      */
      if (filteredPhaseByServiceId) {
        const filteredPhaseDepType = filteredPhaseByServiceId.deploymentType
        const infraMappingsFilterByDepType = filteredInfraMappings.filter(
          mapping => mapping.deploymentType === filteredPhaseDepType
        )
        return infraMappingsFilterByDepType
      }
      return filteredInfraMappings
    }
  }
  fetchServiceInfraMapping = async (formData, envId, serviceIdArr, isServiceChange) => {
    const appId = formData.applicationId

    const workflowVariables = this.selectedWorkflow.orchestrationWorkflow.userVariables
    const { infraMappings } = await InfrasService.getInfraMappingsForApplication(appId, envId, serviceIdArr)

    const schema = FormUtils.clone(this.state.formSchema)
    const uiSchema = FormUtils.clone(this.state.formUiSchema)
    const schemaProperties = schema.properties

    for (const serviceId of serviceIdArr) {
      const filteredInfraMappings = this.filterInfraMappingsByServiceId(infraMappings, serviceId)
      const serviceVariable = this.getVariableKeyFromFormData(serviceId)
      let inframappingKey
      let inframappingVariable
      if (serviceVariable) {
        inframappingVariable = this.getWorkflowVariableOfEnvEntityType(
          workflowVariables,
          serviceVariable.metadata.relatedField
        )
        inframappingKey = inframappingVariable.name
      } else {
        inframappingVariable = this.filterWorkflowVariableByEntityType(entityTypes.infraEntity)
        if (inframappingVariable.length > 0) {
          inframappingKey = inframappingVariable[0].name
        }
      }
      let workflowVariableProperties = schemaProperties.workflowVariables.properties
      if (Object.keys(workflowVariableProperties).length === 0 && formData.workflowVariables) {
        this.setWorkFlowVariablesOnSchema(formData.orchestrationWorkflow, workflowVariables, formData, schema, uiSchema)
        workflowVariableProperties = schema.properties.workflowVariables.properties
      }
      if (filteredInfraMappings.length > 0 && inframappingKey) {
        workflowVariableProperties[inframappingKey]['enum'] = filteredInfraMappings.map(mapping => mapping.uuid)
        workflowVariableProperties[inframappingKey]['enumNames'] = filteredInfraMappings.map(
          mapping => mapping.displayName
        )
      } else if (inframappingKey) {
        workflowVariableProperties[inframappingKey]['enum'] = []
        workflowVariableProperties[inframappingKey]['enumNames'] = []
      }
    }

    if (isServiceChange) {
      this.fetchAndUpdateArtifactsForTemplateWorkflow(formData, envId, serviceIdArr, schema, uiSchema)
    } else {
      this.setState({ formSchema: schema, formUiSchema: uiSchema, formData })
    }
  }

  getServiceIdsFromWorkflowVariables = entityType => {
    const data = Utils.clone(this.state.formData)
    const serviceIdSet = new Set()
    let entityTypeArr = []
    const variables = this.filterWorkflowVariableByEntityType(entityType)

    for (const variable of variables) {
      const variableValue = data.workflowVariables[variable.name]
      if (variableValue) {
        serviceIdSet.add(variableValue)
      }
    }
    entityTypeArr = Array.from(serviceIdSet)
    return entityTypeArr
  }
  getVariableKeyFromFormData = serviceId => {
    const selectedServices = this.selectedServices
    const workflowVariables = this.selectedWorkflow.orchestrationWorkflow.userVariables
    for (const serviceKey in selectedServices) {
      if (selectedServices[serviceKey] === serviceId) {
        return workflowVariables.find(variable => variable.name === serviceKey)
      }
    }
  }
  filterWorkflowVariableByEntityType = entityType => {
    const variablesSet = new Set()
    const workflowVariables = this.selectedWorkflow.orchestrationWorkflow.userVariables
    for (const variable of workflowVariables) {
      if (variable.metadata.entityType === entityType) {
        variablesSet.add(variable)
      }
    }
    const entityVariables = Array.from(variablesSet)
    return entityVariables
  }
  getWorkflowVariableOfEnvEntityType = (workflowVariables, fieldName) => {
    for (const variable of workflowVariables) {
      if (variable.name === fieldName) {
        return variable
      }
    }
  }

  getArtifacts = (appId, envId, selectedEnv, serviceIdArr, searchFilter = null) => {
    return this.props
      .fetchArtifacts(appId, envId, selectedEnv, null, serviceIdArr, searchFilter)
      .then(artifactsData => {
        this.artifacts = artifactsData.resource.response
      })
  }
  getArtifactStreams = (appId, serviceIdArr) => {
    return this.props.fetchArtifactStreamDataForDeployment(appId, serviceIdArr).then(result => {
      this.artifactStreamData = result.resource.response
    })
  }
  filterArtifactSelectByBuildNumber = buildNumber => {
    const formData = Utils.clone(this.state.formData)
    const envId = formData.environment
    const selectedWorkflow = this.orchestrations.find(w => w.uuid === formData.orchestrationWorkflow)
    const serviceIdArr = selectedWorkflow.services.map(s => s['uuid'])
    const appId = formData.applicationId
    const selectedApp = this.filterAppById(appId)
    const selectedEnv = this.getSelectedEnv(formData.environment)
    const fetchArr = [
      this.getArtifactStreams(appId, serviceIdArr),
      this.getArtifacts(appId, envId, selectedEnv, serviceIdArr, buildNumber)
    ]
    return Promise.all(fetchArr).then(response => {
      return this.setUiWidget(selectedApp)
    })
  }

  setUiWidget = selectedApp => {
    let serviceList = selectedApp && selectedApp.hasOwnProperty('services') ? selectedApp.services : []
    const formData = Utils.clone(this.state.formData)
    serviceList = formData ? this.filterWorkflow(formData.orchestrationWorkflow) : serviceList

    const groupedArtifactsObj = ServiceArtifactSelect.groupArtifactBuildsByService(
      serviceList,
      this.artifacts,
      this.artifactStreamData
    )
    return groupedArtifactsObj
  }

  setServiceArtifactWidget = (selectedApp, serviceId) => {}

  onSubmit = ({ formData }) => {
    const isEditing = this.props.data ? true : false
    formData.artifacts = []
    if (formData.artifactSelect) {
      formData.artifacts = Utils.mapToUuidArray(formData.artifactSelect.split(','))
    }

    // TODO: get from 'is required' endpoint
    formData.executionCredential.executionType = 'SSH'
    if (this.isTemplateWorkflow) {
      this.modifyFormDataForTemplateWorkflowToUseEnvFromTemplateExpression(formData)
    }
    Utils.request(this, this.props.onSubmit(formData, isEditing)).catch(error => this.setState({ error: 'EXEC_ERROR' }))
  }
  modifyFormDataForTemplateWorkflowToUseEnvFromTemplateExpression = formData => {
    const workflowVariables = formData.workflowVariables
    const variable = this.filterWorkflowVariableByEntityType(entityTypes.envEntity)
    if (variable && variable.length > 0) {
      formData.environment = workflowVariables[variable[0].name]
    }
  }
  validate = (formData, errors) => {
    const requiredArr = this.state.formSchema.required
    const uiSchema = this.state.formUiSchema
    if (
      requiredArr.indexOf('artifactSelect') >= 0 &&
      (!formData.artifactSelect || formData.artifactSelect.length <= 0)
    ) {
      if (uiSchema.artifactSelect['ui:widget'] === 'hidden' && formData.orchestrationWorkflow) {
        this.setState({ error: 'NOMETADATA_ERROR' })
      }
      errors.artifactSelect.addError('Please select one or more Artifacts')
    }
    if (
      requiredArr.indexOf('executionCredential') >= 0 &&
      (formData.executionCredential.sshUser.length <= 0 || formData.executionCredential.sshPassword.length <= 0)
    ) {
      errors.executionCredential.sshUser.addError('Please enter username')
      errors.executionCredential.sshPassword.addError('Please enter password')
    }
    return errors
  }

  isValidWorkflow = uuid => {
    const selectedWorkflow = this.orchestrations.find(wf => wf.uuid === uuid)
    return selectedWorkflow ? selectedWorkflow.orchestrationWorkflow.valid : false
  }

  onError = errors => {
    const formGroupEl = Utils.queryRef(this.refs.form, '.form-group')
    formGroupEl.className = formGroupEl.className.replace(/has\-error/g, '')
  }
  hideModal = () => {
    this.setState({
      initialized: false,
      formSchema: schema,
      formUiSchema: uiSchema,
      formData: {},
      workflowVariablesFor: ''
    })
    this.props.onHide()
  }

  render () {
    return (
      <WingsModal
        className={css.main}
        show={this.props.show}
        submitting={this.state.submitting}
        onHide={this.hideModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>Execute Workflow</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <WingsForm
            name="Execute Workflow"
            ref="form"
            key={this.state.key}
            schema={this.state.formSchema}
            uiSchema={this.state.formUiSchema}
            formData={this.state.formData}
            onChange={this.onChange}
            onSubmit={this.onSubmit}
            validate={this.validate}
            showErrorList={false}
            onError={this.onError}
          >
            <Button
              className="submit-button"
              type="submit"
              bsStyle="info"
              disabled={this.state.submitting || !this.state.formReady}
            >
              Submit
            </Button>
          </WingsForm>
        </Modal.Body>

        {this.state.error === 'INVALID_WORKFLOW' && (
          <div className="modal-error">The selected Workflow is invalid or incomplete.</div>
        )}
        {this.state.error === 'EXEC_ERROR' && (
          <div data-name="modal-error" className="modal-error">
            Error when executing the workflow.
          </div>
        )}
        {this.state.error === 'NOMETADATA_ERROR' && (
          <div className="modal-error">Selected Workflow is incomplete as there are no Artifacts </div>
        )}
      </WingsModal>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/ExecutionModal/ExecutionModal.js