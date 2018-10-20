/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, { PureComponent, Fragment } from 'react'
import {SwitchConsumer} from 'root'

class ThemeSelector extends PureComponent {
  switchTheme = this.switchTheme.bind(this) // TODO create-react-app does not have babel 7 function-bind transform: ::this.switchTheme

  switchTheme(e) {
    const {setTheme} = this.props.themeData
    setTheme(+e.target.value)
  }

  render() {
    const {theme, themes} = this.props.themeData
    const {name: nameNow} = themes[theme]
    const {name, value} = themes[(theme + 1) % themes.length] // next theme

    return <Fragment>
      <p>Current theme: {nameNow}</p>
      <button value={value} onClick={this.switchTheme} key={value}>Switch to {name}</button>
    </Fragment>
  }
}

export default props => <SwitchConsumer>{t => <ThemeSelector {...props} themeData={t}/>}</SwitchConsumer>
