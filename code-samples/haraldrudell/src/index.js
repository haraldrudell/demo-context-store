/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import {createGlobalStyle} from 'styled-components'
import './bladeRunner.css'

const GlobalStyle = createGlobalStyle`
body, html {
  min-height: 100%
}
body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 15pt;
  background: radial-gradient(100% 100% at left 15% top 15%, #f2e5cd, #f9c7c7);
}`
ReactDOM.render(<><GlobalStyle /><App /></>, document.getElementById('root'))
