import React from 'react'
import { Modal } from 'react-bootstrap'
// import Form from 'react-jsonschema-form'
import { WingsForm } from 'components'

const schema = {
  type: 'object',
  required: ['name'],
  properties: {
    uuid: { type: 'string', title: 'uuid', default: '' },
    name: { type: 'string', title: 'Name' },
    description: { type: 'string', title: 'Description', default: '' },
    autoTaggingRule: { type: 'string', title: 'TaggingRule', default: 'tagging rules' }
  }
}

const uiSchema = {
  uuid: { 'ui:widget': 'hidden' },
  name: { 'ui:placeholder': 'Name' },
  description: { 'ui:widget': 'textarea', 'ui:placeholder': 'Description' },
  autoTaggingRule: { 'ui:widget': 'hidden' }
}

const log = type => {} // console.log.bind(console, type)

export default class TagModal extends React.Component {
  formData = {}
  isEdit = false

  componentWillReceiveProps (newProps) {
    if (newProps.show) {
      this.isEdit = newProps.data ? true : false
      this.formData = newProps.data

      if (this.formData && !this.formData.description) {
        this.formData.description = ''
      }
    }
  }

  onSubmit = ({ formData }) => {
    if (formData.description && formData.description.length <= 0) {
      delete formData.description
    }

    this.props.onSubmit(formData, this.isEdit)
  }

  render () {
    return (
      <Modal show={this.props.show} onHide={this.props.onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Tag</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <WingsForm
            name="Tag"
            ref="form"
            schema={schema}
            uiSchema={uiSchema}
            formData={this.formData}
            onChange={log('changed')}
            onSubmit={this.onSubmit}
            onError={log('errors')}
          />
        </Modal.Body>
      </Modal>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/TagPage/TagModal.js