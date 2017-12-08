import React from 'react'
import { Modal } from 'react-bootstrap'
import { WingsModal, WingsDynamicForm, CompUtils, Utils } from 'components'
import css from './ConfigureKMSModal.css'
import CustomKMSForm from './CustomKMSForm.js'
import HashiCorpKMSModal from './HashiCorpKMSModal.js'

import { SecretManagementService } from 'services'

const kmsTypes = {
  AMAZON_KMS: 'amazonKMS',
  HASHI_CORP_KMS: 'hashiCorpKMS'
}
const baseSchema = {
  type: 'object',
  properties: {
    configureType: {
      type: 'string',
      title: 'Configuration Type',
      enum: ['amazonKMS', 'hashiCorpKMS'],
      enumNames: ['Amazon KMS', 'HashiCorp Vault'],
      default: 'amazonKMS'
    }
  }
}

const baseUiSchema = {
  configureType: { 'ui:placeholder': 'Select Configuration' }
}

export default class ConfigureKMSModal extends React.Component {
  state = {
    showAmazonKMS: false,
    showHashiCorpKMS: false
  }

  async componentWillMount () {
    await this.init()
  }

  init = async () => {
    const { show } = this.props
    const { showAmazonKMS, showHashiCorpKMS } = this.setModalVisibility()
    const formData = this.setFormData()
    this.setUiSchema()

    if (show) {
      await CompUtils.setComponentState(this, {
        initialized: true,
        schema: baseSchema,
        uiSchema: baseUiSchema,
        formData: formData,
        showAmazonKMS,
        showHashiCorpKMS
      })
    }
  }

  setModalVisibility = () => {
    const { data } = this.props
    if (data) {
      const { encryptionType } = data
      if (encryptionType === Utils.encryptionTypes.KMS) {
        return { showAmazonKMS: true, showHashiCorpKMS: false }
      } else if (encryptionType === Utils.encryptionTypes.VAULT) {
        return { showAmazonKMS: false, showHashiCorpKMS: true }
      }
    } else {
      return { showAmazonKMS: true, showHashiCorpKMS: false }
    }
  }

  setUiSchema = () => {
    const { data } = this.props
    if (data) {
      baseUiSchema.configureType['ui:disabled'] = true
    } else {
      delete baseUiSchema.configureType['ui:disabled']
    }
  }

  setFormData = () => {
    const formData = {}
    const { data } = this.props

    if (data) {
      const { encryptionType } = data
      formData.configureType = encryptionType === Utils.encryptionTypes.KMS ? 'amazonKMS' : 'hashiCorpKMS'
    }
    return formData
  }

  hideModal = () => {
    this.props.onHide()
  }

  onChange = async ({ formData }) => {
    if (this.form.isFieldChanged('configureType')) {
      if (formData.configureType === kmsTypes.AMAZON_KMS) {
        await CompUtils.setComponentState(this, { showAmazonKMS: true, showHashiCorpKMS: false })
      } else if (formData.configureType === kmsTypes.HASHI_CORP_KMS) {
        await CompUtils.setComponentState(this, { showAmazonKMS: false, showHashiCorpKMS: true })
      }
    }

    await this.form.updateChanges({ formData })
  }

  onSubmit = async ({ formData }) => {
    const configureType = formData.configureType
    const { accountId } = this.props

    if (configureType === kmsTypes.HARNESS_KMS) {
      // TODO -> This api has to be called from admin page
      /* const { accountId } = this.props
      const body = {
        name: 'global-kms',
        accessKey: 'AKIAJLEKM45P4PO5QUFQ',
        secretKey: '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',
        kmsArn: 'arn:aws:kms:us-east-1:830767422336:key/6b64906a-b7ab-4f69-8159-e20fef1f204d',
        accountId: '__GLOBAL_ACCOUNT_ID__'
      }
      const { resource } = await SecretManagementService.saveGlobalKms({ accountId, body })*/
    } else {
      this.child.validateForm({ formData: this.subFormData }, async isValid => {
        // callback function. Keep this function in SubForm & call it onError function
        if (isValid === true) {
          const { error } = await SecretManagementService.saveKMS({ accountId, body: this.subFormData })

          if (error) {
            return
          }
          this.hideModal()
        }
      })
    }
  }

  updateFormData = ({ formData }) => {
    this.subFormData = formData
  }

  renderHashiCorpKMSForm = () => {
    if (this.state.showHashiCorpKMS) {
      return <HashiCorpKMSModal show={this.state.showHashiCorpKMS} {...this.props} />
    }
  }

  render () {
    return (
      <WingsModal show={this.props.show} onHide={this.hideModal} className={css.main}>
        <Modal.Header closeButton>
          <Modal.Title>Configure Secret Manager</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <WingsDynamicForm
            name="Configure Secret Management"
            ref={f => (this.form = f)}
            schema={this.state.schema}
            uiSchema={this.state.uiSchema}
            formData={this.state.formData}
            onChange={this.onChange}
            onSubmit={this.onSubmit}
          >
            {this.state.showAmazonKMS && (
              <CustomKMSForm
                show={this.state.showAmazonKMS}
                updateFormData={this.updateFormData}
                ref={kmsSubForm => (this.child = kmsSubForm)}
                {...this.props}
              />
            )}
            {this.renderHashiCorpKMSForm()}

            <button className="hidden" type="submit" />
          </WingsDynamicForm>
        </Modal.Body>
      </WingsModal>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/SecretsManagementPage/ConfigureKMSModal.js