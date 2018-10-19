/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, {Fragment} from 'react'
import App from 'App'
import CssBaseline from '@material-ui/core/CssBaseline'
import {createGlobalStyle} from 'styled-components'
import JssProvider from 'react-jss/lib/JssProvider'
import { create } from 'jss'
import { createGenerateClassName, jssPreset } from '@material-ui/core/styles'
//import 'typeface-roboto'
import Typography from '@material-ui/core/Typography'
import styled from 'styled-components'

const Typography2 = styled(Typography)`
color: blue
`
const materialUIPointId = 'jss-insertion-point'
const insertionPoint = document.getElementById(materialUIPointId)
if (insertionPoint == null) throw new Error(`Failed to find html element with id ${materialUIPointId} for Material-UI css insertion`)

const generateClassName = createGenerateClassName()
/*
const jss = create({...jssPreset(),
//  insertionPoint, // DOM element reference - 181018 does not work
  insertionPoint: materialUIPointId, //  test element id - 181018 does not work
})
*/
const jss = create(jssPreset())
//jss.options.insertionPoint = materialUIPointId // this inserts by a comment with this text
jss.options.insertionPoint = insertionPoint // this inserts at this very element
/*
const BodyFont = createGlobalStyle`
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
}
`
*/
export default () => // must be a single wrapping DOM element
  <Fragment>
    <JssProvider jss={jss} generateClassName={generateClassName}>{/*
      <CssBaseline />
      <BodyFont />
      <App />*/}
      <Typography2>123</Typography2>
    </JssProvider>
  </Fragment>
