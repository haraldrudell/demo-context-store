/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, { PureComponent, createElement, Fragment } from 'react'

import ThemeApplicator from './ThemeApplicator'

export default class ThemeContext extends PureComponent {
  constructor(props) {
    super(props)
    let {themes} = props
    if (!Array.isArray(themes)) throw new Error('ThemeContext: themes prop not list of themes')

    // get themeData and render-once components
    const themeData = this.themeData = {
      theme: 0,
      themes: themes.map((themeObject, i) => ({...themeObject, value: i}))
    }
    this.renderOnceComponents = themeData.themes // traverse the theme array
      .map(themeEntry => themeEntry.theme) // get theme value
      .filter(theme => theme.Once) // only those that has a Once component
      .map(theme => theme.Once) // return that component
  }

  render() {
    const {themeData, renderOnceComponents, props: {children}} = this

    return <Fragment>
      {/* these rendered only once */}
      {renderOnceComponents.map((c, key) => createElement(c, {key}))}
      <ThemeApplicator initial={themeData}>{/* give themeData to applicator */}

        {/* re-rendered on theme switch */}
        {children}
      </ThemeApplicator>
    </Fragment>
  }
}
