import React from 'react'
// import { Utils } from 'components'
import apis from 'apis/apis'
import { WingsForm, PasswordStrengthMeter, AppStorage } from 'components'
import css from './InviteCompletionPage.css' // '../RegisterPage/RegisterPage.css'

const schema = {
  type: 'object',
  required: ['name', 'password'],
  properties: {
    name: { type: 'string', title: 'Name', default: '' },
    email: { type: 'string', title: 'Email', default: '' },
    password: { type: 'string', title: 'Password', default: '', minLength: 4 },
    companyName: { type: 'string', title: 'Company Name', default: '', minLength: 1 },
    accountName: { type: 'string', title: 'Account Name', default: '', minLength: 1 }
  }
}
const uiSchema = {
  name: { 'ui:placeholder': 'First and last name' },
  email: { 'ui:placeholder': 'email@domain.com' },
  companyName: { 'ui:placeholder': 'Company Name' },
  accountName: { 'ui:placeholder': 'Account Name' },
  password: {
    'ui:widget': props => {
      return (
        <PasswordStrengthMeter
          passwordText={''}
          strength={strength}
          onChange={event => props.onChange(event.target.value)}
        />
      )
    }
  }
}

const strength = {
  0: 'Low',
  1: 'Low',
  2: 'Medium',
  3: 'Good',
  4: 'Strong'
}
const formData = {
  uuid: ''
}
export default class InviteCompletionPage extends React.Component {
  state = {
    message: false,
    messageCode: '',
    showModal: false,
    schema: schema,
    uiSchema: uiSchema,
    prevAccountName: '',
    suggestedAccountName: '',
    formData
  }
  acctId = AppStorage.get('acctId')

  componentWillMount () {
    const router = this.context.router

    if (window.location.hash.indexOf('invite') > -1 || window.location.hash.indexOf('login') > -1) {
      this.preFillUserDetails(router.location.query)
    }
  }

  preFillUserDetails (queryParamObject) {
    formData.companyName = queryParamObject.company
    formData.accountName = queryParamObject.account
    formData.email = queryParamObject.email
    formData.accountId = queryParamObject.accountId
    // formData.inviteId = paramObject.inviteId
    const uiSchema = this.state.uiSchema
    const disable = { 'ui:disabled': true }
    uiSchema.companyName = disable
    uiSchema.accountName = disable
    uiSchema.email = disable
    formData.uuid = queryParamObject.inviteId
    this.setState({ formData })
  }

  onSubmit = ({ formData }) => {
    delete formData.companyName
    delete formData.accountName
    apis.service
      .replace(apis.getInviteCompletionEndPoint(formData.uuid, formData.accountId), {
        body: JSON.stringify(formData)
      })
      .then(resp => (window.location = '#/login'))
      .catch('error => { throw error }')
  }

  onChange = ({ formData }) => {}

  render () {
    const className = `${css.main} container signin-container`
    return (
      <div className={className}>
        <WingsForm
          name="InviteCompletion"
          ref="form"
          schema={this.state.schema}
          uiSchema={this.state.uiSchema}
          formData={this.state.formData}
          onSubmit={this.onSubmit}
          onChange={this.onChange}
          showErrorList={false}
        >
          <div>
            <button type="submit" className="btn btn-primary btn-block">
              Sign Up
            </button>
          </div>
        </WingsForm>
      </div>
    )
  }
}

InviteCompletionPage.contextTypes = {
  router: React.PropTypes.object.isRequired
}



// WEBPACK FOOTER //
// ../src/containers/InviteCompletionPage/InviteCompletionPage.js