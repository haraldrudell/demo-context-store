import React from 'react'
import {
  WingsDynamicForm,
  TemplateUtils,
  ServiceArtifactSelect,
  CompUtils,
  FormUtils,
  Utils,
  NestedFormTemplate
} from 'components'

// import { Button } from 'react-bootstrap'
import css from './DeploymentSubForm.css'
import { ArtifactService, InfrasService } from 'services'
let fieldOrder = []

export default class DeploymentSubForm extends React.Component {
  workflowVariablesFieldGroups = []
  executedServiceIds = []

  widgets = {
    headerWidget: props => {
      return (
        <div className={css.workflowVariableHeader}>
          <span className={css.varCol}> Variable Name</span>
          <span className={css.varCol}> Entity Type</span>
          <span className={css.valueCol}> Value</span>
        </div>
      )
    },

    variableWidget: props => {
      const entityType = props.schema.entityType
      const required = props.required
      return (
        <div className={css.workflowVariable}>
          <span className={css.varCol}>
            {props.label} {required ? '*' : ' '}
          </span>
          <span className={css.varCol}>{entityType && TemplateUtils.entityTypeTitles[entityType]}</span>
          <span className={css.valueField}>{this.renderWorkflowVariableInputField(props)}</span>
        </div>
      )
    },

    serviceArtifactSelection: props => {
      const form = props.formContext
      const fieldData = form.getFieldData('artifactSelect')
      const groupedServiceArtifactStreams = fieldData
      const data = form ? form.buffer.formData : {}
      const selectedArtifacts = this.props.isEditing ? data.artifactSelect.split(',') : []

      if (fieldData && fieldData.serviceNames.length > 0) {
        return (
          /*
            These props are input to the component
            services -> list of services for which you want to see the artifacts listed
            artifacts ->
          */
          <ServiceArtifactSelect
            groupedServiceArtifactStreams={groupedServiceArtifactStreams}
            selectedArtifacts={selectedArtifacts}
            setArtifactsOnFormData={this.setArtifactsOnFormData}
            filterArtifactSelectByBuildNumber={this.filterArtifactSelectByBuildNumber}
          />
        )
      } else {
        return <div />
      }
    }
  }

  nonTemplatizedServiceIds = []
  state = {
    schema: {},
    uiSchema: {},
    formData: {},
    widgets: this.widgets,
    subFormInitialised: false,
    fieldOrder: [],
    initialized: false
  }

  setComponentState = async state => {
    await CompUtils.setComponentState(this, state)
  }

  updateWorkflowDetails = async () => {
    this.selectedWorkflowServices = this.props.selectedWorkflow.services
    this.selectedWorkflowServiceIds = this.selectedWorkflowServices.map(service => service.uuid)
    this.selectedEnvironment = this.props.selectedWorkflow.envId
    const { userVariables } = this.props.selectedWorkflow.orchestrationWorkflow

    this.workflowVariables = userVariables
    this.getWorkflowVariableEntities()
    this.artifacts = []
    this.artifactStreamData = []

    this.isTemplatized = this.props.selectedWorkflow.templatized

    this.getSubFormFields()
  }

  filterArtifactSelectByBuildNumber = async (buildNumber, serviceId) => {
    const response = await this.filterBuildsForService(buildNumber, serviceId)
    const form = this.form
    const schema = this.form.buffer.schema
    const artifactSelectProp = schema.properties['artifactSelect']
    FormUtils.setEnumData(artifactSelectProp, response)
    //  FormUtils.setEnumAndNames(artifactSelectProp, this.artifacts, 'uuid', 'displayName')
    this.form.buffer.schema = schema
    form.showFields(['artifactSelect'])
    await form.updateChanges()
    return response
  }

