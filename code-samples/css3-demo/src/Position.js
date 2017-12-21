/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
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
      <div className={styles.text}>
        <p><strong>Position</strong> can be set to:</p>
        <dl>
          <dd>static (default)</dd><dt>in order of the document flow</dt>
          <dd>absolute</dd><dt>relative to first non-static ancestor element</dt>
          <dd>fixed</dd><dt>relative to window</dt>
          <dd>relative</dd><dt>relative to its static position</dt>
          <dd>sticky</dd><dt>relative to scroll position, ie. relative or fixed</dt>
          <dd>initial</dd><dt>the default value</dt>
          <dd>inherit</dd><dt>the calue of the parent element</dt>
        </dl>
        <p><strong>Box examples</strong> above:</p>
        <ol>
          <li>Child element with <strong>position: static</strong><div>The element is positioned below or to the right of previous element, or upper left of its parent if first child</div></li>
          <li>Child element with <strong>position: relative</strong>, top: 10 and left: 10<div>Top, left, bottom, right are effective</div></li>
          <li>Child element with <strong>position: absolute</strong>, top: 0<div>Positioned at top of page. Note that the absolute div is sized to content</div></li>
          <li>Child element with <strong>position: absolute</strong> and parent position: relative<div>Top, bottom, left, right are calculated relative to the non-static parent: here bottom: 0.</div></li>
        </ol>
      </div>
    </Fragment>
  }
}
