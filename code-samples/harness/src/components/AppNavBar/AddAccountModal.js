import React from 'react'
import { Modal } from 'react-bootstrap'
import WingsModal from '../WingsModal/WingsModal'
import WingsForm from '../WingsForm/WingsForm'
import { observer } from 'mobx-react'
import { UsersService } from 'services'

const schema = {
  type: 'object',
  required: ['companyName', 'accountName'],
  properties: {
    companyName: { type: 'string', title: 'Company Name', default: '' },
    accountName: { type: 'string', title: 'Account Name', default: '' }
  }
}

const uiSchema = {
  companyName: { 'ui:placeholder': 'Company Name' },
  accountName: { 'ui:placeholder': 'Account Name' }
}

@observer
export default class AddAccountModal extends React.Component {
  state = {}

  onChange = (e) => {
    // TODO: Future use, may add auto complete for company name
  }

  onSubmit = async ({ formData }) => {
    const { companyName, accountName } = formData
    const { response, error } = await UsersService.addAccount(companyName, accountName)

    if (error) {
      // TODO: Show error
    } else {
      this.props.onAccountAdded(response)
    }
  }

  onError = (e) => {
    // TODO: Handling error here
  }

  render () {
    return (
      <WingsModal show={this.props.show} onHide={this.props.onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Add Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <WingsForm
            name="AddAccount"
            ref="form"
            schema={schema}
            uiSchema={uiSchema}
            formData={this.formData}
            onChange={this.onChange}
            onSubmit={this.onSubmit}
            onError={this.onError}
          >
          </WingsForm>

        </Modal.Body>
      </WingsModal>
    )
  }
}



// WEBPACK FOOTER //
// ../src/components/AppNavBar/AddAccountModal.js