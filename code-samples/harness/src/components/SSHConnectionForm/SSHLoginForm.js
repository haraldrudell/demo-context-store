import React from 'react'
import WingsForm from '../WingsForm/WingsForm'
const schema = {
  'type': 'object',
  'required': ['username', 'password'],
  'properties': {
    'username': {
      'type': 'string',
      'title': 'User Name'
    },
    'password': {
      'type': 'string',
      'title': 'Password'
    }
  }
}

const uiSchema = {
  'password': {
    'ui:widget': 'password'
  },
  'ui:order': [ '*' ]
}

const formData = {
  'username': '',
  'password': ''
}

export default class SSHLoginForm extends React.Component {
  state = { formData }

  onLogin = () => {
    if ( this.validate()) {
      this.props.onTestClick(this.state.formData)
    }
  }

  validate () {
    const data = this.state.formData
    if ( data.username === '' && data.password === '') {
      return false
    } else if ( data.username === '') {
      return false
    } else if ( data.password === '') {
      return false
    } else {
      return true
    }

  }
  renderButton = () => {
    return (
      <div>
        <button className="btn btn-info" onClick={this.onLogin}>
              Test
        </button>

      </div>
    )
  }

  onChange =({ formData }) => {
    this.setState({ formData })
  }

  render () {
    return (
      <section>
        <WingsForm name="SSH Connection Test Form" ref="form"
          schema={schema} uiSchema={uiSchema}
          formData = {this.state.formData}
          onChange = {this.onChange}


        >
          <span>{this.state.errorMessage} </span>
          {this.renderButton()}


        </WingsForm>
      </section>
    )
  }
}



// WEBPACK FOOTER //
// ../src/components/SSHConnectionForm/SSHLoginForm.js