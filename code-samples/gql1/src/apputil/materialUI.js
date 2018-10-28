/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import React from 'react'
import Typography from '@material-ui/core/Typography'
import styled from 'styled-components'
import {default as ButtonUI} from '@material-ui/core/Button'



export const Button = styled(ButtonUI)`
${props => (props.color === 'default' || !props.color) && props.theme.buttonDefault}
${props => props.color === 'primary' && props.theme.buttonPrimary}
${props => props.color === 'secondary' && props.theme.buttonSecondary}
`

const T = styled(Typography)`
  color: ${props => props.theme.color};
  ${props => props.theme.defaultFont}
`
const Body1 = styled(T)`
  ${props => props.theme.body1}
  margin-bottom: 16px;
`
export const Body = ({children}) =>
  <Body1 variant='body1' as='div' paragraph>
    {children}
  </Body1>

export const Body2 = ({children}) =>
  <T variant='body2' as='div'>
    {children}
  </T>

export const H1 = ({children}) =>
  <T variant='h1' gutterBottom>
    {children}
  </T>

export const H2 = ({children}) =>
  <T variant='h2' gutterBottom>
    {children}
  </T>

export const H3 = ({children}) =>
  <T variant='h3' gutterBottom>
    {children}
  </T>

export const H4 = ({children}) =>
<T variant='h4' gutterBottom>
  {children}
</T>

export const H5 = ({children}) =>
  <T variant='h5' gutterBottom>
    {children}
  </T>

export const H6 = ({children}) =>
<T variant='h6' gutterBottom>
  {children}
</T>

export const S1 = ({children}) =>
<T variant='subtitle1' gutterBottom>
  {children}
</T>

export const S2 = ({children}) =>
<T variant='subtitle2' gutterBottom>
  {children}
</T>
