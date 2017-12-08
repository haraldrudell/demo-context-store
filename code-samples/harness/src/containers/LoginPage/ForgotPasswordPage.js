import React from 'react'
// import Form from 'react-jsonschema-form'
import apis from 'apis/apis'
import { Link } from 'react-router'
// import plusBasicAuth from 'fetch-plus-basicauth'
import { WingsForm, AppStorage } from 'components'
import { Tracker } from 'utils'

const schema = {
  type: 'object',
  required: ['email'],
  properties: {
    email: { type: 'string', format: 'email', title: 'Email', default: '' }
  }
}

const uiSchema = {
  email: { 'ui:placeholder': 'email@domain.com' }
}

// const getLoginEndPoint = () => {
//   return '/users/login'
// }

export default class ForgotPasswordPage extends React.Component {
  state = {
    error: false,
    unknownError: false,
    isSubmitted: false
  }
  redirectAfterLogin = '/dashboard'

  componentWillMount () {}

  componentDidMount () {}

  postAuth = res => {
    const router = this.context.router
    const location = this.props.location

    if (res.resource) {
      if (res.resource.token) {
        const _token = res.resource.token
        AppStorage.set('token', _token)
        AppStorage.remove('appId')
        AppStorage.remove('env')
        apis.service.ensureBearerToken(_token)

        Tracker.setUser(res.resource.email)
        Tracker.log('LoginPage_postAuth_success')
      } else {
        console.log('Auth disabled!!')
        AppStorage.set('token', 'No Auth')
      }

      if (Array.isArray(res.resource.accounts)) {
        const _acct = res.resource.accounts[0]
        if (_acct) {
          AppStorage.set('acctId', _acct.uuid)
        }
      }
    }

    if (location.state && location.state.nextPathname) {
      router.replace(location.state.nextPathname)
    } else {
      router.replace(this.redirectAfterLogin)
    }
  }

  onSubmit = async ({ formData }) => {
    try {
      await apis.resetPassword({ email: formData.email })
      this.setState({ isSubmitted: true })
    } catch (e) {
      if (e && e.status === 400) {
        this.setState({ error: 'Invalid request: Email doesn\'t exist' })
      }
    }
  }

  render () {
    return (
      <div>
        <div className="signin-container">
          {this.state.isSubmitted ? (
            <div className="submit-msg">An email has been sent to you with a link to reset your password.</div>
          ) : (
            <WingsForm name="Forgot Password" ref="form" schema={schema} uiSchema={uiSchema} onSubmit={this.onSubmit}>
              <div className="forgot-psw" onClick={this.onForgotPswClick}>
                Forgot Password?
              </div>

              {this.state.unknownError && <p className="error-mssg">Request failed. Please contact Harness Support.</p>}
              {this.state.error && <p className="error-mssg">{this.state.error}</p>}

              <div>
                <button type="submit" className="btn btn-primary btn-block">
                  Submit
                </button>
              </div>
              <div className="link-secondary">
                Back to{' '}
                <Link to="/login" title="Sign In">
                  Sign in
                </Link>
              </div>
            </WingsForm>
          )}
        </div>
      </div>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/LoginPage/ForgotPasswordPage.js