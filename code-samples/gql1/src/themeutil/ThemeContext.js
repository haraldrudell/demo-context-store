/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, { Component, createContext, cloneElement, Children, createElement, Fragment } from 'react'
import {getThemeData} from './themeData'
import ThemeApplicator from './ThemeApplicator';

export const {Provider: SwitchProvider, Consumer: SwitchConsumer} = createContext()

export default class ThemeContext extends Component {
  constructor(props) {
    super(props)

    // get themeData and render-once components
    const themeData = this.themeData = getThemeData() // a new instance of theme data
    this.renderOnceComponents = themeData.themes // traverse the theme array
      .map(themeEntry => themeEntry.theme) // get theme value
      .filter(theme => theme.Once) // only those that has a Once component
      .map(theme => theme.Once) // return that component
  }

  render() {
    const {themeData, renderOnceComponents, props: {children}} = this
    return <Fragment>
      {renderOnceComponents.map((c, key) => createElement(c, {key}))}
      <ThemeApplicator initial={themeData}>{/* give themeData to applicator */}
        {Children.map(children, child => cloneElement(child))}
      </ThemeApplicator>
  </Fragment>
  }
}
