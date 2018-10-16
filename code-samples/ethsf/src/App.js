/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, { Component} from 'react'
import Data from 'data/Data'
import Typography from '@material-ui/core/Typography'
import styled from 'styled-components'

const Div = styled.div`
  padding: 1em
`

export default class App extends Component {
  render() {
    return <Div>
      <Typography variant='display1' align='center' gutterBottom>
        React with GraphQL over http/2
      </Typography>
      <Data />
    </Div>
  }
}
