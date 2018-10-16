/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, { Component} from 'react'
import Data from 'data/Data'
import Styling from 'data/Styling'
import Typography from '@material-ui/core/Typography'
import styled from 'styled-components'

const PageHeight = styled.div`
  display: grid
  grid-template-rows: 100vh auto auto
`
const Margins = styled.div`
  padding: 1em
  max-width: 8.5in
`

export default class App extends Component {
  render() {
    return (
    <PageHeight><Margins>
      <Typography variant='display1' align='center' gutterBottom>
        React with GraphQL over http/2
      </Typography>
      <Styling />
      <Data/>
    </Margins></PageHeight>
    )
  }
}
