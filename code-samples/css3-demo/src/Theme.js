/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import Themer from './Themer'

import React, {Component, Fragment} from 'react'
import styles from './ThemeText.css'
import './Theme.css'

if (!Object.keys(styles).length) throw new Error(`ThemeText.css: missing local styles`)

export default class Theme extends Component {
  static label = 'Theme'
  themes = ['theme-light', 'theme-dark']
  themer = new Themer(this.themes)
  reset = this.reset.bind(this)

  reset() {
    this.themer.setTheme(0)
    this.setTimer()
  }

  setTimer() {
    setTimeout(() => this.themer.setTheme(1), 1e3)
  }

  componentDidMount() {
    this.setTimer()
  }

  render() {
    const {themer, themes} = this
    const activeTheme = themer.getActiveTheme()
    const activeThemeName = themes[activeTheme]
    return <Fragment>
      <button onClick={this.reset}>Try Again</button>
      <div className={styles.p}>
        <p>The text here is themed.</p>
        <p>The page starts out with a light theme, black text on white background.</p>
        <p>After 1 second, a cascading style sheets class is replaced on the body element.
          These classes contains css variables with different values. The change in variable values affects the text elements, changing their colors to a dark theme, white text on black background.</p>
        <p>The change in colors happens without a React redraw, so the indicator below will not change</p>
        <p>{`Active theme: ${activeTheme}: ${activeThemeName}`}</p>
      </div>
      </Fragment>
  }
}
