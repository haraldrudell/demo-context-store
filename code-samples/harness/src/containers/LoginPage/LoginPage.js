import React from 'react'
// import Form from 'react-jsonschema-form'
import apis from 'apis/apis'
import plusBasicAuth from 'fetch-plus-basicauth'
import { WingsForm, AppStorage, Utils } from 'components'
import { Tracker } from 'utils'

const schema = {
  type: 'object',
  required: ['login', 'password'],
  properties: {
    login: { type: 'string', format: 'email', title: 'Email', default: '' },
    password: { type: 'string', title: 'Password', default: '' },
    remember: { type: 'boolean', title: 'Remember Me', default: false }
  }
}

const uiSchema = {
  login: { 'ui:placeholder': 'email@domain.com' },
  password: { 'ui:widget': 'password', 'ui:placeholder': 'Enter your password' }
}

const getLoginEndPoint = () => {
  return '/users/login'
}
const log = type => {} // console.log.bind(console, type)

export default class LoginPage extends React.Component {
  state = {
    error: false,
    unknownError: false,
    apiDownError: false,
    formData: {},
    submitting: false
  }
  // redirectAfterLogin =(accountId) => {return `/account/${accountId}/pipelines` }
  redirectAfterLogin = accountId => '/dashboard'
  isQuickLogin = false

  componentWillMount () {
    this.clearLoginData()
    this.hasRememberUser()
    const router = this.context.router
    if (window.location.hash.indexOf('login?') > -1) {
      this.preFillUserDetails(router.location.query)
    }
    // url param to allow login with email & psw without using UI (for faster UI tests)
    if (window.location.href.indexOf('?quickLogin') > 0) {
      const arr = window.location.href.split('|') // #/login/quickLogin|email|pass|redirect
      this.redirectAfterLogin = () => '/' + arr[arr.length - 1]
      this.onSubmit({ formData: { login: arr[arr.length - 3], password: arr[arr.length - 2] } })
      this.isQuickLogin = true
    }
  }

  preFillUserDetails (queryParamObject) {
    const formData = Utils.clone(this.state.formData)
    formData.login = queryParamObject.email
    this.setState({ formData })
  }

  componentDidMount () {}

  clearLoginData () {
    Utils.clearLoginData()
  }

  updateBugmuncherOptions = email => {
    /* if (window.wingsBugmuncherOptions && bugmuncher) {
      window.wingsBugmuncherOptions['prefill_email'] = email
      bugmuncher.set_options(window.wingsBugmuncherOptions)
    }*/
  }

  postAuth = res => {
    const router = this.context.router
    const location = this.props.location
    let loginSuccessful
    this.clearLoginData()

    if (res.resource) {
      if (res.resource.token) {
        // Login successfully!
        const { token, email, uuid } = res.resource

        AppStorage.set('token', token)
        AppStorage.set('email', email)
        AppStorage.set('uuid', uuid)

        AppStorage.remove('appId')
        AppStorage.remove('env')
        apis.service.ensureBearerToken(token)

        Tracker.setUser(email)
        Tracker.log('LoginPage_postAuth_success')
        this.updateBugmuncherOptions(email)

        loginSuccessful = true
      } else {
        console.log('Auth disabled!!')
        AppStorage.set('token', 'No Auth')
      }

      if (Array.isArray(res.resource.accounts)) {
        const acct = res.resource.accounts[0]
        if (acct) {
          AppStorage.set('acctId', acct.uuid)
        }
      }
    }

    if (loginSuccessful && /redirect=/.test(window.location.href)) {
      window.location.href = window.location.href.split('redirect=')[1]
      return
    }

    const previousActiveUrl = Utils.getActiveUrl()

    if (loginSuccessful && previousActiveUrl) {
      Utils.clearActiveUrl()
      // TODO: Edge case: User got kicked out from account A, but login again under account B
      router.replace(previousActiveUrl)
    } else {
      if (location.state && location.state.nextPathname) {
        router.replace(location.state.nextPathname)
      } else {
        const accountId = AppStorage.get('acctId')
        router.replace(this.redirectAfterLogin(accountId))
      }
    }
  }

  hasRememberUser () {
    if (AppStorage.has('username')) {
      const user = AppStorage.get('username')
      schema.properties.login.default = user
      schema.properties.remember.default = true
    } else {
      schema.properties.login.default = ''
      schema.properties.remember.default = false
    }
  }

  doRememberUser (formData) {
    if (formData.remember) {
      AppStorage.set('username', formData.login)
    } else {
      AppStorage.remove('username')
    }
  }

  onSubmit = ({ formData }) => {
    const _basicAuth = plusBasicAuth(formData.login, formData.password)
    apis.service.addMiddleware(_basicAuth)
    this.setState({ formData, submitting: true })

    apis.service
      .list(getLoginEndPoint())
      .then(res => {
        this.setState({ submitting: false })
        apis.service.removeMiddleware(_basicAuth)
        this.doRememberUser(formData)
        this.postAuth(res)
      })
      .catch(error => {
        this.setState({ submitting: false })
        apis.service.removeMiddleware(_basicAuth)
        if (error && error.message === 'Failed to fetch') {
          this.setState({ apiDownError: true })
        }

        if (error.status && error.status === 401) {
          this.setState({ error: true })
        } else {
          this.setState({ unknownError: true })
          throw error
        }
      })
  }

  onForgotPswClick = () => {
    const router = this.context.router
    router.replace('/forgot-password')
  }

  render () {
    const { signupUrl = 'https://harness.io/contact' } = window

    if (this.isQuickLogin) {
      return null
    }
    return (
      <div className="signin-container">
        <WingsForm
          name="Login"
          ref="form"
          schema={schema}
          uiSchema={uiSchema}
          onChange={log('changed')}
          formData={this.state.formData}
          onSubmit={this.onSubmit}
          onError={log('errors')}
        >
          <div className="forgot-psw" onClick={this.onForgotPswClick}>
            Forgot Password?
          </div>
          {this.state.error && <p className="error-mssg">Either Login or Password is incorrect. Please try again. </p>}
          {this.state.unknownError && <p className="error-mssg">Failed to login. Please contact Harness Support.</p>}
          {this.state.apiDownError && <p className="error-mssg">(The server might be down.)</p>}

          <div>
            <button type="submit" className="btn btn-primary btn-block" disabled={this.state.submitting}>
              Sign in
            </button>
          </div>
          <div className="__signupText">Or send us a request for....</div>

          <a href={signupUrl} className="__signupLink">
            EARLY ACCESS
          </a>

          {this.state.submitting && (
            <div className="__spinner">
              <span className="wings-spinner" />
            </div>
          )}
        </WingsForm>
      </div>
    )
  }
}

LoginPage.contextTypes = {
  router: React.PropTypes.object.isRequired
}



// WEBPACK FOOTER //
// ../src/containers/LoginPage/LoginPage.js