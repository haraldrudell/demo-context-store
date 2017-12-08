import React from 'react'
import { Button, Modal } from 'react-bootstrap'
import { WingsForm, AppStorage, FormFieldTemplate, WingsModal } from 'components'

import { ApplicationService } from 'services'
const schema = {
  type: 'object',
  required: ['name'],
  properties: {
    uuid: { type: 'string', title: 'uuid', default: '' },
    accountId: { type: 'string', title: 'accountId' },
    name: { type: 'string', title: 'Name' },
    description: { type: 'string', title: 'Description', default: '' }
  }
}

const uiSchema = {
  uuid: { 'ui:widget': 'hidden' },
  accountId: { 'ui:widget': 'hidden' },
  name: {
    'ui:placeholder': 'Application Name',
    'ui:help': 'Please enter an Application Name. Application name should be unique.'
  },
  description: { 'ui:placeholder': 'Description' }
}

const log = type => {} // console.log.bind(console, type)

export default class ApplicationModal extends React.Component {
  onSubmit = ({ formData }) => {
    const isEditing = this.props.data ? true : false
    if (!isEditing) {
      formData.accountId = AppStorage.get('acctId')
      delete formData.uuid
    }
    this.submitApplication(formData, isEditing)
    // this.props.onSubmit(formData, isEditing)
  }

  redirectToSetupApplication = appId => {
    const { accountId } = this.props.urlParams
    this.props.router.push(this.props.path.toSetupServices({ accountId, appId }))
  }

  submitApplication = async (formData, isEditing) => {
    const accountId = AppStorage.get('acctId')
    if (!isEditing) {
      const { response, error } = await ApplicationService.createApplication(accountId, formData)
      if (response) {
        this.props.onHide()
        await this.props.afterSubmit()
        this.redirectToSetupApplication(response.uuid)
        // this.props.afterSubmit(true)
      } else if (error) {
        // this.Toast.show({})
      }
    } else {
      const copydata = {
        name: formData.name,
        description: formData.description,
        uuid: formData.uuid,
        accountId: formData.accountId
      }
      const { error } = await ApplicationService.editApplication(formData.uuid, copydata)
      if (error) {
      } else {
        this.props.onHide()
        this.props.afterSubmit()
      }
    }
  }

  render () {
    return (
      <WingsModal show={this.props.show} onHide={this.props.onHide} className="__applicationModal">
        <Modal.Header closeButton>
          <Modal.Title>Application</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <WingsForm
            name="Application"
            schema={schema}
            uiSchema={uiSchema}
            FieldTemplate={FormFieldTemplate}
            formData={this.props.data}
            onChange={log('changed')}
            onSubmit={this.onSubmit}
            onError={log('errors')}
          >
            <Button bsStyle="default" type="submit" className="submit-button">
              SUBMIT
            </Button>
          </WingsForm>
        </Modal.Body>
      </WingsModal>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/ApplicationPage/ApplicationModal.js