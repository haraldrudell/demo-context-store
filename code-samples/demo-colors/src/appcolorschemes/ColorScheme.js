/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import React, { PureComponent, Fragment } from 'react'
import Color from 'color'

import { ColorList } from 'appcoloring'

import ColorEvent from './ColorEvent'
import ColorPalette from './ColorPalette'

/*
Color api

construction:
new Color('#7743ce')
new Color('rgb(255, 255, 255)')
new Color({r: 255, g: 255, b: 255})
new Color.rgb(255, 255, 255)
new Color.rgb([255, 255, 255])

color models:
rgb hsl hsv hwb cmyk xyz lab lch hex keyword ansi16 ansi256 hcg apple gray

properties:
color: [255, 255, 255]
model: 'rgb'
valpha: 1

instance methods:

- convert to model:
rgb() hsl() hsv() hwb() cmyk() xyz() lab() lch() keyword(val)
ansi16() ansi256() hcg() apple() gray(val)
hex(val) '#7743CE'

rgb model get-setters:
red(val)
green(val)
blue(val)

get-setter for hsl hsv hwb hcg:
hue(val)

a(val) alpha(val) array b(val) black(val) blacken(ratio)
chroma(val)  contrast(color2) cyan(val)
darken(rtatio) desaturate(ratio) fade(ratio) grayscale
 isDark isLight
l(val) level(color2) lighten(ratio) lightness(val)
luminosity() magenta(val) mix(mixinColor, weight) negate object opaquer(ratio)
percentString(places) rgbNumber rotate(degrees) round(places)
saturate(ratio) saturationl(val) saturationv(val) string(places)
toJSON toString unitArray unitObject value(val) wblack(val)
white(val) whiten(ratio) x(val) y(val) yellow(val) z(val)
*/

//console.log('ColorScheme', new Color('#7743ce').hsl())

// red hsl: hsl(0, 100%, 50%) Color {model: "hsl", color: Array(3), valpha: 1}
//console.log('red hsl:', Color('red').hsl().string(), Color('red').hsl())

// float rgb: rgb(0, 1, 1): rgb values are rounded to integers
//console.log('float rgb:', Color.rgb(1/3, 2/3, 4/3).rgb().string())

export default class ColorScheme extends PureComponent {
  render() {
    const {scheme: s} = this.props
    const {name: n0, date: d0, scheme, events: e0} = Object(s)
    const name = String(n0 || 'Nameless')
    const date = d0 ? String(d0).substring(0, 10) : 'N/A'
    const colors = Array.isArray(scheme) ? scheme.map(sc => new Color(Object(sc).hex)) : false
    const events = Array.isArray(e0) ? e0 : false

    return <Fragment>
      <h1>{name}</h1>
      <p>Date: {date}</p>
      {events && events.map((e, i) =>
        <ColorEvent event={e} key={i}/>)}
      {colors && <Fragment>
        <h3>Complete Color Scheme</h3>
        <ColorList colors={colors} />
        <h3>Palette</h3>
        <ColorPalette scheme={scheme} name={name} />
      </Fragment>}
    </Fragment>
  }
}
