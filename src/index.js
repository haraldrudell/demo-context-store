/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import UseAllstoreTest from './UseAllstoreTest'

ReactDOM.render(!process.env.REACT_APP_TESTHOOK ? <App /> : <UseAllstoreTest />, document.getElementById('root'))
