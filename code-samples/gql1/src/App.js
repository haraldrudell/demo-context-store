/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, { Component } from 'react'
import {Grid, ThemeSelector} from 'apputil'
import Typography from '@material-ui/core/Typography'
import styled from 'styled-components'

const Typography2 = styled(Typography)`
color: blue
`
const containerStyles = `
max-width: 10.5in
margin: 0
background-color: #fce5cd
`
const gridProps = { // props for Material-UI Grid component
  containerStyles,
  direction: 'column',
  alignItems: 'center',
  spacing: 40,
}
export default class App extends Component {
  render() {
    console.log('App.render')

    return <Grid {...gridProps}>
      <p>Logo goes here</p>
      <Typography2>Blue text</Typography2>
      <ThemeSelector/>
    </Grid>
  }
}
