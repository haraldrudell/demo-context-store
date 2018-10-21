/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, { Component, Fragment } from 'react'
import {Grid, Portal} from 'apputil'
import { ThemeSelector } from 'themeutil'
import Logo from './Logo'
import Clipboard from 'clipboard'

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
export default class App extends Component {
  render() {
    return <Fragment>
      <Portal>
        <ThemeSelector/>
        <Clipboard />
      </Portal>
      <Grid {...gridProps}>
        <Logo />
        <Clipboard />
        <ThemeSelector />
      </Grid>
    </Fragment>
  }
}
