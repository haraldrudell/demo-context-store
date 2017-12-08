import React from 'react'
import { Button } from 'react-bootstrap'
import { WingsDynamicForm, CompUtils } from 'components'
import css from './CustomKMSForm.css'
import { SecretManagementService } from 'services'
import KMSDefaultFieldTemplate from './KMSDefaultFieldTemplate'

const baseSchema = {
  type: 'object',
  required: ['name', 'accessKey', 'secretKey', 'kmsArn'],
  properties: {
    name: {
      type: 'string',
      title: 'Display Name'
    },
    accessKey: {
      type: 'string',
      title: 'Access Key'
    },
    secretKey: {
      type: 'string',
      title: 'Secret Key'
    },
    kmsArn: {
      type: 'string',
      title: 'ARN'
    },
    default: {
      type: 'boolean',
      title: 'Use as default secret manager',
      default: false
    }
  }
}

const baseUiSchema = {
  secretKey: {
    'ui:widget': 'password'
  }
}

export default class CustomKMSForm extends React.Component {
  isEditing = false
  async componentWillMount () {
    await this.init(this.props)
  }

  init = async props => {
    if (props.show) {
      const { data } = this.props
      if (data && data.uuid) {
        this.isEditing = true
      }

      const formData = WingsDynamicForm.toFormData({ data: this.props.data }) || {}
      this.modifyDefaultOnSchema(formData)

      await CompUtils.setComponentState(this, {
        initialized: true,
        schema: baseSchema,
        uiSchema: baseUiSchema,
        formData: formData
      })
    }
  }

  modifyDefaultOnSchema = formData => {
    if (this.isEditing) {
      if (formData.default) {
        baseUiSchema['default'] = { 'ui:disabled': true }
      } else {
        baseUiSchema['default'] = {}
      }
      formData.secretKey = ''
    } else {
      baseUiSchema['default'] = {}
    }
  }

  validate = (formData, errors) => {
    return errors
  }

  validateFormCallback = null
  validateForm = ({ formData }, callback) => {
    this.validateFormCallback = callback

    this.submit({ formData })
  }

  hideModal = async () => {
    this.isEditing = false
    this.props.onHide()
    baseUiSchema['default'] = {}
  }

  onSubmit = async ({ formData }) => {
    const { accountId } = this.props

    const { error } = await SecretManagementService.saveKMS({ accountId, body: formData })
    if (error) {
      return
    }
    this.hideModal()
    this.props.onSubmit()
  }

  onChange = async ({ formData }) => {
    const form = this.form
    let showWarning = false
    if (form.isFieldChanged('default')) {
      showWarning = formData.default ? true : false
      this.warningMessage = showWarning ? 'This KMS will be used for encryption in future' : ''
    }
    await form.updateChanges()
    await CompUtils.setComponentState(this, { showWarning })
  }

  render () {
    return (
      <WingsDynamicForm
        name="Custom KMS Form"
        ref={f => (this.form = f)}
        schema={this.state.schema}
        uiSchema={this.state.uiSchema}
        formData={this.state.formData}
        onChange={this.onChange}
        onSubmit={this.onSubmit}
        validate={this.validate}
        FieldTemplate={KMSDefaultFieldTemplate}
      >
        <div className={css.submitSection}>
          <Button bsStyle="default" type="submit" className="submit-button" disabled={this.state.submitting}>
            SUBMIT
          </Button>
        </div>
      </WingsDynamicForm>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/SecretsManagementPage/CustomKMSForm.js