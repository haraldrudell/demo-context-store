/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, { Component, Fragment, Children, cloneElement } from 'react'
import {ThemeProvider} from 'styled-components'
import {SwitchProvider} from './themeContext'
import {getThemeData} from './themeData'

export default class ThemeApplicator extends Component {
  constructor(props) {
    super(props)

    // enable theme switching
    const themeData = this.themeData = getThemeData() // a new instance of theme data
    themeData.setTheme = this.setTheme.bind(this) // add this component's switch function
    const {theme, themes} = themeData
    this.themeValues = themes[theme].theme // values for current theme

    this.state = {theme} // id of current theme
  }

  setTheme(theme) { // id number 0…
    const {state: {theme: oldTheme}, themeData} = this
    if (!((theme = +theme) >= 0) || theme === oldTheme) return
    const td = themeData.themes[theme]
    if (!td) return
    this.themeValues = td.theme
    themeData.theme = theme
    this.setState({theme})
  }

  render() {
    const {themeValues, themeData, props: {children}} = this
    const {BodyStyle} = themeValues

    return (
    <SwitchProvider value={themeData}>{/* inject data for the theme switcher */}
      <BodyStyle />{/* apply theme styling to body element */}
      <ThemeProvider theme={themeValues}>{/* styled components theme provider */}
        <Fragment>{/* Fragment since ThemeProvider only supports a single child */}
          {Children.map(children, child => cloneElement(child))}
        </Fragment>
      </ThemeProvider>
    </SwitchProvider>)
  }
}
