/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React from 'react'
import ReactDOM from 'react-dom'
import Root from 'root'
import {getDomElement} from 'apputil'

ReactDOM.render(<Root />, getDomElement('root', 'rendering React'))
