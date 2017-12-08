import React from 'react'
// import Form from 'react-jsonschema-form'
import apis from 'apis/apis'
// import plusBasicAuth from 'fetch-plus-basicauth'
import { WingsForm, AppStorage } from 'components'
import { Tracker } from 'utils'
import { Link } from 'react-router'

const schema = {
  type: 'object',
  required: ['password'],
  properties: {
    password: { type: 'string', title: 'New Password', default: '' }
  }
}

const uiSchema = {
  password: { 'ui:widget': 'password', 'ui:placeholder': 'Password' }
}

// const getLoginEndPoint = () => {
//   return '/users/login'
// }

export default class ResetPasswordPage extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }
  state = {
    error: false,
    unknownError: false,
    isSubmitted: false
  }
  redirectAfterLogin = '/dashboard'
  token = ''

  componentWillMount () {}

  componentDidMount () {
    const router = this.context.router
    this.token = ''
    if (router.params && router.params.params) {
      this.token = router.params.params
    }
  }

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

  onSubmit = ({ formData }) => {
    apis.resetPassword({ password: formData.password }, this.token).then(res => {
      // After submit, show a message
      this.setState({ isSubmitted: true })
    })
  }

  render () {
    return (
      <div>
        <div className="signin-container">
          {this.state.isSubmitted ? (
            <div>
              <div className="submit-msg">Your password has been changed.</div>
              <Link to="/login" className="submit-msg">
                Click here to Login
              </Link>
            </div>
          ) : (
            <WingsForm name="Reset Password" ref="form" schema={schema} uiSchema={uiSchema} onSubmit={this.onSubmit}>
              <div className="forgot-psw" onClick={this.onForgotPswClick}>
                Forgot Password?
              </div>

              {this.state.unknownError && <p className="error-mssg">Request failed. Please contact Harness Support.</p>}

              <div>
                <button type="submit" className="btn btn-primary btn-block">
                  Submit
                </button>
              </div>
            </WingsForm>
          )}
        </div>
      </div>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/LoginPage/ResetPasswordPage.js