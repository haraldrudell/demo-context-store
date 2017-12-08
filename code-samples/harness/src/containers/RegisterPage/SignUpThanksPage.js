import React from 'react'
import { UsersService } from 'services'

export default class SignUpThanksPage extends React.Component {
  state = {}

  resend = async email => {
    const { status } = await UsersService.resendVerificationEmail(email)

    if (status === 200) {
      this.setState({ message: 'A verification email has been sent again to your email address.' })
    } else {
      this.setState({ error: `Failed to resend verification. Status: ${status}` })
    }
  }

  render () {
    const { email } = this.props.routeParams
    const { message, error } = this.state

    return (
      <signup-thanks>
        <h1>Thanks for signing up with Harness!</h1>
        <p>Please check your email and click on the link we sent to finish the setup process.</p>
        {email && !message && !error &&
          <button onClick={() => this.resend(email)} className="btn btn-primary btn-block">RESEND EMAIL</button>}
        {message && <p className="message">{message}</p>}
        {error && <p className="error">{error}</p>}
      </signup-thanks>
    )
  }
}


// WEBPACK FOOTER //
// ../src/containers/RegisterPage/SignUpThanksPage.js