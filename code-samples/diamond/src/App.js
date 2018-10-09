/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, { Component } from 'react'
import Logo from './Logo'
import Jobs from 'jobs/Jobs'
import DataArea from 'dataarea/DataArea'
import styled from 'styled-components'

const AppWrapper = styled.div`
padding-top: 10px
text-align: center
`
const AppLogo = styled.div``

const JobsPad = styled.div`
padding-top: 10px
`

export default class App extends Component {
  render() {
    return (
      <AppWrapper>
        <AppLogo><Logo /></AppLogo>

        {/* get existing jobs/simulations, their names, ids, and results
        (for this exercise all results will be images) */}
        <JobsPad><Jobs /></JobsPad>

        {/* area below for results or input form */}
        <DataArea />
      </AppWrapper>
    )
  }
}
