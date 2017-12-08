import React from 'react'
import { Modal } from 'react-bootstrap'
import { WingsModal, WingsForm, Utils, CompUtils, FormUtils, TemplateUtils, CustomFieldTemplate } from 'components'
import InfraStructureMappingModal from '../ServiceTemplatePage/InfraStructureMappingModal'
import apis from 'apis/apis'
import css from './NewWorkflowModal.css'

const dependencyMap = {
  serviceId: 'infraMappingId'
}

const log = type => {} // console.log.bind(console, type)
const templatizeFields = ['serviceId', 'infraMappingId', 'envId']

const baseSchema = {
  type: 'object',
  required: ['name', 'envId'],
  properties: {
    uuid: { type: 'string', title: 'uuid', default: '' },
    name: { type: 'string', title: 'Name' },
    description: { type: 'string', title: 'Description', default: '' },
    orchestrationWorkflow: {
      type: 'object',
      title: '',
      properties: {
        orchestrationWorkflowType: {
          type: 'string',
          title: 'Workflow Type',
          default: 'BASIC',
          enum: ['BASIC', 'MULTI_SERVICE', 'CANARY', 'BUILD', 'BLUEGREEN', 'ROLLING', 'CUSTOM'],
          enumNames: [
            'Basic Deployment',
            'Multi-Service Deployment',
            'Canary Deployment',
            'Build Workflow',
            'Blue/Green Deployment (Coming Soon)',
            'Rolling Upgrade (Coming Soon)',
            'Custom Workflow (Coming Soon)'
          ]
        }
      }
    },
    envId: {
      type: 'string',
      title: 'Environment',
      enum: [],
      enumNames: []
    },
    serviceId: {
      type: 'string',
      title: 'Service',
      enum: [],
      enumNames: []
    },
    infraMappingId: {
      type: 'string',
      title: 'Service Infrastructure',
      enum: [],
      enumNames: []
    }
  }
}

const baseUiSchema = {
  uuid: { 'ui:widget': 'hidden' }
}

export default class NewWorkflowModal extends React.Component {
  static contextTypes = Utils.getDefaultContextTypes()
  state = {
    key: Math.random() * 999999,
    showInfraModal: false,
    infraStencils: [],
    schema: baseSchema,
    uiSchema: baseUiSchema
  }
  appIdFromUrl = this.props.appId
  envId = Utils.envIdFromUrl()
  selectedServiceArtifact
  isEdit = false
  initialised = false

  componentWillMount () {
    Utils.loadCatalogsToState(this)
  }

  async componentWillReceiveProps (newProps) {
    if (newProps.show && !this.initialised) {
      this.initialised = true
      const schema = FormUtils.clone(baseSchema)
      const uiSchema = FormUtils.clone(baseUiSchema)
      await CompUtils.setComponentState(this, { schema, uiSchema })

      this.appIdFromUrl = newProps.appId
      const isEditing = newProps.data && newProps.data.uuid
      this.isEdit = isEditing
      const formData = isEditing
        ? newProps.data
        : {
          orchestrationWorkflow: {
            orchestrationWorkflowType: 'BASIC'
          }
        }
      // when Editing Basic WF, re-populate ServiceId, InfraMappingId (from the first Phase):
      const workflowType = formData.orchestrationWorkflow.orchestrationWorkflowType
      if (isEditing && workflowType === 'BASIC') {
        formData.serviceId = formData.services && formData.services.length > 0 ? formData.services[0].uuid : ''
        const phase = formData.orchestrationWorkflow.workflowPhases[0]
        this.fetchInfraMappings(formData.envId, formData.serviceId, phase.infraMappingId)
        this.isEdit = true
      }

      this.updateForm({
        environments: newProps.environments,
        services: newProps.services,
        formData,
        orchestrationWorkflowType: workflowType
      })

      // const uiSchema = Utils.clone(baseUiSchema)
      uiSchema.orchestrationWorkflow = { 'ui:disabled': false }

      this.disableFields(uiSchema, newProps.data)
      this.setState({ uiSchema }, () => {
        // #TODO: Temporarily disable other Workflow Types
        const dropdownEl = Utils.queryRef(this.refs.form, '#root_orchestrationWorkflow_orchestrationWorkflowType')
        if (dropdownEl) {
          const options = dropdownEl.querySelectorAll('option')
          if (options && options.length > 1) {
            for (let i = 4; i < options.length; i++) {
              options[i].setAttribute('disabled', 'true')
            }
          }
        }
      })
    }
  }

