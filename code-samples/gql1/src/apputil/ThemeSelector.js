/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, { Component, Fragment } from 'react'
import {SwitchConsumer} from 'root/themer'

class ThemeSelector extends Component {
  switchTheme = this.switchTheme.bind(this) // TODO create-react-app does not have babel 7 function-bind transform: ::this.switchTheme

  switchTheme(e) {
    const {setTheme} = this.props.themeData
    setTheme(+e.target.value)
  }

  render() {
    const {theme, themes} = this.props.themeData
    const {name: n} = themes[theme]

    return <Fragment>
      <p>Current theme: {n}</p>{themes.map(({value, name}) =>
        <button value={value} onClick={this.switchTheme} key={value}>{name}</button>
    )}</Fragment>
  }
}

export default props => <SwitchConsumer>{t => <ThemeSelector {...props} themeData={t}/>}</SwitchConsumer>
