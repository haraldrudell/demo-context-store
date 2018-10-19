/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, { Component, Fragment } from 'react'
import ThemeSelector from 'apputil/ThemeSelector'
import Typography from '@material-ui/core/Typography'
import styled from 'styled-components'

const Typography2 = styled(Typography)`
color: blue
`
export default class App extends Component {
  render() {
    console.log('App.render')

    return <Fragment>
      <p>Does the default font have serif?</p>
      <Typography2>123</Typography2>
      <ThemeSelector/>
      </Fragment>
  }
}
