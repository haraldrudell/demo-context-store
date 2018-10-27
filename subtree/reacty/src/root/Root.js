/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import React, {Fragment} from 'react'
import App from 'App'
import {store} from 'storeutil'
import {Provider} from 'react-redux'
import CssBaseline from '@material-ui/core/CssBaseline'
import JssProvider from 'react-jss/lib/JssProvider'
import { create } from 'jss'
import { createGenerateClassName, jssPreset } from '@material-ui/core/styles'
import {createGlobalStyle} from 'styled-components'
import { getDomElement } from 'apputil'
import 'typeface-roboto'

// get a jss provider with a custom insertion point
const materialUIPointId = 'jss-insertion-point' // id for element in html
const insertionPointDomElement = getDomElement(materialUIPointId, 'Material-UI css insertion')
const generateClassName = createGenerateClassName()
const jss = create(jssPreset())
jss.options.insertionPoint = insertionPointDomElement // this inserts at this very element
const jssProps = {jss, generateClassName}

const BodyStyling = createGlobalStyle`
body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
  background-color: #fce5cd
}
`
export default () =>
  <JssProvider {...jssProps}>{/* JssProvider first so that Material-UI css has lower prioprity than styled components */}
    <Fragment>{/* Fragment since JssProvider only supports a single child */}
      <CssBaseline />{/* Material-UI normalize css reset */}
      <BodyStyling />{/* styled-components global styles */}
      <Provider store={store}>
        <App />
      </Provider>
    </Fragment>
  </JssProvider>
