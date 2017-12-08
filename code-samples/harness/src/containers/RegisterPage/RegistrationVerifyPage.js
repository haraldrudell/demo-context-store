import React from 'react'
import apis from 'apis/apis'

export default class RegistrationVerifyPage extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  state = { message: 'Verifying Registration..' }

  verifyToken () {
    const parts = this.props.location.pathname.split('/')
    const token = parts[parts.length - 1]
    console.log(token)
    apis.service
      .list(apis.getRegisterVerifyEndPoint(token))
      .then(resp => {
        this.setState({ message: 'Registration Success.. ' })
        window.location = '#/login'
      })
      .catch(err => {
        window.location = '#/login'
        // this.setState({ message: 'Registration Failure.. ' })
        // throw err
      })
  }

  componentWillMount () {
    this.verifyToken()
  }

  render () {
    return (
      <div>
        <span style={{ margin: '50%' }}>{this.state.message}</span>
      </div>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/RegisterPage/RegistrationVerifyPage.js