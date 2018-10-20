/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, { Fragment } from 'react'
import {getDomElement} from './getElement'
import CssBaseline from '@material-ui/core/CssBaseline'
import BodyFont from './roboto'
import ThemeApplicator from './ThemeApplicator'
import JssProvider from 'react-jss/lib/JssProvider'
import { createGenerateClassName, jssPreset } from '@material-ui/core/styles'
import { create } from 'jss'
import App from 'App'

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
      <BodyFont />{/* styled components global fonts: roboto */}
      <ThemeApplicator>{/* redraws itself when the theme is changed */}
        <App />{/* redrawn on theme switching */}
      </ThemeApplicator>
    </Fragment>
  </JssProvider>