  getWorkflowVariableEntities = async () => {
    this.serviceVariables = TemplateUtils.filterWorkflowVariables(
      this.workflowVariables,
      TemplateUtils.entityTypes.service,
      'metadata',
      'entityType'
    )
    this.envVariables = TemplateUtils.filterWorkflowVariables(
      this.workflowVariables,
      TemplateUtils.entityTypes.environment,
      'metadata',
      'entityType'
    )
    this.templatizedServiceIds = this.props.selectedWorkflow.templatizedServiceIds
    this.nonTemplatizedServiceIds = this.getNonTemplatizedServiceId()
  }

  getNonTemplatizedServiceId = () => {
    const workflowServices = this.selectedWorkflowServiceIds
    const templatizedServiceIds = this.templatizedServiceIds
    return workflowServices.filter(item => !templatizedServiceIds.includes(item))
  }

  getSubFormFields = () => {
    const { requiredEntityTypes } = this.props.selectedWorkflow.orchestrationWorkflow
    const subFormFields = []

    if (this.workflowVariables && this.workflowVariables.length > 0) {
      subFormFields.push('workflowVariables')
    }
    if (Utils.checkAritfactExistenceOnRequiredEntities(requiredEntityTypes)) {
      subFormFields.push('artifactSelect')
    }
    if (Utils.checkSSHUserExistenceOnRequiredEntities(requiredEntityTypes)) {
      subFormFields.push('executionCredential')
    }

    this.subFormFields = subFormFields
  }

  getFormDataForEditing = () => {
    const data = {}
    if (!this.props.showOnlyWorkflowVariables) {
      const artifacts = this.props.data.artifacts

      data.artifactSelect = artifacts && artifacts.length > 0 ? artifacts.join(',') : ''
      data.executionCredential = this.props.data.executionCredential ? this.props.data.executionCredential : {}
    }
    data.workflowVariables = this.props.data.workflowVariables ? this.props.data.workflowVariables : {}

    return data
  }

  modifyDataForRerun = () => {
    const data = this.getFormDataForEditing()
    if (this.props.isEditing) {
      const formData = WingsDynamicForm.toFormData({ data }) || {}

      if (this.envVariables.length > 0) {
        const envVariableName = this.envVariables[0].name
        this.templateEnvironmentId = data.workflowVariables[envVariableName]
      }
      if (this.serviceVariables.length > 0) {
        const serviceIds = this.getServiceIdsFromServiceVariables(data)
        this.executedServiceIds = serviceIds
      }

      return formData
    } else {
      return data
    }
  }

  filterWorkflowServiceIds = data => {}

  getInfraMappings = async () => {
    let infraMappings = []

    if (this.serviceVariables.length === 0 && this.envVariables.length === 0) {
      infraMappings = await this.fetchInfraMappings(this.selectedEnvironment, this.selectedWorkflowServiceIds)
    } else if (this.serviceVariables.length === 0 && this.envVariables.length > 0) {
      infraMappings = await this.fetchInfraMappings(this.templateEnvironmentId, this.selectedWorkflowServiceIds)
    }

    return infraMappings
  }

  /* If workflow template has detemplatized one of them
  pipeline stage does not reflect with the same
  so manipulating/correcting data checkign both of htem
*/
  updateWorkflowVariablesForPipelines = formData => {
    const { showOnlyWorkflowVariables } = this.props
    const workflowVariables = this.workflowVariables

    const stageVariables = formData.workflowVariables

    if (showOnlyWorkflowVariables) {
      Object.keys(stageVariables).map(variable => {
        const filterVariable = workflowVariables.find(item => item.name === variable)
        if (!filterVariable) {
          delete stageVariables[variable]
        }
      })
    }
  }

  componentWillMount = async () => {
    this.workflowVariablesFieldGroups = []

    this.updateWorkflowDetails()
    const formData = this.modifyDataForRerun()
    const infraMappings = await this.getInfraMappings()

    const { schema, uiSchema } = this.createSchemaWithSubFormFields(formData, infraMappings)
    this.updateWorkflowVariablesForPipelines(formData)

    await this.setComponentState({
      initialized: true,
      fieldOrder,
      schema,
      uiSchema,
      formData,
      widgets: this.widgets
    })
  }

