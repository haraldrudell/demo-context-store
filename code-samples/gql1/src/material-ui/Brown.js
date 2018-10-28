/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React from 'react'
import Typography from '@material-ui/core/Typography'
import styled from 'styled-components'

const T = styled(Typography)`
color: brown
`
export default ({children}) =>
  <T paragraph>
    {children}
  </T>