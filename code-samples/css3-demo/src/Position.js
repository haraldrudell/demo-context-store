import React, {Component, Fragment} from 'react'
import styles from './Position.css'

export default class Position extends Component {
  static label = 'Position'
  render() {
    return <Fragment>
      <div className={styles.parent}>
        <div><div>1 static</div></div>
        <div><div style={{position: 'relative', top: 10, left: 10}}>2 relative</div></div>
        <div><div style={{position: 'absolute', top: 0}}>3 absolute</div></div>
        <div style={{position: 'relative'}}>relative<div style={{position: 'absolute', bottom: 0}}>4 absolute</div></div>
      </div>
      <ul>Position can be set to:
        <li>static (default): in order of the document flow</li>
        <li>absolute: relative to first non-static ancestor element</li>
        <li>fixed: relative to window</li>
        <li>relative: relative to its static position</li>
        <li>sticky: relative to scroll position, ie. relative or fixed</li>
        <li>initial: the default value</li>
        <li>inherit: the calue of the parent element</li>
      </ul>
      <ol>
        <li>static: below or to the right of previous element, or upper left of parent if first child</li>
        <li>relative with top: 10 and left: 10: top, left, bottom, right are effective</li>
        <li>absolute with top: 0: at top of page. Note that the absolute div is sized to content</li>
        <li>absolute with parent position: relative: top, bottom, left, right are calculated relative to the non-static parent: here bottom: 0.</li>
      </ol>
    </Fragment>
  }
}