  componentWillUnmount () {
    fieldOrder = []
  }

  componentWillReceiveProps (newProps) {}

  createSchemaWithSubFormFields = (formData, infraMappings) => {
    const { showOnlyWorkflowVariables } = this.props
    const schema = {
      type: 'object',
      addExpand: false,
      properties: {},
      required: []
    }
    const uiSchema = {}

    const subFormFields = this.subFormFields
    if (subFormFields.includes('workflowVariables')) {
      this.createSchemaWithWorkflowVariables(schema, uiSchema, formData, infraMappings)
    }

    if (subFormFields.includes('artifactSelect') && !showOnlyWorkflowVariables) {
      fieldOrder.push('artifactSelect')
      this.addArtifactSelectToSchema(schema)
      this.addArtifactSelectToUiSchema(uiSchema)
    }

    if (subFormFields.includes('executionCredential') && !showOnlyWorkflowVariables) {
      //   fieldOrder.push('executionCredential')
      this.addExecCredentialToSchema(schema)
      this.addExecCredentialToUiSchema(uiSchema)
    }

    return { schema, uiSchema }
  }

  addArtifactSelectToSchema = async schema => {
    schema.required.push('artifactSelect')
    schema.properties.artifactSelect = {
      type: 'string',
      title: 'Artifacts',
      'custom:dataProvider': 'fetchArtifacts'
    }
    this.addArtifactSelectToDataProviders(schema)
  }

  addArtifactSelectToDataProviders = async schema => {
    schema.dataProviders = {
      fetchArtifacts: async ({ formData, formProps, buildNumber = null }) => {
        const subFormFields = this.subFormFields
        if (subFormFields.indexOf('artifactSelect') > -1) {
          return await this.fetchArtifacts()
        } else {
          return []
        }
      }
    }
  }

  filterTemplatizedServiceIds = templatizedServiceIds => {
    const workflowServiceIds = this.selectedWorkflowServiceIds
    const wrkFlowServiceSet = new Set(workflowServiceIds)
    const templatizedServiceSet = new Set(templatizedServiceIds)
    const intersection = new Set([...wrkFlowServiceSet].filter(x => templatizedServiceSet.has(x)))
    return Array.from(intersection)
  }

  getWorkflowDetails = () => {
    const { templatizedServiceIds } = this.props.selectedWorkflow
    this.selectedWorkflowServices = this.props.selectedWorkflow.services
    this.selectedWorkflowServiceIds = this.selectedWorkflowServices.map(service => service.uuid)
    this.templatized = this.props.selectedWorkflow.templatized

    if (this.templatized && templatizedServiceIds) {
      this.selectedWorkflowServiceIds = this.filterTemplatizedServiceIds(templatizedServiceIds)
    }

    this.selectedEnvironment = this.props.selectedWorkflow.envId
    // formData.environment = this.selectedEnvironment
    const { userVariables } = this.props.selectedWorkflow.orchestrationWorkflow
    this.workflowVariables = userVariables
    this.artifacts = []
    this.artifactStreamData = []
  }

  getEnvandServiceIds = () => {
    const { isEditing } = this.props
    let envId = this.selectedEnvironment
    let serviceIdArr = this.selectedWorkflowServiceIds

    if (isEditing) {
      if (this.isTemplatized && this.envVariables && this.envVariables.length > 0) {
        envId = this.templateEnvironmentId
      }

      if (this.isTemplatized && this.serviceVariables.length > 0) {
        serviceIdArr = this.executedServiceIds
      }
    } else if (this.isTemplatized && this.nonTemplatizedServiceIds && this.nonTemplatizedServiceIds.length > 0) {
      serviceIdArr = this.nonTemplatizedServiceIds
    }

    return { envId, serviceIdArr }
  }

