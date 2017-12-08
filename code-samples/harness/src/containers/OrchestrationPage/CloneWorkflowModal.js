import React from 'react'
import { Modal } from 'react-bootstrap'
import { WingsDynamicForm, WingsModal, CompUtils, SearchableSelect, Utils } from 'components'
import { ServicesService, WorkflowService } from 'services'
import css from './CloneWorkflowModal.css'

export default class CloneWorkflowModal extends React.Component {
  formData = {
    name: '',
    description: ''
  }
  state = {
    schema: {
      type: 'object',
      required: ['name'],
      properties: {
        name: { type: 'string', title: 'Name' },
        description: { type: 'string', title: 'Description' },
        targetAppId: { type: 'string', title: '', enum: [], enumNames: [] },
        serviceMapping: {
          type: 'object',
          title: 'Service Mapping',
          properties: {}
        }
      }
    },
    uiSchema: {
      'ui:order': ['name', 'description', 'targetAppId', 'serviceMapping'],
      name: { 'ui:placeholder': 'Enter name' },
      description: { 'ui:placeholder': 'Enter description' },
      targetAppId: { 'ui:widget': 'SearchableSelect' },
      serviceMapping: {
        'custom:hideErrorMessages': true,
        classNames: 'hidden'
      }
    },
    formData: {}
  }

  customFieldTemplate (props) {
    const { id, classNames, label, help, required, description, errors, children, uiSchema } = props
    const message = uiSchema['custom:message'] || null
    const arrow = uiSchema['custom:arrow'] || null
    return (
      <div className={classNames} id={id + '_field'}>
        <div className="field-area">
          <label id={id + '_title'} htmlFor={id} className="control-label">
            {label}
            {required ? '*' : null}
          </label>
          {arrow && <i className="field-arrow fa fa-long-arrow-right" />}
          {children}
        </div>
        {description}
        {message && <div className="field-message pt-callout pt-intent-warning pt-icon-info-sign">{message}</div>}
        {!uiSchema['custom:hideErrorMessages'] && errors}
        {help}
      </div>
    )
  }

  async setComponentState (state) {
    await CompUtils.setComponentState(this, state)
  }

  async componentWillMount () {
    const formData = this.props.cloneData
    const isWorkflowTemplate = this.props.cloneData.templatized

    formData.name = isWorkflowTemplate ? `${formData.name}-template-clone` : `${formData.name}-clone`
    formData.description = !formData.description ? '' : formData.description

    const serviceFields = this.state.schema.properties.serviceMapping.properties
    formData.services.forEach(service => {
      serviceFields[service.uuid] = {
        title: `${service.name} (${service.artifactType})`,
        type: 'string',
        enum: [],
        enumNames: []
      }
    })

    await this.setComponentState({ formData })
  }

  onInitializeForm = async form => {
    const isWorkflowTemplate = this.props.cloneData.templatized
    const { templatizedServiceIds } = this.props.cloneData
    /*
      Hide TargetApplication when service is templatized
      this is done as part of https://harness.atlassian.net/browse/HAR-2089
    */
    if (isWorkflowTemplate && templatizedServiceIds && templatizedServiceIds.length > 0) {
      this.form.hideFields(['targetAppId'])
    } else {
      const apps = this.props.dataStore.apps.slice()
      const index = apps.findIndex(a => a.uuid === this.props.cloneData.appId)
      const app = apps[index]

      apps.splice(index, 1, { uuid: app.uuid, name: '' })

      form.buffer.schema.properties.targetAppId.title = `Target Application (default: ${app.name} )`
      form.setEnumAndNames('targetAppId', this.props.dataStore.apps)
    }
    await this.updateForm()
  }

