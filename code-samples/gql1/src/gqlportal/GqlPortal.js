/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, { Fragment, PureComponent } from 'react'

import { withThemeData } from 'apptheming'
import { Button, Body } from 'appmaterial-ui'

class GqlPortal extends PureComponent {
  switchThemeAction = this.switchThemeAction.bind(this) // TODO create-react-app does not have babel 7 function-bind transform: ::this.switchTheme

  switchThemeAction(e) {
    const {themeData} = this.props
    if (!themeData) {
      console.error('GqlPortal.switchThemeAction: no themeData')
      return // ThemeContext not in component tree: ignore
    }
    const {value} = e.currentTarget // '1'
    const theme = +value // 1
    console.log(`GqlPortal.switchThemeAction: ${typeof theme}`, theme)
    const {setTheme} = themeData
    setTheme(+value)
  }

  render() {
    const {themeData} = this.props
    if (!themeData) return <p>Error: themeData not available, did ThemeContext render?</p>
    const {theme, themes} = themeData
    const {name: nameNow} = themes[theme]
    const {name, value} = themes[(theme + 1) % themes.length] // next theme

    return <Fragment>
      <Body>Current theme: {nameNow}</Body>
      <Button value={value} variant='contained' onClick={this.switchThemeAction}>
        Switch to {name}
      </Button>
    </Fragment>
  }
}

export default withThemeData(GqlPortal)
