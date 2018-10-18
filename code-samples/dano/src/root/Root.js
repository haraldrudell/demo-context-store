/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, {Fragment} from 'react'
import App from 'App'
import {store} from 'storeutil/store'
import {Provider} from 'react-redux'
import CssBaseline from '@material-ui/core/CssBaseline'
import {injectGlobal} from 'styled-components'
import 'typeface-roboto'

injectGlobal`
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
}
`
export default () =>
  <Fragment>
    <CssBaseline />
    <Provider store={store}>
      <App />
    </Provider>
  </Fragment>
