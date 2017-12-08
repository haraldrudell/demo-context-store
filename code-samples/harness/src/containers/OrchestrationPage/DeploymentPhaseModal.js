import React from 'react'
import { Modal } from 'react-bootstrap'
import { Utils, FormUtils, TemplateUtils } from 'components'
import apis from 'apis/apis'
import InfraStructureMappingModal from '../ServiceTemplatePage/InfraStructureMappingModal'
import { WingsModal, WingsForm, CustomFieldTemplate } from 'components'
import css from './DeploymentPhaseModal.css'
const dependencyMap = {
  serviceId: 'infraMappingId'
}
const schema = {
  type: 'object',
  required: ['serviceId', 'infraMappingId'],
  properties: {
    uuid: { type: 'string', title: 'uuid' },
    serviceId: { type: 'string', title: 'Service', enum: [], enumNames: [] },
    // computeProviderId: { type: 'string', title: 'Cloud Provider', enum: [], enumNames: [] },
    // deploymentType: { type: 'string', title: 'Deployment Type', enum: [], enumNames: [] },
    // deploymentMasterId: { type: 'string', title: 'Master Url' },
    infraMappingId: {
      type: 'string',
      title: 'Service Infrastructure',
      enum: [],
      enumNames: []
    }
    // name: { type: 'string', title: 'Phase Display Name' }
  }
}
const uiSchema = {
  uuid: { 'ui:widget': 'hidden' },
  templateExpressions: { 'ui:widget': 'hidden' }
}
// const addSelect = '<New Service Infrastructure>'

const log = type => {} // console.log.bind(console, type)

export default class DeploymentPhaseModal extends React.Component {
  static contextTypes = Utils.getDefaultContextTypes()
  state = {
    key: Math.random() * 999999,
    schema,
    uiSchema,
    formData: {},
    infraMappings: [],
    selectedService: false,
    showWarning: false
  }
  appIdFromUrl = Utils.appIdFromUrl()
  envId = Utils.envIdFromUrl()
  objServices = {}
  catalogDepTypes = []
  services = []
  selectedServiceArtifact
  userVariables = []
  warningMessage

  componentWillMount () {
    Utils.loadCatalogsToState(this)
  }
  componentWillReceiveProps (newProps) {
    if (newProps.show) {
      this.userVariables = newProps.userVariables
      this.envId = this.props.envId || Utils.envIdFromUrl()
      const formData = newProps.data || Utils.clone(this.state.formData)
      this.services = newProps.services
      const isEditing = this.props.data ? true : false
      this.isEdit = isEditing

      if (!isEditing) {
        const userVariables = this.props.userVariables
        const envVariables = TemplateUtils.filterWorkflowVariables(
          userVariables,
          TemplateUtils.entityTypes.environment,
          'metadata',
          'entityType'
        )
        if (envVariables && envVariables.length > 0) {
          this.warningCls = css.warning
          this.warningMessage = 'Inframapping will be templatized as environment is templatized'
          this.setState({ showWarning: true })
        }
      }
      if (newProps.data && newProps.data.serviceId) {
        this.fetchInfraMappings(newProps.data.serviceId, this.envId, () => {
          this.updateSchema(newProps, formData)
        })
      } else {
        if (this.services.length > 0) {
          const formDataKeys = this.state.formData ? Object.keys(this.state.formData) : 0
          const selectedServiceId = formDataKeys.length > 0 ? this.state.formData.serviceId : this.services[0].uuid
          this.fetchInfraMappings(selectedServiceId, this.envId, () => {
            this.updateSchema(newProps, formData)
          })
        }
      }
    }
    if (newProps.catalogDepTypes) {
      this.catalogDepTypes = newProps.catalogDepTypes
    }
  }

  onAddInfraMapping = () => {
    if (this.state.formData.serviceId) {
      const selectedService = this.services.find(service => service.uuid === this.state.formData.serviceId)
      if (selectedService) {
        this.selectedServiceArtifact = selectedService.artifactType
      }
      const selectedServiceTemplate = this.props.serviceTemplates.find(
        st => st.serviceId === this.state.formData.serviceId
      )
      this.setState({
        showInfraModal: true,
        selectedServiceTemplate,
        selectedService: true
      })
    }
  }

  fetchInfraMappings = (serviceId, envId, callback) => {
    apis.fetchInfrastructuresStencils(this.appIdFromUrl).then(r1 => {
      apis.fetchInfraMappingsByService(this.appIdFromUrl, serviceId, envId).then(r => {
        const infraMappings = r.resource.response
        this.setState({ infraStencils: r1, infraMappings })
        if (callback) {
          callback()
        }
      })
    })
  }

