import React from 'react'
import { Modal } from 'react-bootstrap'
import { WingsDynamicForm, WingsModal, CompUtils, SearchableSelect } from 'components'
import { ServicesService, EnvironmentService } from 'services'
import css from './CloneEnvironmentModal.css'

export default class CloneEnvironmentModal extends React.Component {
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
    formData: {},

    services: []
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

    formData.name = `${formData.name}-clone`
    formData.description = !formData.description ? '' : formData.description

    await this.setComponentState({ formData })
  }

  onInitializeForm = async form => {
    const { appId, uuid } = form.buffer.formData
    const apps = this.props.dataStore.apps.slice()
    const index = apps.findIndex(a => a.uuid === this.props.cloneData.appId)
    const app = apps[index]

    apps.splice(index, 1, { uuid: app.uuid, name: '' })

    form.buffer.schema.properties.targetAppId.title = `Target Application (default: ${app.name} )`
    form.setEnumAndNames('targetAppId', this.props.dataStore.apps)

    const serviceFields = form.buffer.schema.properties.serviceMapping.properties

    let { services } = await EnvironmentService.fetchServices({ environmentId: uuid, appId })

    if (!services) {
      services = []
    }

    services.forEach(service => {
      const serviceName = service.name
      serviceFields[service.uuid] = {
        title: `${serviceName} (${service.artifactType})`,
        type: 'string',
        enum: [],
        enumNames: []
      }
    })

    await this.setComponentState({ services })
    await this.updateForm()
  }

  async updateForm () {
    let classNames = 'hidden'
    const form = this.form
    const fields = form.buffer.schema.properties
    const notMultipleApps = fields.targetAppId.enum.length < 2
    const appId = this.form.getFieldValue('targetAppId')
    const uiSchema = this.form.buffer.uiSchema
    delete uiSchema.targetAppId['custom:message']

    if (notMultipleApps || this.state.services.length === 0) {
      uiSchema.targetAppId.classNames = 'hidden'
    }

    console.log(form.buffer.formData)
    const shouldShowServiceMapping = appId && appId !== this.props.cloneData.appId
    if (shouldShowServiceMapping) {
      classNames = ''
      uiSchema.targetAppId['custom:message'] = (
        <div>
          Associated Service Infrastructure will not be copied.
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

      this.state.services.forEach(service => {
        const matchingServices = services.slice().filter(s => s.artifactType === service.artifactType)

        const serviceId = service.uuid

        serviceMapping.required.push(serviceId)
        serviceFields[serviceId].enumNames = matchingServices.map(s => `${s.name} (${s.artifactType})`)
        serviceFields[serviceId].enum = matchingServices.map(s => s.uuid)
        uiSchema.serviceMapping[serviceId] = {
          'ui:widget': 'SearchableSelect',
          'custom:arrow': true
        }
      })
    }
    uiSchema.serviceMapping.classNames = classNames
  }

  onChange = async ({ formData }) => {
    this.wingsModal.resetErrorMessage()
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
    const environmentId = data.uuid
    const appId = data.appId

    const payload = {
      environment: {
        name: data.name,
        description: data.description
      }
    }

    if (data.targetAppId !== data.appId) {
      payload.targetAppId = data.targetAppId
      payload.serviceMapping = data.serviceMapping
    }
    await EnvironmentService.cloneEnvironment({ environmentId, appId }, payload)
  }

  render () {
    const title = 'Clone Environment'

    return (
      <WingsModal
        className={css.main}
        show={true}
        onHide={this.props.onHide}
        submitting={this.state.submitting}
        ref={m => (this.wingsModal = m)}
      >
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
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
// ../src/containers/EnvironmentPage/CloneEnvironmentModal.js