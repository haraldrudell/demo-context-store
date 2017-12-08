import React from 'react'
import Confirm from './Confirm'
import css from './TextInputModal.css'

export default class TextInputModal extends React.Component {
  state = {
    value: this.props.value
  }

  onConfirm = () => {
    this.props.onClose(this.props.id || 'textInputModal')
    this.props.onConfirm(this.state.value)
  }

  onClose = () => {
    this.props.onClose(this.props.id || 'textInputModal')
  }

  onTextChange = (ev) => {
    this.setState({ value: ev.target.value })
  }

  renderBody = () => {
    if (this.props.textarea === true) {
      return (
        <div>
          <textarea className={css.textarea} placeholder={this.props.placeholder || ''}
            defaultValue={this.props.value}
            onChange={ev => this.onTextChange(ev)}
          />
          <div className={css.desc}>{this.props.description}</div>
        </div>
      )
    } else {
      return (
        <div>
          <input className={css.txt} placeholder={this.props.placeholder || ''}
            defaultValue={this.props.value}
            onChange={ev => this.onTextChange(ev)}
          />
          <div className={css.desc}>{this.props.description}</div>
        </div>
      )
    }
  }

  render () {
    return (
      <Confirm
        visible={this.props.visible}
        onConfirm={this.onConfirm}
        onClose={this.onClose}
        body={this.renderBody()}
        confirmText={this.props.confirmText || 'Submit'}
        title={this.props.title || 'Input'}
      >
        <button style={{ display: 'none' }} />
      </Confirm>
    )
  }
}



// WEBPACK FOOTER //
// ../src/components/Confirm/TextInputModal.js