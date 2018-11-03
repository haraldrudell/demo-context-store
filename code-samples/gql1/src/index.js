/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React from 'react'
import ReactDOM from 'react-dom'

import { Root } from 'appmaterial-ui'
import { getDomElement } from 'apputil'
import { hue30react, evening } from 'appthemes'

import App from './App'
import 'fonts/fonts.css' // develoment: loads fonts using global css, production: does nothing

const themeList = {themes: [hue30react, evening]}

ReactDOM.render(<Root {...themeList}><App /></Root>, getDomElement('root', 'rendering React'))
