/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React from 'react'
import ReactDOM from 'react-dom'
import Root from 'root/Root'
/*
import { create } from "jss";
import { createGenerateClassName, jssPreset } from "@material-ui/core/styles";

styled components has higher priority than jss:
https://github.com/styled-components/styled-components/issues/860
https://codesandbox.io/s/19wo1wjv3
const styleNode = document.createComment('insertion-point-jss')
document.head.insertBefore(styleNode, document.head.firstChild)

//const generateClassName = createGenerateClassName()
const jss = create(jssPreset())
jss.options.insertionPoint = 'insertion-point-jss'
*/

ReactDOM.render(<Root />, document.getElementById('root'))
