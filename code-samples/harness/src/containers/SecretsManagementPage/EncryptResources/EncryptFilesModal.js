import React from 'react'
import ReactDOM from 'react-dom'
import { Modal } from 'react-bootstrap'
import { WingsModal, WingsDynamicForm, CompUtils } from 'components'
import { EncryptService } from 'services'

const baseSchema = {
  type: 'object',
  required: ['name', 'file'],
  properties: {
    name: { type: 'string', title: 'Name' },
    file: { type: 'string', title: 'File' }
  }
}

const baseUiSchema = {
  file: { 'ui:widget': 'FileWidget' }
}

const FileWidget = props => {
  return (
    <input
      type="file"
      id="root_file"
      required={props.required}
      onChange={event => {
        props.onChange(event.target.value)
      }}
    />
  )
}

const widgets = getForm => ({
  FileWidget
})

class EncryptVariablesModal extends React.Component {
  isEditing = false
  state = {
    schema: {},
    uiSchema: {}
  }
  async componentWillMount () {
    const formData = this.modifyFormData()

    await CompUtils.setComponentState(this, {
      initialized: true,
      formData: formData,
      schema: baseSchema,
      uiSchema: baseUiSchema,
      widgets: widgets(_ => this.form)
    })
  }

  modifyFormData = () => {
    const { data } = this.props
    if (data) {
      this.isEditing = true
      const { name, encryptedValue } = data
      return { name, value: encryptedValue }
    } else {
      return {}
    }
  }

  onChange = async ({ formData }) => {
    const form = this.form

    await form.updateChanges()
  }

  onSubmit = async ({ formData }) => {
    const data = this.getPayload({ formData })

    const { error, resource } = await (this.isEditing
      ? this.editFile({ formData: data })
      : this.createFile({ formData: data }))
    if (error) {
      return
    }

    this.props.onHide()
    this.props.onSubmit(resource)
  }

  getPayload = ({ formData }) => {
    const data = new FormData()

    const el = ReactDOM.findDOMNode(this.form)
    formData.file = el.querySelector('input[type="file"]').files[0]
    data.append('name', formData.name)
    data.append('file', formData.file)
    return data
  }

  createFile = async ({ formData }) => {
    const { accountId } = this.props
    const { error, resource } = await EncryptService.createEncryptFile({
      accountId,
      body: formData
    })

    return { error, resource }
  }

  handleResponse = (resource, error) => {
    if (resource.ok) {
      this.props.onHide()
      this.props.onSubmit(resource)
      // this.props.onTourStop()
    } else {
      resp.json().then(content => {
        if (Array.isArray(content.responseMessages)) {
        }
      })
    }
  }

  editFile = async ({ formData }) => {
    const { data, accountId } = this.props
    const { uuid } = data

    formData.append('uuid', uuid)
    const { error, resource } = await EncryptService.editEncryptFile({ accountId, body: formData })
    return { error, resource }
  }

  hideModal = () => {
    this.props.onHide()
  }

  render () {
    return (
      <WingsModal show={this.props.show} onHide={this.hideModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Encrypted File</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <WingsDynamicForm
            name="Add Encrypted File"
            ref={form => (this.form = form)}
            schema={this.state.schema}
            uiSchema={this.state.uiSchema}
            onSubmit={this.onSubmit}
            formData={this.state.formData}
            widgets={this.state.widgets}
          />
        </Modal.Body>
      </WingsModal>
    )
  }
}
export default EncryptVariablesModal



// WEBPACK FOOTER //
// ../src/containers/SecretsManagementPage/EncryptResources/EncryptFilesModal.js