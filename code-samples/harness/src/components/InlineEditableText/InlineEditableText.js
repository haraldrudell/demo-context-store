import React from 'react'
import ReactDOM from 'react-dom'
import UIButton from '../UIButton/UIButton'
import css from './InlineEditableText.css'

export default class InlineEditableText extends React.Component {
  // static propTypes = {} // React.PropTypes
  state = {}
  lastValue = ''

  setEditMode = (el, flag) => {
    if (flag) {
      if (this.props.value) {
        el.innerHTML = this.props.value
      }
      el.setAttribute('contenteditable', 'true')
      el.onblur = () => {
        this.editDone(el)
      }
      el.focus()
      this.lastValue = el.textContent || el.innerText
    } else {
      el.onblur = null
      el.blur()
      el.removeAttribute('contenteditable')
    }
  }

  editDone = el => {
    this.setEditMode(el, false)

    if (this.props.onChange) {
      const newText = el.textContent || el.innerText
      if (newText === '') {
        // user cleared text => cancel edit (like ESC)
        el.innerHTML = (!this.props.allowEmpty && this.lastValue) || ''

        if (this.props.allowEmpty) {
          this.props.onChange()
        }
      } else if (newText !== this.lastValue) {
        this.props.onChange(newText)
      }
    }
  }

  onKeyUp = ev => {
    const targetEl = ev.target
    if (ev.keyCode === 27) {
      // can only handle ESC properly in onKeyUp (otherwise, it'll close Modal,...)
      ev.preventDefault()
      ev.stopPropagation()
      ev.nativeEvent.stopImmediatePropagation()
      this.setEditMode(targetEl, false)
      targetEl.innerHTML = this.lastValue
    }
    if (this.props.onKeyUp) {
      this.props.onKeyUp(targetEl.textContent || targetEl.innerText)
    }
  }

  onKeyPress = ev => {
    const targetEl = ev.target
    if (ev.key.toUpperCase() === 'ENTER') {
      // can only handle ENTER properly in onKeyPress
      ev.preventDefault()
      this.editDone(targetEl)
    }

    if (this.props.onKeyPress) {
      this.props.onKeyPress(targetEl.textContent || targetEl.innerText)
    }
  }

  onClick = ev => {
    const el = ReactDOM.findDOMNode(this.refs.text)
    this.setEditMode(el, true)
  }

  render () {
    return (
      <span className={css.main + ' ' + this.props.className} onClick={ev => this.onClick(ev)}>
        <span ref="text" className={css.text} onKeyUp={ev => this.onKeyUp(ev)} onKeyPress={ev => this.onKeyPress(ev)}>
          {this.props.children}
        </span>
        <UIButton icon="Edit" />
      </span>
    )
  }
}



// WEBPACK FOOTER //
// ../src/components/InlineEditableText/InlineEditableText.js