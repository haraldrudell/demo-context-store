import React from 'react'
import { Modal } from 'react-bootstrap'
import WingsForm from '../WingsForm/WingsForm'
import WingsModal from '../WingsModal/WingsModal'
import css from './WingsCloneModal.css'
import Utils from '../Utils/Utils'

export default class WingsCloneModal extends React.Component {
  schema = {
    type: 'object',
    required: ['name'],
    properties: {
      name: { type: 'string', 'title': 'Name' },
      description: { type: 'string', 'title': 'Description' }
    }
  }
  uiSchema = {
    'ui:order': ['name', 'description']
  }
  formData={
    name: '',
    description: ''
  }
  state= {
    schema: this.schema,
    uiSchema: this.uiSchema,
    formData: {},
    cloneModalshow: false
  }

  componentWillReceiveProps (newProps) {
    if (newProps.show && newProps.cloneData) {
      const data = Utils.clone(newProps.cloneData)

      data.name = (newProps.isTemplate) ? `${data.name}-template` : `${data.name}-clone`
      data.description = (!data.description) ? '' : data.description
      const uiSchema = Utils.clone(this.state.uiSchema)
      if ( this.props.type === 'Command') {
        uiSchema.description = { 'ui:widget': 'hidden' }
        data.commandName = newProps.cloneData.name
      } else {
        uiSchema.description = { }
      }
      this.setState({ formData: data, uiSchema })
    }
  }
  onSubmit = () => {
    const data = Utils.clone(this.state.formData)
    if (this.props.type !== 'Command' && !data.description) {

      data.description = ''
      this.setState({ formData: data })
    }
    this.props.onCloneSubmit(this.state.formData)
  }

  hideCloneModal= () => {
    this.setState({ hideCloneModal: true })
  }

  onChange = ({ formData }) => {

    this.setState({ formData })
  }

  render () {
    const title = (this.props.isTemplate) ? `Template-${this.props.type}` : `Clone-${this.props.type}`
    return (
      <WingsModal show={this.props.show} onHide={this.props.onHide}
        className={css.main}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <WingsForm name="Clone Form" ref="cloneform"
            schema={this.state.schema} uiSchema={this.state.uiSchema}
            formData={this.state.formData}
            onSubmit={this.onSubmit}
            onChange={this.onChange}
          />
        </Modal.Body>
      </WingsModal>
    )
  }

}



// WEBPACK FOOTER //
// ../src/components/WingsCloneModal/WingsCloneModal.js