  updateSchema = (props, formData) => {
    this.objServices = {}
    // const services = props.services
    this.services.map(service => {
      this.objServices[service.uuid] = service.name
    })
    schema.properties.serviceId.enum = Object.keys(this.objServices)
    schema.properties.serviceId.enumNames = Object.keys(this.objServices).map(k => this.objServices[k])
    // schema.properties.deploymentType.enum = this.catalogDepTypes.map(t => t.value)
    // schema.properties.deploymentType.enumNames = this.catalogDepTypes.map(t => t.name)
    formData.serviceId = formData.serviceId || schema.properties.serviceId.enum[0] || ''

    // this.filterComputeProviders(formData, props)
    // formData.computeProviderId = formData.computeProviderId || schema.properties.computeProviderId.enum[0] || ''

    this.setInfraMappings(schema, formData)

    // formData.name = formData.name || this.generateName(formData)
    if (this.isEdit) {
      this.setTemplatizeOnSchema(formData, schema)
    }
    this.setState({ formData, schema, key: Math.random() * 999999 })
  }

  setInfraMappings = (schema, formData) => {
    const infraMappings = this.state.infraMappings
    const savedInfraMapping = infraMappings.find(mapping => mapping.uuid === formData.infraMappingId)
    const infraMappingId = savedInfraMapping ? savedInfraMapping.uuid : ''
    schema.properties.infraMappingId.enum = [...this.state.infraMappings.map(o => o['uuid']), 'NEW']
    schema.properties.infraMappingId.enumNames = [
      ...this.state.infraMappings.map(o => o['name']),
      '+ New Service Infrastructure'
    ]
    formData.infraMappingId = infraMappingId
    if (!savedInfraMapping) {
      delete formData.infraMappingId
      schema.required.splice(1)
    }
  }