  disableFields = (uiSchema, formData) => {
    const isEditing = formData && formData.uuid
    if (isEditing) {
      uiSchema.orchestrationWorkflow = { 'ui:disabled': true }
    } else {
      uiSchema.orchestrationWorkflow = { 'ui:disabled': false }
    }
  }

  updateSchemasByWorkflowType = ({ params, schema, uiSchema, formData }) => {
    if (params && (params.orchestrationWorkflowType || params.environments)) {
      delete formData.infraMappingId
      delete params.formData.infraMappingId
      const { templatized } = formData
      if (params.orchestrationWorkflowType === Utils.workflowTypes.BASIC) {
        if (!templatized) {
          FormUtils.showFields(baseUiSchema, uiSchema, ['envId', 'serviceId', 'infraMappingId'])
          FormUtils.setRequired(schema, ['envId', 'serviceId', 'infraMappingId'], true)
        }
      } else if (params.orchestrationWorkflowType === Utils.workflowTypes.BUILD) {
        FormUtils.hideFields(baseUiSchema, uiSchema, ['envId', 'serviceId', 'infraMappingId'])
        FormUtils.setRequired(schema, ['envId', 'serviceId', 'infraMappingId'], false)
      } else {
        FormUtils.hideFields(baseUiSchema, uiSchema, ['serviceId', 'infraMappingId'])
        FormUtils.setRequired(schema, ['serviceId', 'infraMappingId'], false)
      }
      // #TODO: disable un-supported workflow types
    }
  }

  updateForm = (params, setInfraMappingId) => {
    const formData = params.formData ? FormUtils.clone(params.formData) : this.state.formData || {}
    const schema = FormUtils.clone(this.state.schema)
    const uiSchema = FormUtils.clone(this.state.uiSchema)
    const isEditing = formData.uuid ? true : false
    const workflowType = formData.orchestrationWorkflow.orchestrationWorkflowType

    if (isEditing) {
      if (workflowType === Utils.workflowTypes.BUILD) {
        delete schema.properties['envId']
        delete schema.properties['serviceId']
        delete schema.properties['infraMappingId']
      } else if (workflowType === Utils.workflowTypes.CANARY) {
        delete schema.properties['serviceId']
        delete schema.properties['infraMappingId']
      }
    } else {
      schema.properties.serviceId = {
        type: 'string',
        title: 'Service',
        enum: [],
        enumNames: []
      }
      schema.properties.infraMappingId = {
        type: 'string',
        title: 'Service Infrastructure',
        enum: [],
        enumNames: []
      }
      schema.properties.serviceId.enum = this.props.services.map(item => item.uuid)
      schema.properties.serviceId.enumNames = this.props.services.map(item => item.name)
      // uiSchema.infraMappingId = {}
    }
    this.disableFields(uiSchema, formData)
    if (workflowType !== Utils.workflowTypes.BUILD) {
      if (params && params.environments) {
        schema.properties.envId.enum = params.environments.map(item => item.uuid)
        schema.properties.envId.enumNames = params.environments.map(item => item.name)
        // if (!formData.envId) {
        //   formData.envId = params.environments.length > 0 ? params.environments[0].uuid : null
        // }
      }
      if (schema.properties.serviceId && params && params.services) {
        schema.properties.serviceId.enum = params.services.map(item => item.uuid)
        schema.properties.serviceId.enumNames = params.services.map(item => item.name)
        // formData.serviceId = (params.services.length > 0 ? params.services[0].uuid : null)
      }

      if (params && params.infraMappings) {
        if (!schema.properties.infraMappingId) {
          schema.properties.infraMappingId = {}
        }
        schema.properties.infraMappingId.enum = [...params.infraMappings.map(item => item.uuid), 'NEW']
        schema.properties.infraMappingId.enumNames = [
          ...params.infraMappings.map(item => item.name),
          '+ New Service Infrastructure'
        ]
        if (!isEditing) {
          uiSchema.infraMappingId = {}
        }
      }
      if (setInfraMappingId) {
        formData.infraMappingId = setInfraMappingId
      }
    }
    if (!formData.description) {
      delete formData.description
    }

    this.updateSchemasByWorkflowType({ params, schema, uiSchema, formData })
    if (isEditing) {
      this.setTemplatizationOnSchema(formData, schema, uiSchema, params.orchestrationWorkflowType)
    }
    this.setState({ schema, uiSchema, formData, key: Math.random() * 999999 })
  }

