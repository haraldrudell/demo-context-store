/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, { Fragment } from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import BodyFont from './roboto'
import ThemeForceUpdate from './ThemeForceUpdate'
import JssProvider from 'react-jss/lib/JssProvider'
import { createGenerateClassName, jssPreset } from '@material-ui/core/styles'
import { create } from 'jss'

// get a jss provider with a custom insertion point
const materialUIPointId = 'jss-insertion-point'
const insertionPoint = document.getElementById(materialUIPointId)
if (insertionPoint == null) throw new Error(`Failed to find html element with id ${materialUIPointId} for Material-UI css insertion`)
const generateClassName = createGenerateClassName()
const jss = create(jssPreset())
jss.options.insertionPoint = insertionPoint // this inserts at this very element

export default () => // JssProvider first so that Material-UI css has lower prioprity than styled components
  <JssProvider jss={jss} generateClassName={generateClassName}>
    <Fragment>{/* Fragment since JssProvider only supports a single child */}
      <CssBaseline />{/* Material-UI normalize css reset */}
      <BodyFont />{/* styled componentys global fonts: roboto */}
      <ThemeForceUpdate />{/* redraws itself when the theme is changed */}
    </Fragment>
  </JssProvider>
