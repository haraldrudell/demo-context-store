import React from 'react'
import { Modal } from 'react-bootstrap'
import { WingsModal, WingsDynamicForm, CompUtils } from 'components'
import { EncryptService } from 'services'

const baseSchema = {
  type: 'object',
  required: ['name', 'value'],
  properties: {
    name: {
      type: 'string',
      title: 'Name'
    },
    value: {
      type: 'string',
      title: 'Value'
    }
  }
}

const baseUiSchema = {}

class EncryptVariablesModal extends React.Component {
  isEditing = false
  async componentWillMount () {
    const formData = this.modifyFormData()

    await CompUtils.setComponentState(this, {
      initialized: true,
      formData: formData
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
    const { error, resource } = !this.isEditing ? await this.createKey({ formData }) : await this.editKey({ formData })

    if (error) {
      return
    }
    this.props.onHide()
    this.props.onSubmit(resource)
  }

  createKey = async ({ formData }) => {
    const { accountId } = this.props
    const { error, resource } = await EncryptService.saveEncryptKey({ accountId, body: formData })
    return { error, resource }
  }

  editKey = async ({ formData }) => {
    const { data, accountId } = this.props
    const { uuid } = data
    const { error, resource } = await EncryptService.updateKey({ accountId, uuid, body: formData })
    return { error, resource }
  }

  hideModal = () => {
    this.props.onHide()
  }

  render () {
    return (
      <WingsModal show={this.props.show} onHide={this.hideModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Encrypted Variable</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <WingsDynamicForm
            name="Add Encrypted Variable"
            ref={f => (this.form = f)}
            schema={baseSchema}
            uiSchema={baseUiSchema}
            onSubmit={this.onSubmit}
            formData={this.state.formData}
          />
        </Modal.Body>
      </WingsModal>
    )
  }
}
export default EncryptVariablesModal



// WEBPACK FOOTER //
// ../src/containers/SecretsManagementPage/EncryptResources/EncryptVariablesModal.js