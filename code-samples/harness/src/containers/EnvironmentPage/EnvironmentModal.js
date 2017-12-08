import React from 'react'
import { Modal } from 'react-bootstrap'
// import Form from 'react-jsonschema-form'
import { WingsForm } from 'components'
// import css from './AppContainerModal.css'

const schema = {
  type: 'object',
  required: ['name', 'environmentType'],
  properties: {
    uuid: { type: 'string', title: 'uuid', default: '' },
    name: { type: 'string', title: 'Name' },
    description: { type: 'string', title: 'Description', default: '' },
    environmentType: {
      type: 'string',
      title: 'Environment Type',
      default: 'PROD',
      enum: ['PROD', 'NON_PROD'],
      enumNames: ['Production', 'Non-Production']
    }
  }
}

const uiSchema = {
  uuid: { 'ui:widget': 'hidden' }
}

const log = (type) => {} // console.log.bind(console, type)

export default class EnvironmentModal extends React.Component {

  onSubmit = ({ formData }) => {
    const isEditing = (this.props.data ? true : false)
    this.props.onSubmit(formData, isEditing)
    this.props.onHide()
  }

  render () {
    return (
      <Modal show={this.props.show} onHide={this.props.onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Environment</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <WingsForm name="Environment" ref="form" schema={schema} uiSchema={uiSchema}
            formData={this.props.data}
            onChange={log('changed')}
            onSubmit={this.onSubmit}
            onError={log('errors')} />

        </Modal.Body>
      </Modal>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/EnvironmentPage/EnvironmentModal.js