/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, { Fragment } from 'react'
import {getDomElement, } from 'apputil'
import { ThemeContext } from 'themeutil'
import CssBaseline from '@material-ui/core/CssBaseline'
import JssProvider from 'react-jss/lib/JssProvider'
import { createGenerateClassName, jssPreset } from '@material-ui/core/styles'
import { create } from 'jss'
import App from 'App'
import './fonts.css'

// get a jss provider with a custom insertion point
const materialUIPointId = 'jss-insertion-point' // id for element in html
const insertionPointDomElement = getDomElement(materialUIPointId, 'Material-UI css insertion')
const generateClassName = createGenerateClassName()
const jss = create(jssPreset())
jss.options.insertionPoint = insertionPointDomElement // this inserts at this very element
const jssProps = {jss, generateClassName}

export default () =>
  <JssProvider {...jssProps}>{/* JssProvider first so that Material-UI css has lower prioprity than styled components */}
    <Fragment>{/* Fragment since JssProvider only supports a single child */}
      <CssBaseline />{/* Material-UI normalize css reset */}
      <ThemeContext>{/* Provide context to theme selector, render-once-css from themes */}
        <App />{/* redrawn on theme switching */}
      </ThemeContext>
    </Fragment>
  </JssProvider>
