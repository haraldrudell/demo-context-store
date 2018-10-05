/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, { Component } from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import Error from 'errorx/Error'
import CircularProgress from '@material-ui/core/CircularProgress'

export default class Data extends Component {
  render() {
    return <Query query={gql`
      {
          hello
      }
      `}>
      {({ loading, error, data }) => {
        if (loading) return <CircularProgress />
        if (error) return <Error title='Data retrieval failed' e={error} />
        return <p>{data.hello}</p>
      }}
    </Query>
  }
}
