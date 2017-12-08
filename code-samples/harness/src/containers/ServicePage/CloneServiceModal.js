import React from 'react'
import { Modal } from 'react-bootstrap'
import { WingsDynamicForm, WingsModal, CompUtils, SearchableSelect } from 'components'
import { ServicesService } from 'services'
import css from './CloneServiceModal.css'

export default class CloneServiceModal extends React.Component {
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
        targetAppId: { type: 'string', title: 'Target Application', enum: [], enumNames: [] }
      }
    },
    uiSchema: {
      'ui:order': ['name', 'description', 'targetAppId'],
      name: { 'ui:placeholder': 'Enter name' },
      description: { 'ui:placeholder': 'Enter description' },
      targetAppId: { 'ui:widget': 'SearchableSelect', classNames: 'hidden' }
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

    formData.name = `${formData.name}-clone`
    formData.description = !formData.description ? '' : formData.description

    await this.setComponentState({ formData })
  }

  onInitializeForm = async form => {
    const apps = this.props.dataStore.apps.slice()
    const index = apps.findIndex(a => a.uuid === this.props.cloneData.appId)
    const app = apps[index]

    apps.splice(index, 1, { uuid: app.uuid, name: '' })

    form.buffer.schema.properties.targetAppId.title = `Target Application (default: ${app.name} )`
    form.setEnumAndNames('targetAppId', this.props.dataStore.apps)
    await this.updateForm()
  }

  async updateForm () {
    const form = this.form
    const fields = form.buffer.schema.properties
    const notMultipleApps = fields.targetAppId.enum.length < 2
    const uiSchema = this.form.buffer.uiSchema

    if (notMultipleApps) {
      uiSchema.targetAppId['ui:widget'] = 'hidden'
    }
  }

  onChange = async ({ formData }) => {
    this.wingsModal.resetErrorMessage()
    await this.updateForm()
    await this.form.updateChanges()
  }

  onSubmit = async ({ formData }) => {
    await this.setComponentState({ submitting: true })
    await this.cloneService(formData)
    setTimeout(_ => this.props.onHide(), 500)
  }

  async cloneService (data) {
    const serviceId = data.uuid
    const appId = data.appId

    const payload = {
      service: {
        name: data.name,
        description: data.description
      }
    }

    if (data.targetAppId !== data.appId) {
      payload.targetAppId = data.targetAppId
    }
    await ServicesService.cloneService({ serviceId, appId }, payload)
    await this.props.dataStore.fetchAllApps()
  }

  render () {
    const title = 'Clone Service'

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
            widgets={{ SearchableSelect }}
          />
        </Modal.Body>
      </WingsModal>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/ServicePage/CloneServiceModal.js