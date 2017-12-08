import React, { Component } from 'react'
import { ProgressBar } from 'react-bootstrap'
import ReactDom from 'react-dom'
import zxcvbn from 'zxcvbn'

export default class PasswordStrengthMeter extends Component {
  constructor (props) {
    super(props)
    this.handleInput = this.handleInput.bind(this)
    this.state = {
      resultScore: '',
      warning: '',
      suggestions: '',
      meterValue: ''
    }
  }

  handleInput (event) {
    event.preventDefault()
    let { strength } = this.props
    strength = (strength) ? strength : {
      0: 'Worst ☹',
      1: 'Bad ☹',
      2: 'Weak ☹',
      3: 'Good ☺',
      4: 'Strong ☻'
    }

    const password = ReactDom.findDOMNode(this.refs.password)
    // const text = ReactDom.findDOMNode(this.refs.passwordStrengthText)

    const val = password.value
    const result = zxcvbn(val)
    // Update the text indicator
    if (val !== '') {
      this.setState({
        meterValue: result.score,
        resultScore: strength[result.score],
        warning: result.feedback.warning,
        suggestions: result.feedback.suggestions
      })
    } else {
      this.setState({
        meterValue: '',
        resultScore: '',
        warning: '',
        suggestions: ''
      })
    }

    if (typeof this.props.onChange === 'function') {
      this.props.onChange(event)
    }
  }

  renderMeter () {
    const { meterValue, resultScore, warning, suggestions } = this.state

    if (resultScore === '') {
      return null
    }

    return (
      <div>
        <ProgressBar className="password-strength-meter" bsStyle="warning" min={0} max={4} now={meterValue} />
        <p className="password-strength-text" ref="passwordStrengthText">
          {resultScore &&
          'Password Strength = '}
          <strong>{resultScore}</strong><span className="feedback">{warning + ' ' + suggestions}</span>
        </p>
      </div>
    )
  }

  render () {

    return (
      <section>
        <input onInput={this.handleInput} type="password" name="password" id="password" ref="password" />
        {this.renderMeter()}
      </section>
    )
  }
}

PasswordStrengthMeter.propTypes = {
  passwordText: React.PropTypes.string,
  strength: React.PropTypes.object,
  onChange: React.PropTypes.func
}



// WEBPACK FOOTER //
// ../src/components/PasswordStrengthMeter/PasswordStrengthMeter.js