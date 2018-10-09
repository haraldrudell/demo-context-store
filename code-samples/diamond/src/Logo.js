/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React from 'react'
import styled from 'styled-components'

const LogoWrapper = styled.div`
padding: 10px
background-color: gray
display: inline-block
`
const Image = styled.img`
width: 160px
`
export default () =>
  <LogoWrapper>
    <Image src='/images/dws_logo.png' />
  </LogoWrapper>