  /*
    These methods are to set templatize options on schema
    storing on the schema -> so that it would be accessible on
    formData
  */
  setTemplatizationOnSchema = (formData, schema, uiSchema, workflowType) => {
    const defaultTitles = { infraMappingId: 'ServiceInfra' }
    const dependentFormData = this.getDependentFormData(formData)
    const userVariables = formData.orchestrationWorkflow.userVariables
    const artifactType = formData.services && formData.services.length > 0 ? formData.services[0].artifactType : ''
    const metadataObj = {
      entityTypeCatalogs: this.props.catalogs.FORM_FIELD_TO_ENTITY_TYPE,
      artifactType: artifactType,
      dependencyMap: dependencyMap
    }
    const workflowObj = {
      appId: this.appIdFromUrl,
      workflowId: formData.uuid,
      userVariables,
      metadataObj,
      workflowType
    }
    const dependentData = {
      dependencyMap,
      setDependency: true,
      dependentFormData
    }
    const customTemplatizeObj = {
      setTemplatizeOnFields: true,
      templateFields: templatizeFields
    }
    TemplateUtils.setTemplatization(
      formData,
      schema,
      uiSchema,
      workflowObj,
      dependentData,
      customTemplatizeObj,
      defaultTitles
    )
    TemplateUtils.checkAndModifyDuplicateUserVariable(
      schema,
      formData.orchestrationWorkflow.userVariables,
      this.props.catalogs.FORM_FIELD_TO_ENTITY_TYPE
    )
  }
  /*
  Special handling for Inframapping default field value
 */
  getDependentFormData = formData => {
    if (formData.orchestrationWorkflow) {
      const filteredPhaseByServiceId = Utils.filterWorkflowPhasesByServiceId(formData, formData.serviceId)
      if (filteredPhaseByServiceId) {
        const depType = filteredPhaseByServiceId.deploymentType
        const depCatalogText = this.getCatalogTextForInfra(depType)
        return { infraMappingId: depCatalogText }
      }
    }
  }

  /* Not to show Capitals for kubernetes and codedeploy on templatization */
  getCatalogTextForInfra = depType => {
    const catalogs = this.state.catalogs
    const depTypeCatalogs = catalogs.DEPLOYMENT_TYPE
    if (depTypeCatalogs) {
      const depCatalog = depTypeCatalogs.find(catalog => catalog.value === depType)
      if (depCatalog) {
        if (depType === 'AWS_CODEDEPLOY' || depType === 'KUBERNETES') {
          return this.replaceWithUnderScore(depCatalog.displayText)
        } else {
          return depCatalog.value
        }
      }
    }
  }

  replaceWithUnderScore = displayText => {
    return displayText.replace(' ', '_')
  }

