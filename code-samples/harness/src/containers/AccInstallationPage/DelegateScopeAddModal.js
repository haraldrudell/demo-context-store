import React from 'react'
import { Button, Modal } from 'react-bootstrap'
import { WingsModal, WingsDynamicForm } from 'components'
import { DelegatesService } from 'services'

const baseSchema = {
  type: 'object',
  required: [],
  properties: {
    select: {
      type: 'string',
      title: 'Add Delegate Scope',
      enum: ['EXISTING', 'NEW'],
      enumNames: ['From existing scope', 'New scope']
    },
    existingScopeId: {
      type: 'string',
      title: 'Scope',
      enum: ['Scope1'],
      enumNames: ['Delegate Scope 1']
    }
  }
}

const baseUiSchema = {
  select: { 'ui:widget': 'radio' },
  existingScopeId: {
    'ui:widget': 'hidden',
    'ui:placeholder': 'Select an existing scope'
  }
}

class DelegateScopeAddModal extends React.Component {
  state = {
    schema: baseSchema,
    uiSchema: baseUiSchema,
    formData: {}
  }
  form
  scopes = []

  onInitializeForm = async form => {
    const { accountId } = this.props.urlParams
    const { scopes } = await DelegatesService.getDelegateScopes({ accountId })
    this.form.setEnumAndNames('existingScopeId', scopes)
    this.scopes = scopes

    const formData = form.buffer.formData
    formData.select = 'EXISTING' // select 'EXISTING' by default.
    await this.updateForm({ formData })
  }

  updateForm = async ({ formData }) => {
    const selectedExisting = formData.select === 'EXISTING'
    this.form.toggleFields(['existingScopeId'], selectedExisting)
    this.form.setRequired(['existingScopeId'], selectedExisting)

    await this.form.updateChanges()
  }

  onChange = async ({ formData }) => {
    if (this.form.isFieldChanged('select')) {
      await this.updateForm({ formData })
    }
  }

  onSubmit = async ({ formData }) => {
    formData.existingScope = this.scopes.find(scope => scope.uuid === formData.existingScopeId)
    await this.props.onSubmit(formData)
  }

  onHide = () => {
    this.setState({ submitting: false })
    this.props.onHide()
  }

  render () {
    return (
      <WingsModal show={this.props.show} onHide={this.onHide} submitting={this.state.submitting}>
        <Modal.Header closeButton>
          <Modal.Title>Delegate Scope</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <WingsDynamicForm
            name="Add Delegate Scope Modal"
            ref={f => (this.form = f)}
            onInitializeForm={this.onInitializeForm}
            schema={this.state.schema}
            uiSchema={this.state.uiSchema}
            formData={this.state.formData}
            onChange={this.onChange}
            onSubmit={this.onSubmit}
          >
            <Button bsStyle="default" type="submit" className="submit-button" disabled={this.state.submitting}>
              ADD SCOPE
            </Button>
          </WingsDynamicForm>
        </Modal.Body>
      </WingsModal>
    )
  }
}

export default DelegateScopeAddModal



// WEBPACK FOOTER //
// ../src/containers/AccInstallationPage/DelegateScopeAddModal.js