/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, { Fragment } from 'react'
import Typography from '@material-ui/core/Typography'
import styled from 'styled-components'

const Typography2 = styled(Typography)`
color: blue
`
const TypographyThemed = styled(Typography)`
color: ${props => props.theme.color}
`
export default () =>
  <Fragment>
    <Typography2>Always Blue text from Clipboard NIMP</Typography2>
    <TypographyThemed>Theme color</TypographyThemed>
  </Fragment>