  fetchInfraMappings = (envId, serviceId, newInfraMappingId) => {
    apis.fetchComputeProviders(this.appIdFromUrl, cpRes => {
      const computeProviders = cpRes.resource.response
      const objComputeProviders = {}
      computeProviders.map(cp => {
        objComputeProviders[cp.uuid] = cp
      })

      apis.fetchEnv(this.appIdFromUrl, envId).then(r => {
        const serviceTemplates = r.resource.serviceTemplates
        const selectedServiceTemplate = serviceTemplates.find(st => st.serviceId === serviceId)

        apis.fetchInfrastructuresStencils(this.appIdFromUrl).then(r1 => {
          apis.fetchInfraMappingsByService(this.appIdFromUrl, serviceId, envId).then(r => {
            const infraMappings = r.resource.response
            const uiSchema = FormUtils.clone(this.state.uiSchema)
            // uiSchema.infraMappingId = {}

            this.setState({
              infraStencils: r1.resource,
              infraMappings,
              selectedServiceTemplate,
              objComputeProviders,
              uiSchema
            })
            const savedInfraMapping = infraMappings.find(mapping => mapping.uuid === newInfraMappingId)
            const savedInfraUuid = savedInfraMapping ? savedInfraMapping.uuid : ''
            this.updateForm({ infraMappings }, savedInfraUuid)
          })
        })
      })
    })
  }

  onChange = ({ formData }) => {
    const prevType = Utils.getJsonValue(this, 'state.formData.orchestrationWorkflow.orchestrationWorkflowType') || ''
    const type = Utils.getJsonValue(formData, 'orchestrationWorkflow.orchestrationWorkflowType') || ''
    if (prevType && type !== prevType) {
      this.updateForm({ orchestrationWorkflowType: type, formData })
    }
    if (FormUtils.isFieldChanged(this, formData, 'serviceId') || FormUtils.isFieldChanged(this, formData, 'envId')) {
      // Basic WF, when changing Service or Env => fetchInfraMappings
      if (type === 'BASIC') {
        this.fetchInfraMappings(formData.envId, formData.serviceId)
      }
    }
    if (FormUtils.isFieldChanged(this, formData, 'infraMappingId')) {
      if (formData.infraMappingId === 'NEW') {
        const selectedService = this.props.services.find(service => service.uuid === formData.serviceId)
        if (selectedService) {
          this.selectedServiceArtifact = selectedService.artifactType
        }
        formData.infraMappingId = ''
        this.setState({ showInfraModal: true, selectedService: true })
      }
    }
    this.setState({ formData })
  }

  onSubmit = ({ formData }) => {
    const isEditing = this.props.data && this.props.data.uuid ? true : false
    formData.workflowType = 'ORCHESTRATION'
    this.props.onSubmit(formData, isEditing)
    this.initialised = false
  }

  /* Calling common validation method for workflow templatization */
  validate = (formData, errors) => {
    const isEditing = this.props.data && this.props.data.uuid ? true : false
    const workflowType = formData.orchestrationWorkflow.orchestrationWorkflowType
    const tempDempMap = Utils.clone(dependencyMap)
    tempDempMap['envId'] = 'infraMappingId'

    const schema = Utils.clone(this.state.schema)
    const artifactType = formData.services && formData.services.length > 0 ? formData.services[0].artifactType : ''
    const metadataObj = {
      entityTypeCatalogs: Utils.getJsonValue(this, 'props.catalogs.FORM_FIELD_TO_ENTITY_TYPE') || [],
      artifactType: artifactType,
      dependencyMap: dependencyMap
    }

    if (this.state.formData && isEditing) {
      FormUtils.transformDataForTemplatization(formData, schema, metadataObj)
      if (workflowType === Utils.workflowTypes.BASIC) {
        const templateExpressions = formData.templateExpressions
        errors = FormUtils.validateFormDataForTemplateWorkflow(templateExpressions, errors, tempDempMap, schema)
        errors = this.getWorkflowVariableEntities(formData, errors)
      }
    }

    return errors
  }

