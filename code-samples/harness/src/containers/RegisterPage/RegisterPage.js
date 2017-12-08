import React from 'react'
import apis from 'apis/apis'
import { WingsForm, Utils, PasswordStrengthMeter } from 'components'
import { Link } from 'react-router'
import css from './RegisterPage.css'
import RegisterModal from './RegisterModal'
import PolicyModal from './PolicyModal'

const schema = {
  type: 'object',
  required: ['name', 'email', 'password', 'companyName', 'accountName'],
  properties: {
    name: { type: 'string', title: 'Name', default: '' },
    email: { type: 'string', title: 'Email', default: '' },
    password: { type: 'string', title: 'Password', default: '', minLength: 4 },
    companyName: { type: 'string', title: 'Company Name', default: '', minLength: 1 },
    accountName: { type: 'string', title: 'Account Name', default: '', minLength: 1 }
  }
}

const strength = {
  0: 'Low',
  1: 'Low',
  2: 'Medium',
  3: 'Good',
  4: 'Strong'
}

const uiSchema = {
  name: { 'ui:placeholder': 'First and last name' },
  email: {
    'ui:placeholder': 'email@domain.com',
    'ui:help': ' ' // placeholder element for Email Error Message
  },
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

const log = type => console.log.bind(console, type)

const messages = {
  agreement: 'You must agree to the terms and conditions before register.',
  generic: 'Failed to Register. Please contact Harness Support.',
  '409': 'Email already registered.',
  '200': 'Email sent. Please check your email for further instructions.',
  '300': 'Password does not meet minimum of length 4.'
}

export default class RegisterPage extends React.Component {
  state = {
    message: false,
    messageCode: '',
    data: {},
    showModal: false,
    schema: schema,
    uiSchema: uiSchema,
    prevAccountName: '',
    suggestedAccountName: '',
    emailResentMessage: '',
    emailResentClass: 'hide',
    showPolicyModal: false
  }
  agreement = false
  checkAccountNameTimeout = null

  componentWillMount () {
    this.clearTokenMiddleWare()
  }

  clearTokenMiddleWare () {
    Utils.clearLoginData()
  }

  handleAgreementChange = e => {
    this.agreement = e.target.checked
  }

  onSubmit = ({ formData }, resend = false) => {
    if (!this.agreement) {
      this.setState({ message: true, messageCode: 'agreement', data: formData })
      return
    }
    this.setState({ message: false, messageCode: '', data: formData })

    const __subData = Utils.clone(formData)
    // __subData.accounts = [ { companyName: __subData.companyName, accountKey: __subData.accountName }]
    // delete __subData.accountName

    const body = JSON.stringify(__subData)
    if (resend) {
      if (formData !== null && formData.hasOwnProperty('email') && formData.email !== undefined) {
        apis.getResendEmailApi(formData.email).then(res => {
          this.setState({ emailResentMessage: 'Email has been sent again', emailResentClass: 'emailAlreadySent' })
        })
      }
    } else {
      apis.service
        .create(apis.getRegisterEndPoint(), { body })
        .then(res => {
          const router = this.context.router
          router.replace('/signup-thank-you/' + formData.email)
        })
        .catch(error => {
          if (error.status === 409) {
            this.setState({ message: true, messageCode: '409', data: formData })
          } else if (error.status === 300) {
            this.setState({ message: true, messageCode: '300', data: formData })
            throw error
          } else {
            this.setState({ message: true, messageCode: 'generic', data: formData })
            console.log('error')
            throw error
          }
        })
    }
  }

  checkAccountName = currentAccountName => {
    if (!currentAccountName) {
      return
    }
    clearTimeout(this.checkAccountNameTimeout)
    this.checkAccountNameTimeout = setTimeout(() => {
      apis.fetchSuggestedAccountName(currentAccountName).then(res => {
        const suggestedAccountName = res.resource
        const data = this.state.data
        data.accountName = suggestedAccountName
        if (currentAccountName !== suggestedAccountName) {
          this.setState({ data, suggestedAccountName, prevAccountName: currentAccountName })
        }
      })
    }, 500)
  }

  validateEmailTimer = null
  validateEmail = email => {
    clearTimeout(this.validateEmailTimer)
    this.validateEmailTimer = setTimeout(() => {
      apis.verifyEmail(email).then(res => {
        const emailFieldEl = Utils.queryRef(this.refs.form, '#root_email')
        const helpEl = emailFieldEl.parentElement.querySelector('.help-block')

        if (res && res.resource === false) {
          const alreadyRegistered = res.responseMessages.find(item => item.code === 'USER_ALREADY_REGISTERED')
          const domainNotAllowed = res.responseMessages.find(item => item.code === 'USER_DOMAIN_NOT_ALLOWED')
          if (alreadyRegistered && emailFieldEl) {
            helpEl.innerHTML = `<div id="ERR_MSG_USER_ALREADY_REGISTERED">That email address is already in use.</div>
                <div class="msg">Do you want to <a href="/#/login">sign in</a> instead?</div>`
          } else if (domainNotAllowed && emailFieldEl) {
            helpEl.innerHTML = '<div id="ERR_MSG_USER_DOMAIN_NOT_ALLOWED">Your email domain is not allowed.</div>'
          } else {
            helpEl.innerHTML = '<div id="ERR_MSG_INVALID_EMAIL">Please enter a valid email.</div>'
          }
          emailFieldEl.style.borderWidth = '2px'
          emailFieldEl.style.borderColor = 'red'
        }
        if (res && res.resource === true) {
          helpEl.innerHTML = ''
          emailFieldEl.style.borderWidth = '1px'
          emailFieldEl.style.borderColor = ''
        }
      })
    }, 1000)
  }

  onChange = ({ formData }) => {
    const prevEmail = Utils.getJsonValue(this, 'state.formData.email') || ''
    if (formData.email && formData.email !== prevEmail) {
      this.validateEmail(formData.email)
    }

    if (formData.companyName !== this.state.data.companyName) {
      this.setState({ data: formData, suggestedAccountName: '' }, () => {
        formData.accountName = formData.companyName
        this.checkAccountName(formData.accountName)
        this.setState({ data: formData })
      })
      return
    } else {
      const prevAccountName = Utils.getJsonValue(this, 'state.formData.accountName') || ''
      if (formData.accountName && formData.accountName !== prevAccountName) {
        this.checkAccountName(formData.accountName)
      }
    }
    this.setState({ data: formData, suggestedAccountName: '' })
  }

  onHideModal = () => {
    this.setState({ showModal: false })
  }

  onError = error => {
    const passIndex = error.findIndex(item => item.property === 'instance.password')
    error[passIndex].stack = 'Password does not meet minimum of length 4'
  }

  showPolicyModal = () => {
    this.setState({ showPolicyModal: true })
  }
  hidePolicyModal = () => {
    this.setState({ showPolicyModal: false })
  }
  render () {
    const className = `${css.main} container signin-container`
    return (
      <div className={className}>
        <WingsForm
          name="Register"
          ref="form"
          schema={this.state.schema}
          uiSchema={this.state.uiSchema}
          formData={this.state.data}
          onSubmit={this.onSubmit}
          onChange={this.onChange}
          onError={log('error')}
          showErrorList={false}
        >
          {this.state.prevAccountName &&
            this.state.suggestedAccountName &&
            <div>
              Account <strong>"{this.state.prevAccountName}" </strong>
              already existed! Suggested Account Name: <strong>"{this.state.suggestedAccountName}".</strong>
            </div>}
          <div className="checkbox">
            <label>
              <input
                id="root_termsofservice"
                type="checkbox"
                value={this.agreement}
                onChange={this.handleAgreementChange}
              />
              I agree with evaluation&nbsp;
              <a onClick={this.showPolicyModal}>terms and policy</a>.
            </label>
          </div>
          {this.state.message &&
            <p className="error-mssg">
              {messages[this.state.messageCode]}
            </p>}
          <br />
          <div>
            <button type="submit" className="btn btn-primary btn-block">
              CONTINUE
            </button>
          </div>
          <div className="link-secondary">
            Already have an Account?&nbsp;<Link to="/login" title="Sign In">
              Sign in
            </Link>
          </div>
        </WingsForm>

        <RegisterModal
          show={this.state.showModal}
          onHide={this.onHideModal}
          data={this.state.data}
          onSubmit={this.onSubmit}
          emailResentMessage={this.state.emailResentMessage}
          emailResentClass={this.state.emailResentClass}
        />
        <PolicyModal show={this.state.showPolicyModal} onHide={this.hidePolicyModal} />
      </div>
    )
  }
}

RegisterPage.contextTypes = {
  router: React.PropTypes.object.isRequired
}



// WEBPACK FOOTER //
// ../src/containers/RegisterPage/RegisterPage.js