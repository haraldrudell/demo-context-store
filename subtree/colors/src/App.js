/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import React, { Component, Fragment } from 'react'
import Color from 'color'
import styled from 'styled-components'
import ColorWheel from './ColorWheel'

// red hsl: hsl(0, 100%, 50%) Color {model: "hsl", color: Array(3), valpha: 1}
//console.log('red hsl:', Color('red').hsl().string(), Color('red').hsl())

// float rgb: rgb(0, 1, 1): rgb values are rounded to integers
//console.log('float rgb:', Color.rgb(1/3, 2/3, 4/3).rgb().string())

/*
Find the hue30 theme on c87:
find ~ -iname "*hue30*"
~/.vscode/extensions/hue30theme/hue30theme.tmTheme
all colors:

color wheel:
https://stackoverflow.com/a/43266702

Chromium conic-gradient not in
https://twitter.com/malyw/status/849908979119640576

scale svg discussion
https://css-tricks.com/scale-svg/
*/

const AppContainer = styled.div`
padding: 20px
background-color: #fce5cd
max-width: 10.5in;
li {
  margin-top: 6pt;
  margin-bottom: 6pt;
}
`

export default class App extends Component {
  hue30Colors = [
    '#fce5cd', '#0055ff', '#000000', '#cde4fc', '#007bff',
    '#ff0000', '#00ff00', '#003E80', '#800080', '#ffccff',
    '#008000', '#ffffcc', '#A6E22E', '#ffff01', '#ffff02',
    '#ffff05', '#fff0f0',
  ].map(c => Color(c))
  hue30Index = {
    bg: 0,
    fg: 2,
    bgSelect: 3,
    fgAlt1: 7,
    fgAlt2: 8,
    fgAlt3: 10,
  }

  render() {
    const {hue30Colors, hue30Index} = this

    return <AppContainer>
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
      <h2>Hue30</h2>
      <h3>Primary Colors</h3>
      <ColorDisplay color={hue30Colors[hue30Index.bg]} />
      <ColorDisplay color={hue30Colors[hue30Index.fg]} />
      <ul>
        <li>I picked hue 30 for the first color, saturation about 90% and lightness about 90%</li>
        <li>Primary text color is black for max contrast</li>
      </ul>
      <h3>Selection Background Color</h3>
      <ColorDisplay color={hue30Colors[hue30Index.bgSelect]} />
      <ul>
        <li>Selected background is the first color with hue 180 degrees off</li>
      </ul>
      <h3>Additional Foreground Colors</h3>
      <ColorDisplay color={hue30Colors[hue30Index.fgAlt1]} />
      <ColorDisplay color={hue30Colors[hue30Index.fgAlt2]} />
      <ColorDisplay color={hue30Colors[hue30Index.fgAlt3]} />
      <ul>
        <li>Various text colors in 90 degree hue steps with saturation 100% lightness 25%</li>
      </ul>
      <h3>Complete Color Scheme</h3>
      <ColorScheme colors={this.hue30Colors} />
    </AppContainer>
  }
}

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

const ColorScheme = ({colors}) => {
  return <Fragment>
    {colors.map((c, i) => <ColorDisplay color={c} key={i} />)}
  </Fragment>
}

const getHsl = color => color.hsl().color // [hue, saturation, lightness]
const hslText = (v, i) => `${Math.round(v)}${i > 0 ? '%' : '°'}` // '1°' or '1%'
const colorToHslText = color => getHsl(color).map(hslText).join(', ') // '1°, 1%, 1%'
const printableHsl = color => `hsl(${colorToHslText(color)})` // 'hsl(1°, 1%, 1%)'
const printableLuminosity = color => `${Math.round(color.luminosity() * 100)}%`
const ColorSwatch = styled.div`
display: inline flow;
background-color: ${props => props.color.rgb().string()};
width: 1em
height: 1em
border: 1px solid black;
box-sizing: border-box;
`
const ColorRgb = styled.div`
display: inline flow;
width: 18ex;
`
const ColorHsl = styled.div`
display: inline flow;
width: 21ex;
`
const ColorDisplay = ({color}) =>
  <div>
    <ColorSwatch color={color} />
    &ensp;
    <ColorRgb>{color.rgb().string()}</ColorRgb>
    &emsp;
    <ColorHsl>{printableHsl(color)}</ColorHsl>
    &emsp;
    Luminance: {printableLuminosity(color)}
  </div>