  getServiceIdsFromServiceVariables = data => {
    if (data) {
      const workflowVariables = data.workflowVariables
      const serviceExpressions = this.serviceVariables.map(variable => variable.name)
      const serviceIds = []

      for (const expr of serviceExpressions) {
        if (workflowVariables[expr]) {
          serviceIds.push(workflowVariables[expr])
        }
      }
      return serviceIds
    }
  }

  fetchArtifacts = async (buildNumber = null) => {
    const { envId, serviceIdArr } = this.getEnvandServiceIds()
    const groupedArtifactsObj = await this.fetchArtifactsForWorkflow(envId, serviceIdArr, buildNumber)
    this.props.setLoading(false)
    return groupedArtifactsObj /* ,
      transformedData: this.artifacts*/
  }

  filterBuildsForService = async (buildNumber, serviceId) => {
    const { envId, serviceIdArr } = this.getEnvandServiceIds()
    const groupedArtifactsObj = await this.fetchArtifactsForWorkflow(envId, [serviceId], buildNumber, serviceIdArr)
    return groupedArtifactsObj
  }

  fetchArtifactsForWorkflow = async (envId, serviceIds, buildNumber = null, allServices = null) => {
    const applicationId = this.props.selectedApp.uuid

    const artifactRequest = ArtifactService.fetchArtifacts(applicationId, envId, serviceIds, buildNumber)

    const artifactStreamRequest = ArtifactService.fetchArtifactStreamsByServiceIds(applicationId, serviceIds)
    const [artifactResult, artifactStreamResult] = await Promise.all([artifactRequest, artifactStreamRequest])

    this.artifacts = artifactResult.artifacts
    this.artifactStreamData = artifactStreamResult.artifactStreams

    const selectedServices = this.filterServicesByIds(serviceIds)
    const groupedArtifactsObj = ServiceArtifactSelect.groupArtifactBuildsByService(
      selectedServices,
      this.artifacts,
      this.artifactStreamData
    )
    return groupedArtifactsObj
  }

  filterServicesByIds = serviceIds => {
    const selectedAppServices = this.props.selectedApp.services
    const serviceList = []

    for (const serviceId of serviceIds) {
      const serviceObj = selectedAppServices.find(service => service.uuid === serviceId)
      serviceList.push(serviceObj)
    }

    return serviceList
  }

  getUiWidgetForArtifactSelect = () => {
    const { selectedWorkflow, isEditing } = this.props
    const isTemplatized = selectedWorkflow.templatized
    const serviceVariables = this.serviceVariables
    const serviceArtifactComponent = 'serviceArtifactSelection'

    if (isTemplatized && !isEditing) {
      if (serviceVariables && serviceVariables.length === 0) {
        return serviceArtifactComponent
      } else if (this.nonTemplatizedServiceIds.length > 0) {
        return serviceArtifactComponent
      } else if (serviceVariables.length > 0) {
        return 'hidden'
      }
    } else {
      return serviceArtifactComponent
    }
  }

  addArtifactSelectToUiSchema = uiSchema => {
    uiSchema.artifactSelect = {
      'ui:placeholder': 'Select Artifacts',
      'ui:widget': this.getUiWidgetForArtifactSelect(),
      'custom:widget': 'serviceArtifactSelection'
    }
  }

  addExecCredentialToSchema = schema => {
    //   this.subFormFieldOrder.push('executionCredential')
    schema.required.push('executionCredential')
    schema.properties.executionCredential = {
      type: 'object',
      title: 'Host\'s Credentials',
      properties: {
        sshUser: {
          type: 'string',
          title: 'SSH User',
          default: '',
          description: ''
        },
        sshPassword: {
          type: 'string',
          title: 'SSH Password',
          default: '',
          description: ''
        }
      }
    }
  }

  addExecCredentialToUiSchema = uiSchema => {
    uiSchema['executionCredential'] = {
      sshUser: { classNames: css.sshUser },
      sshPassword: {
        'ui:widget': 'password',
        classNames: css.sshPassword
      },
      classNames: css.executionCredential
    }
  }

