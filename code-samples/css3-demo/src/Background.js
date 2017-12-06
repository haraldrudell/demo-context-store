import React, {Component} from 'react'
import styles from './Background.css'

if (!Object.keys(styles).length) throw new Error(`Background.css: missing local styles`)

export default class Background extends Component {
  render() {
    const {children} = this.props
    return (
    <div className={styles.background}>
      <div className={styles.verticalMarginStop} />
      <div className={styles.leftRightMargins}>
        {children}
      </div>
      <div className={styles.verticalMarginStop} />
    </div>)
  }
}
