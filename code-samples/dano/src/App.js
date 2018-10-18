/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, { Component } from 'react'
import Logo from './Logo'
import Jobs from 'jobs/Jobs'
import DataArea from 'dataarea/DataArea'
import Grid from '@material-ui/core/Grid'
import styled from 'styled-components'

const GridMax = styled(Grid)`
&& {
  max-width: 10.5in
  margin: 0
}
`
export default class App extends Component {
  render() {
    return (
      <GridMax container direction='column' alignItems='center' spacing={40}>
        <Grid item><Logo /></Grid>
        <Grid item><Jobs /></Grid>
        <Grid item><DataArea /></Grid>
      </GridMax>
    )
  }
}