  componentWillReceiveProps (newProps) {}

  onChangeOfWorkflowVariable = async (property, value) => {
    const form = this.form
    const workflowVariables = this.workflowVariables
    const data = this.form.buffer.formData // FormUtils.clone(this.state.formData)

    const filteredVariables = TemplateUtils.filterWorkflowVariables(workflowVariables, property, 'name')

    const variable = filteredVariables[0]
    if (!data.workflowVariables) {
      data.workflowVariables = {}
    }
    if (!data.workflowVariables[property]) {
      data.workflowVariables[property] = {}
    }
    if (data.workflowVariables[property] !== value) {
      data.workflowVariables[property] = value

      if (variable.metadata.entityType === TemplateUtils.entityTypes.environment) {
        this.onChangeOfEnvironmentVariable(variable, value, data)
      } else if (variable.metadata.entityType === TemplateUtils.entityTypes.service) {
        this.onChangeOfServiceVariables(variable, form, data)
        if (!this.props.showOnlyWorkflowVariables && this.subFormFields.indexOf('artifactSelect') > -1) {
          this.updateArtifactComponent(data)
        }
      } else {
        await this.form.updateChanges()
      }
    }

    if (this.props.showOnlyWorkflowVariables) {
      this.props.updateFormData({ formData: data })
    }
  }

  onChangeOfEnvironmentVariable = async (variable, value, data) => {
    const infraMappingVariables = TemplateUtils.filterWorkflowVariables(
      this.workflowVariables,
      TemplateUtils.entityTypes.infraMapping,
      'metadata',
      'entityType'
    )
    this.selectedEnvironment = value

    let infraMappings = []

    if (this.serviceVariables && this.serviceVariables.length === 0) {
      infraMappings = await this.fetchInfraMappings(value, this.selectedWorkflowServiceIds)
    } else if (this.serviceVariables.length > 0) {
      const serviceVariableNames = this.serviceVariables.map(variable => variable.name)
      const serviceIds = serviceVariableNames.map(variable => data['workflowVariables'][variable])

      if (serviceIds.length > 0) {
        infraMappings = await this.fetchInfraMappings(value, serviceIds)
      }
    }

    await this.updateInfraMappingsOnSchema(infraMappings, this.serviceVariables, infraMappingVariables)
  }

  onChangeOfServiceVariables = async (variable, form, data) => {
    if (!this.props.showOnlyWorkflowVariables && this.subFormFields.includes('artifactSelect')) {
      form.hideFields(['artifactSelect'])
    }

    const workflowVariableGroups = this.workflowVariablesFieldGroups
    for (const group of workflowVariableGroups) {
      await form.autoProcessSubfieldChange('workflowVariables', group, data.workflowVariables)
    }

    form.buffer.formData['workflowVariables'][variable.metadata.relatedField] = ''
    await form.updateChanges()
  }

  updateArtifactComponent = async data => {
    const form = this.form
    // const uiSchema = this.form.buffer.uiSchema
    const schema = this.form.buffer.schema
    const artifactSelectProp = schema.properties['artifactSelect']
    const serviceIds = this.getServiceIdsFromServiceVariables(data)
    const groupedArtifactsObj = await this.fetchArtifactsForWorkflow(this.selectedEnvironment, serviceIds)

    FormUtils.setEnumData(artifactSelectProp, groupedArtifactsObj)
    this.form.buffer.schema = schema
    form.showFields(['artifactSelect'])
    await form.updateChanges()

    // uiSchema['artifactSelect']['ui:widget'] = 'serviceArtifactSelection'
  }

  getServiceIdsFromServiceVariables = data => {
    const serviceVariableNames = this.serviceVariables.map(variable => variable.name)

    const serviceIds = []
    serviceVariableNames.forEach(variable => {
      if (data.workflowVariables[variable]) {
        serviceIds.push(data.workflowVariables[variable])
      }
    })

    if (this.nonTemplatizedServiceIds.length > 0) {
      serviceIds.push(...this.nonTemplatizedServiceIds)
    }
    return serviceIds
  }

