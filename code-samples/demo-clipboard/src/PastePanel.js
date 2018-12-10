/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { createPastesValue } from './Store'
import { plainStore } from 'allstore'

const Controls = styled.div`
display: flex;
flex-direction: column;
> * {
  margin-bottom: 24px;
}
div label {
  display: block;
}
`
export default class PastePanel extends PureComponent {
  static textPlain = 'text/plain'
  state = {types: [PastePanel.textPlain], type: PastePanel.textPlain}

  pasteAction = e => {
    e.preventDefault()
    const {clipboardData: cd} = e
    const {type: format} = this.state
    const text = cd.getData(format)
    const state = plainStore.getState()
    state.pastes = state.pastes.set(state.nextId++, createPastesValue({text, format}))
    plainStore.notify()
  }

  formatAction = e => {
    const {clipboardData: cd} = e
    const {types} = cd
    const type = types[0]
    this.setState({types, type})
    e.preventDefault()
  }

  changeAction = () => {}

  selectFormatAction = e => this.setState({type: e.target.value})

  render() {
    const {type, types} = this.state
    return <Controls>
      <label><div>Paste here to update available clipboard formats:</div>
        <input value='' onChange={this.changeAction} onPaste={this.formatAction} />
      </label>
      <div>{types.map((t, i) => {
        const id = `formatid${i}`
        const ps = {type: 'radio', name: 'format', id, value: t, checked: t === type, onChange: this.selectFormatAction}
        return <label key={i}><input {...ps} /> {t}</label>
      })}</div>
      <label><div>Paste here to create a new paste-value:</div>
        <input value='' onChange={this.changeAction} onPaste={this.pasteAction} />
      </label>
    </Controls>
  }
}
