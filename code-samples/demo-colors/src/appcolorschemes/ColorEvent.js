/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import React, { PureComponent, Fragment } from 'react'
import Color from 'color'

import { ColorList } from 'appcoloring'

export default class ColorEvent extends PureComponent {
  isTextsOk(texts) {
    return Array.isArray(texts) && texts.length && texts.every(t => typeof t === 'string')
  }

  render() {
    const {event} = this.props
    const {heading: h0, colors: c0, texts: t0} = Object(event)
    const heading = String(h0 || 'Event')
    const colors = Array.isArray(c0) ? c0.map(o => new Color(Object(o).hex)) : false
    const texts = this.isTextsOk(t0) ? t0 : false

    return <Fragment>
      <h3>{heading}</h3>{colors &&
      <ColorList colors={colors} />}{texts &&
      <ul>{texts.map((t, i) =>
        <li key={i}>{t}</li>
      )}
      </ul>}
    </Fragment>
  }
}