  renderWorkflowVariableInputField = props => {
    const form = props.formContext
    const formData = form.buffer.formData
    const selValue =
      formData && formData.workflowVariables[props.label] ? formData['workflowVariables'][props.label] : props.value

    if (props.schema.enum && props.schema.enumNames) {
      return this.renderWorkflowDropDown(props, selValue)
    } else {
      return this.renderWorkflowInput(props, selValue)
    }
  }

  renderWorkflowDropDown = (props, selValue) => {
    return (
      <select
        className="form-control"
        required={props.required}
        ref={props.ref}
        id={props.id}
        onChange={event => this.onChangeOfWorkflowVariable(props.label, event.target.value)}
        value={selValue}
      >
        <option />
        {props.schema.enum.map((item, index) => {
          return <option value={item}>{props.schema.enumNames[index]}</option>
        })}
      </select>
    )
  }

  renderWorkflowInput = (props, selValue) => {
    return (
      <input
        className="form-control"
        type="text"
        value={selValue}
        required={props.required}
        ref={props.ref}
        id={props.id}
        onChange={event => this.onChangeOfWorkflowVariable(props.label, event.target.value)}
      />
    )
  }

  stopPropogation = event => {
    event.nativeEvent.stopImmediatePropagation()
    return false
  }

  setArtifactsOnFormData = selectedArtifactStreams => {
    const formData = this.form.buffer.formData
    formData.artifactSelect = selectedArtifactStreams
    this.onChange({ formData })
  }

  createSchemaWithWorkflowVariables = (schema, uiSchema, data, infraMappings) => {
    schema.properties['workflowVariables'] = {
      type: 'object',
      title: 'Workflow Variables',
      addExpand: true,
      properties: {}
    }
    uiSchema['workflowVariables'] = {}

    const workflowVariableSchema = schema.properties.workflowVariables
    workflowVariableSchema.required = []
    const workflowVariableUiSchema = uiSchema.workflowVariables
    const workflowVariables = this.workflowVariables
    const count = 0

    workflowVariables.forEach(v => {
      // fieldOrder.push(v.name)
      if (count === 0) {
        workflowVariableSchema.properties['header'] = { type: 'string' }
        workflowVariableUiSchema['header'] = {
          'ui:widget': 'headerWidget',
          'custom:widget': 'headerWidget'
        }
      }

      if (v.metadata && v.metadata.entityType) {
        const resultObj = this.getEntityEnums(v.metadata, infraMappings)

        workflowVariableSchema.properties[v.name] = {
          type: 'string',
          entityType: v.metadata.entityType,
          enum: resultObj.enum,
          enumNames: resultObj.enumNames,
          data: this.props.isEditing ? data['workflowVariables'][v.name] : v.value
        }

        if (v.metadata.entityType === TemplateUtils.entityTypes.infraMapping) {
          workflowVariableSchema.properties[v.name]['custom:dataProvider'] = `fetchInfraMappings${v.name}`
        }

        if (v.metadata.relatedField) {
          this.workflowVariablesFieldGroups.push([v.name, v.metadata.relatedField])
          this.addDataProviderToWorkflowVariables(v.name, v.metadata.relatedField, workflowVariableSchema)
        }
      } else {
        workflowVariableSchema.properties[v.name] = {
          type: 'string',
          default: v.value
        }
      }

      if (v.mandatory) {
        workflowVariableSchema.required.push(v.name)
      }

      workflowVariableUiSchema[v.name] = {
        'ui:widget': 'variableWidget',
        classNames: css.workflowField,
        'custom:widget': 'variableWidget'
      }
    })
  }

