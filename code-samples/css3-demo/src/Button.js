import React, {Component} from 'react'
//import styles from './Button.css'

export default class Button extends Component {
  click = e => this.props.setActiveTab(this.props.text)
  render() {
    const {text, state} = this.props
    return (
      <button disabled={state} onClick={this.click}>{text}</button>)
  }
}
