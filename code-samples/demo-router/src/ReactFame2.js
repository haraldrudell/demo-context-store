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
#root {
  min-height: 100%;
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
display: flex;
flex-direction: column;
align-items: center;
div:nth-child(1) {
  font: bolder 50pt 'Blade Runner';
  color: red;
  margin-bottom: 10vh;
  text-shadow: 0px 1px 4px #23430C;
}
div:nth-child(2) {
  font: bolder 50pt Arial;
}
div:nth-child(3), div:nth-child(5) {
  font: bolder 50pt 'Baloo Tamma';/*Arial, Helvetica, sans-serif*/
  animation: ${pinkTones} 8s linear infinite;
}
div:nth-child(4) {
  font: bolder 32pt Arial;
}
div {
  margin-bottom: 24px;
}
`
const Margin = styled.div`
padding-top: 10vh
`
export default () =>
  <Margin>
    <GlobalStyle />
    <TheText>
      <div>
        react<br/>
        fame
      </div>
      <div>Hire</div>
      <div>Harald Rudell</div>
      <div>Node Go React Java</div>
      <div>harald.rudell@gmail.com</div>
    </TheText>
  </Margin>