  addDataProviderToWorkflowVariables = (field, relatedField, workflowVariableSchema) => {
    if (!workflowVariableSchema.dataProviders) {
      workflowVariableSchema.dataProviders = {}
    }

    const key = 'fetchInfraMappings' + relatedField

    workflowVariableSchema.dataProviders[key] = async ({ formData, formProps }) => {
      const workflowVariables = this.workflowVariables

      const envVariables = TemplateUtils.filterWorkflowVariables(
        workflowVariables,
        TemplateUtils.entityTypes.environment,
        'metadata',
        'entityType'
      )
      const { envId } =
        envVariables.length === 0 ? this.props.selectedWorkflow : { envId: formData[envVariables[0].name] }

      const serviceId = formData[field]
      const infraMappings = await this.fetchInfraMappings(envId, [serviceId])

      return {
        data: infraMappings,
        transformedData:
          infraMappings && infraMappings.length > 0
            ? infraMappings.map(infra => ({ name: infra.name, uuid: infra.uuid }))
            : [{ name: 'No Service Infrastructure available', uuid: null }]
      }
      // this.fetchInfraMappings(envId)
    }
  }

  updateInfraMappingsOnSchema = async (infraMappings, serviceVariables, infraMappingVariables) => {
    const schema = this.form.buffer.schema

    for (const infraMappingVariable of infraMappingVariables) {
      const infraMappingProperty = schema.properties.workflowVariables.properties[infraMappingVariable.name]
      FormUtils.setEnumAndNames(infraMappingProperty, infraMappings, 'uuid', 'name')
    }

    await this.form.updateChanges()
    // await this.setComponentState(schema)
  }

  fetchInfraMappings = async (envId, serviceIdArr) => {
    const applicationId = this.props.selectedApp.uuid
    const { infraMappings } = await InfrasService.getInfraMappingsForApplication(applicationId, envId, serviceIdArr)
    const filteredMappings = this.filterInfraMappingsByServiceId(infraMappings, serviceIdArr)
    return filteredMappings
  }

  filterInfraMappingsByServiceId = (infraMappings, serviceIdArr) => {
    const filteredMappings = []

    for (const serviceId of serviceIdArr) {
      const filteredInfraMappings = infraMappings.filter(mapping => mapping.serviceId === serviceId)
      const workflowPhases = this.props.selectedWorkflow
        ? this.props.selectedWorkflow.orchestrationWorkflow.workflowPhases
        : []
      const filteredPhaseByServiceId = workflowPhases.find(phase => phase.serviceId === serviceId)

      if (filteredPhaseByServiceId) {
        const filteredPhaseDepType = filteredPhaseByServiceId.deploymentType
        const infraMappingsFilterByDepType = filteredInfraMappings.filter(
          mapping => mapping.deploymentType === filteredPhaseDepType
        )
        filteredMappings.push(...infraMappingsFilterByDepType)
      } else {
        filteredMappings.push(...filteredInfraMappings)
      }
    }

    return filteredMappings
  }

  updateFieldOrder = variable => {
    if (variable.metadata.relatedField) {
      fieldOrder.push(variable.name)
      fieldOrder.push(variable.metadata.relatedField1)
    }
  }

  getEntityEnums = (variableMetaData, defaultInfraMappings) => {
    const { entityType, artifactType } = variableMetaData

    if (entityType === TemplateUtils.entityTypes.environment) {
      return this.getEnvironmentEnityEnums()
    } else if (entityType === TemplateUtils.entityTypes.service) {
      return this.getServiceEntityEnums(artifactType)
    } else if (entityType === TemplateUtils.entityTypes.infraMapping) {
      if (defaultInfraMappings.length === 0) {
        return { enum: [], enumNames: [] }
      } else {
        return {
          enum: defaultInfraMappings.map(mapping => mapping.uuid),
          enumNames: defaultInfraMappings.map(mapping => mapping.name)
        }
      }
    }
  }

