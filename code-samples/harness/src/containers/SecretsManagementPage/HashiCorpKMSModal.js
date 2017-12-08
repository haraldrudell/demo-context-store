import React from 'react'
import { Button } from 'react-bootstrap'
import { WingsDynamicForm, CompUtils } from 'components'
import css from './CustomKMSForm.css'
import { HashiCorpService } from 'services'
import KMSDefaultFieldTemplate from './KMSDefaultFieldTemplate'

const baseSchema = {
  type: 'object',
  required: ['name', 'vaultUrl', 'authToken'],
  properties: {
    name: {
      type: 'string',
      title: 'Display Name'
    },
    vaultUrl: {
      type: 'string',
      title: 'Vault URL'
    },
    authToken: {
      type: 'string',
      title: 'Token'
    },
    default: {
      type: 'boolean',
      title: 'Use as default secret manager',
      default: false
    }
  }
}

const baseUiSchema = {
  default: {
    'ui:description': 'The best password',
    'ui:widget': 'CheckboxWidget',
    'custom:widget': 'CheckboxWidget'
  },
  authToken: {
    'ui:widget': 'password',
    'custom:wiget': 'password'
  }
}
/* const widgets = {
  CheckboxWidget: props => {
    return (
      <label>
        <input type="checkbox" title="hello" />
        <span>checkbox</span>
      </label>
    )
  }
}*/

export default class HashiCorpKMSModal extends React.Component {
  isEditing = false

  async componentWillMount () {
    const { data } = this.props

    const formData = WingsDynamicForm.toFormData({ data }) || {}
    if (data && data.uuid) {
      this.isEditing = true
    }
    this.modifyDefaultOnSchema(data)

    await CompUtils.setComponentState(this, {
      initialized: true,
      formData: formData
    })
  }

  modifyDefaultOnSchema = formData => {
    if (this.isEditing && formData) {
      if (formData.default) {
        baseUiSchema['default'] = { 'ui:disabled': true }
      } else {
        baseUiSchema['default'] = {}
      }
    } else {
      baseUiSchema['default'] = {}
    }
  }

  onInitializeForm = async form => {}

  onSubmit = async ({ formData }) => {
    const { accountId } = this.props

    const { error } = await HashiCorpService.saveHashiCorpKMS({ accountId, body: formData })

    if (error) {
      return
    }
    this.hideModal()
    this.props.onSubmit()
  }

  hideModal = () => {
    this.isEditing = false
    this.props.onHide()
    baseUiSchema['default'] = {}
  }

  render () {
    return (
      <WingsDynamicForm
        name="HashiCorp KMSForm"
        ref={f => (this.form = f)}
        onInitializeForm={this.onInitializeForm}
        schema={baseSchema}
        uiSchema={baseUiSchema}
        formData={this.state.formData}
        onSubmit={this.onSubmit}
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
// ../src/containers/SecretsManagementPage/HashiCorpKMSModal.js