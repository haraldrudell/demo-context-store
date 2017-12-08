import React from 'react'
import { Modal } from 'react-bootstrap'
// import Form from 'react-jsonschema-form'
import { WingsModal, WingsForm, Utils, TargetEnvsFormWidget, ManageVersionsModal } from 'components'
import css from './OrchestrationModal.css'

const schema = {
  type: 'object',
  required: ['name'],
  properties: {
    uuid: { type: 'string', title: 'uuid' },
    name: { type: 'string', title: 'Name' },
    description: { type: 'string', title: 'Description', default: '' },
    services: {
      type: 'array',
      title: 'Service',
      uniqueItems: true,
      items: {
        enum: [],
        enumNames: [],
        type: 'string'
      }
    },
    targetToAllEnv: { type: 'boolean', title: '  ', default: true },
    envIdVersionMap: { type: 'object', title: '  ', properties: {}, default: {} }
  }
}

const log = type => {} // console.log.bind(console, type)

/**
 * Refer to: NewWorkflowModal.js
 */

export default class OrchestrationModal extends React.Component {
  state = { schema, data: {}, showManageVersions: false }
  formData = null

  targetEnvWidget = props => {
    return <TargetEnvsFormWidget params={props} onShowTargetModal={this.onShowTargetModal.bind(this)} />
  }

  uiSchema = {
    uuid: { 'ui:widget': 'hidden' },
    description: { 'ui:widget': 'textarea' },
    services: { 'ui:widget': 'checkboxes' },
    targetToAllEnv: { 'ui:widget': this.targetEnvWidget, classNames: '__targetToAllEnvs' },
    envIdVersionMap: { classNames: '__envIdVersionMap' }
  }

  componentWillReceiveProps (newProps) {
    if (newProps.show) {
      this.updateSchema(newProps.services, newProps.data)
    }
  }

  updateSchema = (services, data) => {
    if (services) {
      const objServices = {}
      services.map(service => {
        objServices[service.uuid] = service.name
      })
      schema.properties.services.items.enum = Object.keys(objServices)
      schema.properties.services.items.enumNames = Object.keys(objServices).map(k => objServices[k])
      let formData = {}
      if (data && data.services) {
        formData = Utils.clone(data)
        formData.description = formData.description || ''
        const _services = []
        data.services.map(item => _services.push(item.uuid))
        formData.services = _services
      } else {
        formData.services = Object.keys(objServices)
      }
      this.formData = formData
      this.setState({ schema })
    } else {
      this.formData = data
      this.formData.description = this.formData.description || ''
      this.setState({ __update: Date.now() })
    }
  }

  onShowTargetModal = () => {
    console.log('OrchestrationModal', 'onShowTargetModal')
    this.setState({ showManageVersions: true })
  }

  onUpdateEnvIdVersionMap = data => {
    this.formData = data
    this.formData.targetToAllEnv = false
    this.setState({ showManageVersions: false })
  }

  onChange = ({ formData }) => {
    this.formData = formData
  }

  onSubmit = ({ formData }) => {
    const isEditing = this.props.data ? true : false
    formData.services = Utils.mapToUuidArray(formData.services)
    this.props.onSubmit(formData, isEditing)
  }

  render () {
    return (
      <WingsModal show={this.props.show} onHide={this.props.onHide} className={css.main}>
        <Modal.Header closeButton>
          <Modal.Title>Workflow</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <WingsForm
            name="Workflow"
            ref="form"
            schema={this.state.schema}
            uiSchema={this.uiSchema}
            formData={this.formData}
            onChange={this.onChange}
            onSubmit={this.onSubmit}
            onError={log('errors')}
          />
        </Modal.Body>
        <ManageVersionsModal
          show={this.state.showManageVersions}
          data={this.formData}
          environments={this.props.environments}
          showVersion={false}
          modalTitle={'Orchestration'}
          onSubmit={this.onUpdateEnvIdVersionMap}
          onHide={Utils.hideModal.bind(this, 'showManageVersions')}
        />
      </WingsModal>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/OrchestrationPage/OrchestrationModal.js