  setTemplatizeOnSchema = (formData, schema) => {
    const defaultTitles = {
      infraMappingId: 'ServiceInfra'
    }
    const dependentFormData = this.getDependentFormData(formData)
    const selectedService = this.services.filter(service => service.uuid === formData.serviceId)
    const artifactType = selectedService && selectedService.length > 0 ? selectedService[0].artifactType : ''
    const metadataObj = {
      entityTypeCatalogs: this.props.catalogs.FORM_FIELD_TO_ENTITY_TYPE,
      artifactType: artifactType,
      dependencyMap: dependencyMap
    }
    const workflowObj = {
      userVariables: this.userVariables,
      metadataObj
    }
    const dependentData = {
      dependencyMap,
      setDependency: true,
      dependentFormData
    }
    const customTemplatizeObj = {
      setTemplatizeOnFields: false
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
      this.userVariables,
      this.props.catalogs.FORM_FIELD_TO_ENTITY_TYPE
    )
  }
  /*
  Special handling for Inframapping default field value
 */
  getDependentFormData = formData => {
    if (formData.deploymentType) {
      const depCatalogText = this.getCatalogTextForInfra(formData.deploymentType)
      return { infraMappingId: depCatalogText }
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
  filterComputeProviders = (formData, props = this.props) => {
    if (Array.isArray(props.serviceTemplates)) {
      const st = props.serviceTemplates.find(st => st.service.uuid === formData.serviceId)

      if (st) {
        const __obj = {}
        const cps = st.infrastructureMappings
        cps.forEach(cp => {
          __obj[cp.computeProviderSettingId] = this.props.objComputeProviders[cp.computeProviderSettingId]
            ? this.props.objComputeProviders[cp.computeProviderSettingId].name
            : ''
        })
        // const __keys = Object.keys(__obj)
        // if (__keys.length > 0) {
        //   schema.properties.computeProviderId.enum = __keys.concat([addSelect])
        //   schema.properties.computeProviderId.enumNames = __keys.map((k) => __obj[k]).concat([addSelect])
        // } else {
        //   schema.properties.computeProviderId.enum = [''].concat([addSelect])
        //   schema.properties.computeProviderId.enumNames = ['None Available'].concat([addSelect])
        // }
      }
    }
  }

  generateName (formData) {
    const serviceName = this.objServices[formData.serviceId] || ''
    const computeProviderName = this.props.objComputeProviders[formData.computeProviderId]
      ? this.props.objComputeProviders[formData.computeProviderId].name
      : ''
    return [serviceName, computeProviderName, Math.floor(Math.random() * 9 + 1)].join('-')
  }

  onChange = ({ formData }) => {
    if (formData.serviceId !== this.state.formData.serviceId) {
      // this.filterComputeProviders(formData)
      // formData.computeProviderId = schema.properties.computeProviderId.enum[0] || ''
      // formData.name = this.generateName(formData)
      formData.infraMappingId = ''
      this.fetchInfraMappings(formData.serviceId, this.envId, () => {
        this.updateSchema(null, formData)
      })
    }

    // if (formData.computeProviderId !== this.state.formData.computeProviderId) {
    //   if (formData.computeProviderId === addSelect) {
    //     formData.computeProviderId = this.state.formData.computeProviderId
    //     this.onAddInfraMapping()
    //   } else {
    //     formData.name = this.generateName(formData)
    //   }
    // }
    if (formData.infraMappingId !== this.state.formData.infraMappingId) {
      if (formData.infraMappingId === 'NEW') {
        formData.infraMappingId = this.state.formData.infraMappingId
        this.onAddInfraMapping()
      }
    }

    this.setState({ formData })
  }
  /* reArrangeFormDataForTemplatization = (formData) => {
    const schema = Utils.clone(this.state.schema)
    const responseObj = Utils.findNested(schema, 'templatizedField', {})
    formData.templateExpressions = []
    for (const templateItem of responseObj) {
     // const obj = `${templateItem.name}:${templateItem.value}`
      delete templateItem.edit
      formData.templateExpressions.push(templateItem)
    }
  }*/

  onSubmit = ({ formData }) => {
    const isEditing = this.props.data ? true : false

    this.props.onSubmit(formData, isEditing)
  }
  validateForm = (formData, errors) => {
    const schema = Utils.clone(this.state.schema)
    const isEditing = this.props.data ? true : false
    const selectedService = this.services.filter(service => service.uuid === formData.serviceId)
    const artifactType = selectedService && selectedService.length > 0 ? selectedService[0].artifactType : ''
    const metadataObj = {
      entityTypeCatalogs: this.props.catalogs.FORM_FIELD_TO_ENTITY_TYPE,
      artifactType: artifactType,
      dependencyMap: dependencyMap
    }

    // Templatize validations for all workflows
    if (isEditing) {
      let templateExpressions = formData.templateExpressions
      TemplateUtils.transformDataForTemplatization(formData, schema, metadataObj)
      templateExpressions = formData.templateExpressions

      if (templateExpressions && templateExpressions.length > 0) {
        errors = FormUtils.validateFormDataForTemplateWorkflow(templateExpressions, errors, dependencyMap, schema)
      }
      if (isEditing) {
        errors = this.validateInfraMappingOnDetemplatize(templateExpressions, errors)
      }
      errors = this.getWorkflowVariableEntities(formData, errors)
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
      schema.required.splice(infraIdx, 1)
    } else if (infraIdx === -1 && (formData.infraMappingId === '' || !formData.infraMappingId)) {
      if (!errors['infraMappingId']) {
        errors['infraMappingId'] = {}
      }
      errors['infraMappingId'].addError('InfraMappingId is required')
    }
    return errors
  }

  validateInfraMappingOnDetemplatize = (templateExpressions, errors) => {
    const envVariables = TemplateUtils.filterWorkflowVariables(
      this.props.userVariables,
      TemplateUtils.entityTypes.environment,
      'metadata',
      'entityType'
    )
    const infraExpressions = TemplateUtils.filterWorkflowVariables(
      templateExpressions,
      TemplateUtils.entityTypes.infraMapping,
      'metadata',
      'entityType'
    )

    if (envVariables.length > 0 && infraExpressions.length === 0) {
      errors['infraMappingId'].addError('Service Infrastructure cannot be detemplatized as environment is templatized')
    }
    return errors
  }

  onSubmitInfraProvider = newInfraMappingId => {
    if (newInfraMappingId) {
      const data = Utils.clone(this.state.formData)
      data.infraMappingId = newInfraMappingId
      this.setState({
        showInfraModal: false,
        selectedServiceTemplate: null,
        formData: data
      })
      this.props.fetchData()
    }
  }
  getFieldTemplate = () => {
    // Show templatiztion option for all workflows on edit mode
    if (this.isEdit) {
      return CustomFieldTemplate
    } else {
      return undefined
    }
  }
  render () {
    const infraStencils = Utils.getJsonValue(this, 'state.infraStencils.resource')
    return (
      <WingsModal show={this.props.show} onHide={this.props.onHide} className={css.main}>
        <Modal.Header closeButton>
          <Modal.Title>Workflow Phase</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <WingsForm
            name="Workflow"
            ref="form"
            key={this.state.key}
            schema={this.state.schema}
            uiSchema={this.state.uiSchema}
            formData={this.state.formData}
            onChange={this.onChange}
            onSubmit={this.onSubmit}
            onError={log('errors')}
            showErrorList={false}
            FieldTemplate={this.getFieldTemplate()}
            validate={this.validateForm}
          />
          {this.state.showWarning && <span className={this.warningCls}>{this.warningMessage}</span>}
        </Modal.Body>
        <InfraStructureMappingModal
          appId={this.appIdFromUrl}
          envId={this.envId}
          infraStencils={infraStencils}
          show={this.state.showInfraModal}
          onHide={() => {
            Utils.hideModal.call(this, 'showInfraModal')
            this.setState({ selectedService: false })
          }}
          serviceTemplate={this.state.selectedServiceTemplate}
          objComputeProviders={this.props.objComputeProviders}
          onSubmit={data => {
            this.onSubmitInfraProvider(data)
          }}
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
// ../src/containers/OrchestrationPage/DeploymentPhaseModal.js