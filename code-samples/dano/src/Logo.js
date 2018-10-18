/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React from 'react'
import styled, {keyframes} from 'styled-components'
import logo from './logo.svg'

const rotate360 = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`
const LogoElement = styled.img`
width: 100px
animation: ${rotate360} infinite 20s linear;
`
export default () => <LogoElement src={logo} alt="React logo" />
