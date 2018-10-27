/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React from 'react'
import TextField from '@material-ui/core/TextField'
import styled from 'styled-components'

const ListLoaderError = styled.div`
display: flex
justify-content: center
`
const ErrorWidth = styled.div`
width: 500px
`
export default ({e, text}) =>
  <ListLoaderError><ErrorWidth>
    <TextField value={e.message || 'error'} error fullWidth helperText={text} />
  </ErrorWidth></ListLoaderError>
