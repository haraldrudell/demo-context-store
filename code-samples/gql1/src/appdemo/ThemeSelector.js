/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, { PureComponent, Fragment } from 'react'

import { withThemeData } from 'apptheming'

class ThemeSelector extends PureComponent {
  switchTheme = this.switchTheme.bind(this) // TODO create-react-app does not have babel 7 function-bind transform: ::this.switchTheme

  switchTheme(e) {
    const {themeData} = this.props
    if (!themeData) return // ThemeContext not in component tree: ignore
    const {setTheme} = themeData
    setTheme(+e.target.value)
  }

  render() {
    const {themeData} = this.props
    if (!themeData) return <p>Error: themeData not available, did ThemeContext render?</p>
    const {theme, themes} = themeData
    const {name: nameNow} = themes[theme]
    const {name, value} = themes[(theme + 1) % themes.length] // next theme

    return <Fragment>
      <p>Current theme: {nameNow}</p>
      <button value={value} onClick={this.switchTheme} key={value}>Switch to {name}</button>
    </Fragment>
  }
}

export default withThemeData(ThemeSelector)