  getInfraEntityEnums = async (envId, serviceIdArr) => {
    const infraMappings = await this.fetchInfraMappings(envId, serviceIdArr)

    return {
      data: infraMappings,
      transformedData:
        infraMappings && infraMappings.length > 0
          ? infraMappings.map(infra => ({ name: infra.name, uuid: infra.uuid }))
          : [{ name: 'No InfraMappings are available', uuid: null }]
    }
  }

  getEnvironmentEnityEnums = () => {
    const environmentList = this.props.selectedApp.environments

    return {
      enum: environmentList.map(env => env.uuid),
      enumNames: environmentList.map(env => env.name)
    }
  }

  getServiceEntityEnums = artifactType => {
    const serviceList = this.props.selectedApp.services || []
    const filteredServices = this.filterServiceByArtifactType(serviceList, artifactType)

    return {
      enum: filteredServices.map(service => service.uuid),
      enumNames: filteredServices.map(service => service.name)
    }
  }

  filterServiceByArtifactType = (serviceList, artifactType, filterBy) => {
    let filteredServices = []

    if (artifactType) {
      filteredServices = serviceList.filter(service => service.artifactType === artifactType)
    }
    if (filterBy) {
      return filteredServices.map(service => service[filterBy])
    }

    return filteredServices
  }

  onInitializeForm = async form => {
    await form.autoProcessInitialize(this.state.fieldOrder)
    if (this.subFormFields.indexOf('workflowVariables') > -1 && this.props.isEditing) {
      const workflowVariableGroups = this.workflowVariablesFieldGroups

      for (const group of workflowVariableGroups) {
        await form.autoProcessSubfieldInitialize('workflowVariables', group, form.buffer.formData.workflowVariables)
      }
    }
  }

  onChange = async ({ formData }) => {
    const context = this.form
    await context.updateChanges()
  }

  // ToDO -> Should find out way to validate the form
  onSubmit = ({ formData }) => {
    if (this.envVariables && this.envVariables.length > 0 && this.isTemplatized) {
      const envEntityName = this.envVariables[0].name
      formData['environment'] = formData.workflowVariables[envEntityName]
    }
    this.props.updateFormData({ formData })
    if (this.validateFormCallback) {
      this.validateFormCallback(true)
    }
  }

  validateFormCallback = null

  validateForm = ({ formData }, callback) => {
    this.validateFormCallback = callback

    this.submit({ formData })
  }

  validate = (formData, errors) => {
    const schema = this.state.schema
    const requiredArr = schema.required

    if (requiredArr.indexOf('artifactSelect') >= 0) {
      if (!formData.artifactSelect) {
        errors.artifactSelect.addError('Please select one or more Artifacts')
      }
    }

    if (
      requiredArr.indexOf('executionCredential') >= 0 &&
      (!formData.executionCredential ||
        !formData.executionCredential.sshUser ||
        !formData.executionCredential.sshPassword)
    ) {
      errors.executionCredential.sshUser.addError('Please enter username')
      errors.executionCredential.sshPassword.addError('Please enter password')
    }

    return errors
  }

  onError = () => {
    if (this.validateFormCallback) {
      this.validateFormCallback(false)
    }
  }

  componentWillUnmount () {}

  render () {
    if (!this.state.initialized) {
      return null
    }
    const subFormCls = this.props.resetSubForm ? css.hide : css.main
    return (
      <div className={subFormCls}>
        <WingsDynamicForm
          name="DeploymentSubForm"
          ref={subForm => (this.form = subForm)}
          onInitializeForm={this.onInitializeForm}
          schema={this.state.schema}
          uiSchema={this.state.uiSchema}
          formData={this.state.formData}
          widgets={this.state.widgets}
          onChange={this.onChange}
          onSubmit={this.onSubmit}
          validate={this.validate}
          onError={this.onError}
          FieldTemplate={NestedFormTemplate}
        >
          <button className="hidden" type="submit" ref={submit => (this.submit = () => submit.click())} />
        </WingsDynamicForm>
      </div>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/ExecutionModal/DeploymentSubForm.js