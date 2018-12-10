/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, { memo } from 'react'
import styled from 'styled-components'
import { plainStore, connect } from 'allstore'
import { createPastesValue } from './Store'

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
const keyAction = e => {
  const text = e.target.value
  const {format, id} = this.props
  const state = plainStore.getState()
  state.pastes = state.pastes.set(id, createPastesValue({text, format}))
  plainStore.notify()
}

export default connect(({pastes}, {id}) => pastes.get(id).toJS())(memo(({text, format, id}) =>
  <Controls>
    <label>id: {id} format: {format}</label>
    <textarea onChange={keyAction} value={text} />
  </Controls>
))
