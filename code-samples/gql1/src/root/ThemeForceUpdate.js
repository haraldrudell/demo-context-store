/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, { Component } from 'react'
import App from 'App'
import {ThemeProvider} from 'styled-components'
import {SwitchProvider, getThemeData} from './themer'

export default class Root extends Component {
  constructor(props) {
    super(props)

    // enable theme switching
    const themeData = this.themeData = getThemeData() // a new instance of theme data
    themeData.setTheme = this.setTheme.bind(this) // add this component's switch function
    const {theme, themes} = themeData
    this.themeValues = themes[theme].theme // values for current theme

    this.state = {theme} // id of current theme
  }

  setTheme(theme) {
    const {state: {theme: oldTheme}, themeData} = this
    if (!((theme = +theme) >= 0) || theme === oldTheme) return
    const td = themeData.themes[theme]
    if (!td) return
    console.log(`Root.setTheme: ${theme}`)
    this.themeValues = td.theme
    themeData.theme = theme
    this.setState({theme})
  }

  render() { // JssProvider can not have multiple children
    const {themeValues, themeData} = this
    const {BodyStyle} = themeValues

    return (
      <SwitchProvider value={themeData}>
        <BodyStyle />{/* theme styled for body element */}
        <ThemeProvider theme={themeValues}>{/* styled compionents theme provider */}
          <App />
        </ThemeProvider>
      </SwitchProvider>)
  }
}
