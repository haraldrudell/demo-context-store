/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, {Fragment} from 'react'
import {render} from 'react-dom'
import App from './App'
import CssBaseline from '@material-ui/core/CssBaseline'
import 'typeface-roboto'
import { Provider } from 'react-redux'
import {store} from './store'

render(
  <Fragment>
    <CssBaseline />
    <Provider store={store}>
      <App />
    </Provider>
  </Fragment>, document.getElementById('root'))
