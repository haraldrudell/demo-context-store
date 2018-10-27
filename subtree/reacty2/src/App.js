/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import React from 'react'
import Logo from './Logo'
import {Jobs} from 'jobs'
import {DataArea} from 'dataarea'
import {Grid} from './apputil'

const containerStyles = `
max-width: 10.5in
margin: 0
`
const gridProps = { // props for Material-UI Grid component
  containerStyles,
  direction: 'column',
  alignItems: 'center',
  spacing: 40,
}
export default () =>
  <Grid {...gridProps}>
    <Logo />
    <Jobs />{/* list of clickable jobs */}
    <DataArea />{/* area below for results or input form */}
  </Grid>
