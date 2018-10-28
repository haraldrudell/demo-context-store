/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import React, { Fragment } from 'react'
import styled from 'styled-components'

import {ColorWheel} from 'appcoloring'

/*
from color package source code:

Luminance independent of hue
https://www.w3.org/TR/WCAG20/#relativeluminancedef

https://www.w3.org/TR/WCAG20/#contrast-ratiodef

Contrast is luminance and color contrast
https://en.wikipedia.org/wiki/Display_contrast

Color theory: guidsance to color mixing
https://en.wikipedia.org/wiki/Color_theory
*/
/*
avoid contrast vibration
color contrasts that vibrate:
- high saturation
- 180° hue difference

equiluminant color combination aree difficult to read
https://webdesign.tutsplus.com/articles/why-you-should-avoid-vibrating-color-combinations--cms-25621
*/
export default () =>
  <Fragment>
    <h1>Colors</h1>
    <ul>
      <li>Contrast is a combination of hue and luminance difference</li>
      <li>High contrast is easier to read</li>
      <li>For dark text on light background, pick an off-white background</li>
      <li>Black text gives the highest contrast</li>
      <li>Cold, blue colors are better for background and warm, red for foreground</li>
      <li>Pick a first color, then depending on how many colors required, evenly spread in hue</li>
    </ul>
    <h2>Color format</h2>
    <ul>
      <li><strong>rgb</strong> is 3 values 0…255 for each of <strong>red</strong>, <strong>green</strong> and <strong>blue</strong></li>
      <li><strong>hsl</strong> is <strong>hue</strong>, a position 0 - 359 degrees on the color wheel, <strong>saturation</strong> % from gray to bright color and <strong>lightness</strong> % from black to white</li>
    </ul>
    <ColorWheel sectors={36} background='#fce5cd'/>
    <ul>
      <li>Hue 0 degrees, at the top is red</li>
      <li>Hue 120 degrees, down to the right is green</li>
      <li>Hue 240 degrees, down to the left is blue</li>
    </ul>
    <Saturation />
    <ul>
      <li>0% saturation is gray</li>
      <li>100% saturation is the brightest color</li>
    </ul>
    <Luminance />
    <ul>
      <li>0% lightness is black</li>
      <li>50% lightness has the brightest color</li>
      <li>100% lightness is white</li>
    </ul>
    <p>Relative luminance: the brightness of a color in the range from black to white</p>
  </Fragment>

const SatSwatch = styled.div`
  display: inline flow;
  width: 96px;
  height: 1em;
  background-image: linear-gradient(to right, hsl(0, 0%, 50%), hsl(0, 100%, 50%));
  border: 1px solid black;
`
const Saturation = () => <div>Saturation: 0% <SatSwatch /> 100%</div>

const LumSwatch = styled.div`
  display: inline flow;
  width: 96px;
  height: 1em;
  background-image: linear-gradient(to right, hsl(0, 100%, 0%), hsl(0, 50%, 50%), hsl(0, 100%, 100%));
  border: 1px solid black;
`
const Luminance = () => <div>Lightness: 0% <LumSwatch /> 100%</div>
