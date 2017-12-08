import React from 'react'
import { Modal } from 'react-bootstrap'
// import Form from 'react-jsonschema-form'
import WingsForm from '../WingsForm/WingsForm'
import css from './SaveVersionsModal.css'

const schema = {
  type: 'object',
  required: [], // will be set later
  properties: {
    setAsDefault: { type: 'boolean', title: 'Set As Default', default: true },
    notes: { type: 'string', title: 'Notes', default: '' }

  }
}
const uiSchema = {
  notes: { 'ui:widget': 'textarea' }
}

const log = (type) => {} // console.log.bind(console, type)

export default class SaveVersionsModal extends React.Component {
  static contextTypes = {
    catalogs: React.PropTypes.object // isRequired
  }
  state = {}
  formData = {}

  onSubmit = ({ formData }) => {
    this.props.onSubmit(formData)
  }

  componentWillReceiveProps (newProps) {
    if (newProps.show) {
      this.formData = newProps.data
      this.setState({ __update: Date.now() })
    }
  }


  render () {
    return (
      <Modal show={this.props.show} onHide={this.props.onHide} className={css.main}>
        <Modal.Header closeButton>
          <Modal.Title>Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <WingsForm name="Version Save" ref="form" schema={schema} uiSchema={uiSchema}
            formData={this.formData}
            onChange={log('changed')}
            onSubmit={this.onSubmit}
            onError={log('errors')} />
        </Modal.Body>
      </Modal>
    )
  }
}



// WEBPACK FOOTER //
// ../src/components/Versioning/SaveVersionsModal.js