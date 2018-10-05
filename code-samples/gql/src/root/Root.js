/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, {Fragment} from 'react'
import App from 'App'
import CssBaseline from '@material-ui/core/CssBaseline'
import {injectGlobal} from 'styled-components'
import { ApolloProvider } from 'react-apollo'
import ApolloClient from 'apollo-boost'

injectGlobal`
body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
    monospace;
}
`
const client = new ApolloClient({
  uri: 'https://localhost:3001/graphql',
})

export default () =>
  <Fragment>
    <CssBaseline />
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </Fragment>
