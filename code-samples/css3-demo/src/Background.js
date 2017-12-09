/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, {Component} from 'react'
import styles from './Background.css'

if (!Object.keys(styles).length) throw new Error(`Background.css: missing local styles`)

export default class Background extends Component {
  render() {
    const {children} = this.props
    return (
      <div className={styles.background}>
        {children}
      </div>)
  }
}