  async updateForm () {
    const { orchestrationWorkflow: { orchestrationWorkflowType } } = this.props.cloneData
    let classNames = 'hidden'
    const form = this.form
    const fields = form.buffer.schema.properties
    const notMultipleApps = fields.targetAppId.enum.length < 2
    const appId = this.form.getFieldValue('targetAppId')
    const uiSchema = this.form.buffer.uiSchema
    delete uiSchema.targetAppId['custom:message']

    if (notMultipleApps) {
      uiSchema.targetAppId.classNames = 'hidden'
    }

    const shouldShowServiceMapping = appId && appId !== this.props.cloneData.appId
    if (shouldShowServiceMapping && orchestrationWorkflowType !== Utils.workflowTypes.BUILD) {
      classNames = ''
      uiSchema.targetAppId['custom:message'] = (
        <div>
          Associated Environment, Service Infrastructure and Nodes will not be copied.
          <br />
          These will need to be configured in the target application.
        </div>
      )
    }
    if (this.form.isFieldChanged('targetAppId')) {
      // form.buffer.formData.services.forEach(service => {
      //   form.state.uiSchema.serviceMapping[service.uuid] = { 'ui:placeholder': 'Loading...'}
      // })

      const serviceMapping = form.buffer.schema.properties.serviceMapping
      const serviceFields = serviceMapping.properties
      const formData = form.buffer.formData
      // Reset Service Mapping on app change
      serviceMapping.required = []
      Object.keys(serviceFields).forEach(field => delete formData.serviceMapping[field])

      if (!shouldShowServiceMapping) {
        return
      }
      const { services } = await ServicesService.fetchServices({ appId })

      formData.services.forEach(service => {
        const matchingServices = services.slice().filter(s => s.artifactType === service.artifactType)
        //  this.fillServiceMapping(serviceFields, formData)
        serviceMapping.required.push(service.uuid)
        serviceFields[service.uuid].enumNames = matchingServices.map(s => `${s.name} (${s.artifactType})`)
        serviceFields[service.uuid].enum = matchingServices.map(s => s.uuid)
        uiSchema.serviceMapping[service.uuid] = {
          'ui:widget': 'SearchableSelect',
          'custom:arrow': true
        }
      })
    }
    uiSchema.serviceMapping.classNames = classNames
  }

  // Filling service mapping with workflow services

  fillServiceMapping = (serviceFields, formData) => {
    formData.services.forEach(service => {
      serviceFields[service.uuid] = {
        title: `${service.name} (${service.artifactType})`,
        type: 'string',
        enum: [],
        enumNames: []
      }
    })
  }

  onChange = async ({ formData }) => {
    const errorVisible = this.state.errorVisible
    /*
      Added this because for description change or any change
      form is behaving weird
      ticket for this:https://harness.atlassian.net/browse/HAR-2089
    */
    if (errorVisible) {
      this.wingsModal.resetErrorMessage()
    }
    await this.updateForm()
    await this.form.updateChanges()
  }

  onSubmit = async ({ formData }) => {
    if (this.state.submitting) {
      return
    }
    await this.setComponentState({ submitting: true })
    await this.cloneWorkflow(formData)
    setTimeout(_ => this.props.onHide(), 500)
  }

  async cloneWorkflow (data) {
    const workflowId = data.uuid
    const appId = data.appId

    const payload = {
      workflow: {
        name: data.name,
        description: data.description
      }
    }

    if (data.targetAppId !== data.appId) {
      payload.targetAppId = data.targetAppId
      payload.serviceMapping = data.serviceMapping
    }
    await WorkflowService.cloneWorkflow({ workflowId, appId }, payload)
  }

  render () {
    const isWorkflowTemplate = this.props.cloneData.templatized

    return (
      <WingsModal
        className={css.main}
        show={true}
        onHide={this.props.onHide}
        submitting={this.state.submitting}
        ref={m => (this.wingsModal = m)}
      >
        <Modal.Header closeButton>
          <Modal.Title>{isWorkflowTemplate ? 'Clone Workflow Template' : 'Clone Workflow'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <WingsDynamicForm
            name="Clone Form"
            ref={f => (this.form = f)}
            schema={this.state.schema}
            uiSchema={this.state.uiSchema}
            formData={this.state.formData}
            onInitializeForm={this.onInitializeForm}
            onChange={this.onChange}
            onSubmit={this.onSubmit}
            FieldTemplate={this.customFieldTemplate}
            widgets={{ SearchableSelect }}
          />
        </Modal.Body>
      </WingsModal>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/OrchestrationPage/CloneWorkflowModal.js