  getWorkflowVariableEntities = (formData, errors) => {
    const schema = FormUtils.clone(this.state.schema)
    const templateExpressions = formData.templateExpressions

    const infraExpressions = TemplateUtils.filterWorkflowVariables(
      templateExpressions,
      TemplateUtils.entityTypes.infraMapping,
      'metadata',
      'entityType'
    )
    const requiredArr = schema.required

    const infraIdx = requiredArr.indexOf('infraMappingId')

    if (infraExpressions && infraExpressions.length > 0) {
      schema.required = schema.required.splice(infraIdx, 1)
      delete formData.infraMappingId
    } else if (infraIdx === -1 && (formData.infraMappingId === '' || !formData.infraMappingId)) {
      if (!errors['infraMappingId']) {
        errors['infraMappingId'] = {}
      }
      errors['infraMappingId'].addError('InfraMappingId is required')
    }
    return errors
  }

  onSubmitInfraProvider = newInfraMappingId => {
    const uiSchema = Utils.clone(this.state.uiSchema)
    // uiSchema.infraMappingId = { 'ui:disabled': true }
    this.setState({
      showInfraModal: false,
      selectedServiceTemplate: null,
      uiSchema
    })
    const serviceId = this.state.formData.serviceId
    const envId = this.state.formData.envId
    this.fetchInfraMappings(envId, serviceId, newInfraMappingId)
  }

  filterService = () => {
    if (this.state.showInfraModal) {
      const data = this.state.formData
      if (data === null) {
        return
      }
      const serviceId = this.state.formData.serviceId
      if (serviceId) {
        const service = this.props.services.find(item => item.uuid === serviceId)
        if (service) {
          return service.uuid
        }
      }
    }
  }

  getEnvId = () => {
    if (this.state.showInfraModal && this.state.formData) {
      return this.state.formData.envId
    } else {
      return this.envId
    }
  }

  /*
    Change is-> Templatize icon is all workflows
    on the edit mode
  */
  getFieldTemplate = () => {
    if (this.state.formData && this.isEdit) {
      return CustomFieldTemplate
    }
    return undefined
  }

  hideModal = () => {
    this.initialised = false
    this.props.onHide()
  }
  renderForm = () => (
    <WingsForm
      key={this.state.key}
      name="Workflow"
      ref="form"
      schema={this.state.schema}
      uiSchema={this.state.uiSchema}
      formData={this.state.formData}
      onChange={this.onChange}
      onSubmit={this.onSubmit}
      validate={this.validate}
      onError={log('errors')}
      FieldTemplate={this.getFieldTemplate()}
    />
  )

  render () {
    if (this.props.formOnly) {
      return this.renderForm()
    }

    return (
      <WingsModal show={this.props.show} onHide={this.hideModal} className={css.main}>
        <Modal.Header closeButton>
          <Modal.Title>Workflow</Modal.Title>
        </Modal.Header>
        <Modal.Body>{this.renderForm()}</Modal.Body>

        <InfraStructureMappingModal
          appId={this.appIdFromUrl}
          envId={this.getEnvId()}
          /* service={this.props.services this.state.formData.serviceId}*/
          infraStencils={this.state.infraStencils}
          show={this.state.showInfraModal}
          onHide={() => {
            Utils.hideModal.call(this, 'showInfraModal')
            this.setState({ selectedService: false })
          }}
          serviceTemplate={this.state.selectedServiceTemplate}
          objComputeProviders={this.state.objComputeProviders}
          onSubmit={data => this.onSubmitInfraProvider(data)}
          onSubmitConnector={this.props.fetchData}
          catalogs={this.state.catalogs}
          selectedServiceArtifact={this.selectedServiceArtifact}
          selectedService={this.state.selectedService}
        />
      </WingsModal>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/OrchestrationPage/NewWorkflowModal.js