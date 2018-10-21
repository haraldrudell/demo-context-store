/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, { Component, Fragment, Children, cloneElement } from 'react'
import {ThemeProvider} from 'styled-components'
import {SwitchProvider} from './ThemeContext'

export default class ThemeApplicator extends Component {
  constructor(props) {
    super(props)
    this.Empty = () => false

    // make setTheme action available
    const {initial} = props
    if (!initial) throw new Error('ThemeApplicator: no initial, did ThemeContext render?')
    initial.setTheme = this.setTheme.bind(this) // add this component's switch function

    // themeContext for SwitchProvider, themeValues for ThemeProvider (styled-components)
    const {theme, themes} = this.themeContext = initial
    this.themeValues = themes[theme].theme // values for current theme

    this.state = {theme} // state: id of current theme
  }

  setTheme(theme) { // id number 0…
    const {state: {theme: oldTheme}, themeContext} = this
    if (!((theme = +theme) >= 0) || theme === oldTheme) return // bad or same theme id
    const td = themeContext.themes[theme]
    if (!td) return // no such theme

    // switch to theme with id: theme
    themeContext.theme = theme // save current theme id in context
    this.themeContext = {...themeContext} // ensure a new object so that PureComponent works
    this.themeValues = td.theme // set styled components theme injected by ThemeProvider
    this.setState({theme}) // force redraw
  }

  render() {
    const {themeContext, themeValues, props: {children}} = this
    const {BodyStyle} = themeValues
    const BodyStyleComponent = BodyStyle || this.Empty

    return <Fragment>
      <SwitchProvider value={themeContext}>{/* inject context for the theme switcher */}
        <BodyStyleComponent />{/* apply theme styling to body element */}
        <ThemeProvider theme={themeValues}>{/* styled components theme provider */}
          <Fragment>{/* Fragment since ThemeProvider only supports a single child */}
            {Children.map(children, child => cloneElement(child))}
          </Fragment>
        </ThemeProvider>
        </SwitchProvider>
    </Fragment>
  }
}
