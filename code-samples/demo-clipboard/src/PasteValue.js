/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { plainStore, connect } from 'allstore'
import { createPastesValue, defaultPastesValue } from './Store'

const Controls = styled.div`
display: flex;
flex-direction: column;
> label {
  margin-bottom: 15px;
}
> textarea {
  font-size: 15pt;
  width: 30em;
  height: 5em;
}
`
class PasteValue extends PureComponent {
  handleUpdate = e => {
    const text = e.target.value
    const {format, id} = this.props
    const state = plainStore.getState()
    state.pastes = state.pastes.set(id, createPastesValue({text, format}))
    plainStore.notify()
  }

  deleteAction = e => {
    const {id} = this.props
    const state = plainStore.getState()
    state.pastes = state.pastes.delete(id)
    plainStore.notify()
  }

  render() {
    const {text, format, id} = this.props
    return <Controls>
      <label>id: {id} format: {format}&emsp;<button onClick={this.deleteAction}>Delete</button></label>
      <textarea onChange={this.handleUpdate} value={text} />
    </Controls>
  }
  static mapStateToProps = ({pastes}, {id}) => (pastes.get(id) || defaultPastesValue()).toJS()
}
export default connect(PasteValue.mapStateToProps)(PasteValue)
