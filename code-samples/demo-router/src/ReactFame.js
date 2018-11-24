/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React from 'react'
import styled, { keyframes, createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
body, html {
  height: 100%
}
body {
  background: radial-gradient(100% 100% at left 15% top 15%, #f2e5cd, #f9c7c7);
}`
const pinkTones = keyframes`
  from {
    color: hsl(0, 80%, 50%); // red
  }
  33% {
    color: black;
  }
  66% {
    color: hsl(280, 80%, 50%);
  }
  to {
    color: hsl(360, 80%, 50%);
  }
`
const TheText = styled.div`
width: 100%;
height: 2in;
display: flex;
flex-direction: column;
/*justify-content: center;*/
align-items: center
div:nth-child(even) {
  font: bolder 50pt 'Baloo Tamma';/*Arial, Helvetica, sans-serif*/
  animation: ${pinkTones} 8s linear infinite;
}
div:nth-child(1) {
  font: bolder 50pt Arial;
}
div:nth-child(3) {
  font: bolder 32pt Arial;
}
div {
  margin-bottom: 24px;
}
`
const Margin = styled.div`
height: 100%;
padding: 5em;
padding-top: 25%
`
export default () =>
  <Margin>
    <GlobalStyle />
    <TheText>
      <div>Hire</div>
      <div>Harald Rudell</div>
      <div>Node Go React Java</div>
      <div>harald.rudell@gmail.com</div>
    </TheText>
  </Margin>
