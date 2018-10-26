import React, { Component, Fragment } from 'react'
import Color from 'color'
import styled from 'styled-components'

// red hsl: hsl(0, 100%, 50%)
//console.log('red hsl:', Color('red').hsl().string())

/*
Find the hue30 theme on c87:
find ~ -iname "*hue30*"
~/.vscode/extensions/hue30theme/hue30theme.tmTheme
all colors:
*/

export default class App extends Component {
  colors1 = [
    Color('#fce5cd'),
    Color('#0055ff'),
    Color('#000000'),
    Color('#cde4fc'),
    Color('#007bff'),
    Color('#ff0000'),
    Color('#00ff00'),
    Color('#003E80'),
    Color('#800080'),
    Color('#ffccff'),
    Color('#008000'),
    Color('#ffffcc'),
    Color('#A6E22E'),
    Color('#ffff01'),
    Color('#ffff02'),
    Color('#ffff05'),
    Color('#fff0f0'),
  ]

  render() {
    return (
      <div className="App">
        <h1>Colors</h1>
        <ul>
          <li>Contrast is a combination of hue and brightness difference</li>
          <li>High contrast is easier to read</li>
          <li>For dark text on light background, pick an off-white background</li>
          <li>Black text gives the highest contrast</li>
          <li>Cold, blue colors are better for background and warm, red for foreground</li>
          <li>Pick a first color, then dependeing on how many colors required, evenly spread in hue</li>
        </ul>
        <h2>Color format</h2>
        <ul>
          <li>rgb is 3 values 0…255 for each of red, green and blue</li>
          <li>hsl is hue, a position 0 - 359 on the color wheel, saturation % from gary to bright color and luminance % from black to white</li>
        </ul>
        <HueCircle />
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
          <li>0% luminance is black</li>
          <li>50% luminance has the brightest color</li>
          <li>100% luminance is white</li>
        </ul>
        <h2>Hue30</h2>
        <ColorDisplay color={this.colors1[0]} />
        <ColorDisplay color={this.colors1[2]} />
        <ul>
          <li>I picked hue 30 for the first color, saturation about 90% and luminance about 90%</li>
          <li>Primary text color is black for max contrast</li>
        </ul>
        <ColorDisplay color={this.colors1[3]} />
        <ul>
          <li>Selected background is the first color with hue 180 degrees off</li>
        </ul>
        <ColorDisplay color={this.colors1[7]} />
        <ColorDisplay color={this.colors1[8]} />
        <ColorDisplay color={this.colors1[10]} />
        <ul>
          <li>Various text colors in 90 degree hue steps with saturation 100% luminance 25%</li>
        </ul>
        <ColorScheme colors={this.colors1} />
      </div>
    )
  }
}

const ColorWheelWrapper = styled.div`
height: 60px
`
const ColorWheel = styled.div`
  height: 20px;
  width: 20px;
  left: 30px;
  position: relative;
  transform-origin: 10px 30px;
  user-select: none;
  transition: all 0.5s linear;
  > span {
    position: absolute;
    transform-origin: 50% 50%;
    border-style: solid;
    border-width: 30px 10px;
    box-sizing: border-box;
  }
  :before {
    content: "";
    width: 60px;
    height: 60px;
    overflow: hidden;
    position: absolute;
    top: -6px;
    left: -26px;
    border-radius: 100%;
    border: 6px solid #ffffff;
    z-index: 100;
  }
  :after {
    content: "";
    width: 20px;
    height: 20px;
    overflow: hidden;
    position: absolute;
    top: 20px;
    left: 0px;
    border-radius: 100%;
    background: #ffffff;
  }
`
const Span01 = styled.span`
    border-color: hsl(0, 100%, 50%) transparent transparent transparent;
`
const Span02 = styled.span`
  transform: rotate(36deg);
  border-color: hsl(36, 100%, 50%) transparent transparent transparent;
`
const Span03 = styled.span`
  transform: rotate(72deg);
  border-color: hsl(72, 100%, 50%) transparent transparent transparent;
`
const Span04 = styled.span`
  transform: rotate(108deg);
  border-color: hsl(108, 100%, 50%) transparent transparent transparent;
`
const Span05 = styled.span`
  transform: rotate(144deg);
  border-color: hsl(144, 100%, 50%) transparent transparent transparent;
`
const Span06 = styled.span`
  transform: rotate(180deg);
  border-color: hsl(180, 100%, 50%) transparent transparent transparent;
`
const Span07 = styled.span`
  transform: rotate(216deg);
  border-color: hsl(216, 100%, 50%) transparent transparent transparent;
`
const Span08 = styled.span`
  transform: rotate(252deg);
  border-color: hsl(252, 100%, 50%) transparent transparent transparent;
`
const Span09 = styled.span`
  transform: rotate(288deg);
  border-color: hsl(288, 100%, 50%) transparent transparent transparent;
`
const Span10 = styled.span`
  transform: rotate(324deg);
  border-color: hsl(324, 100%, 50%) transparent transparent transparent;
`
const HueCircle = () =>
  <ColorWheelWrapper>
    <ColorWheel>
      <Span01 /><Span02 /><Span03 /><Span04 /><Span05 />
      <Span06 /><Span07 /><Span08 /><Span09 /><Span10 />
    </ColorWheel>
  </ColorWheelWrapper>

const SatSwatch = styled.div`
  display: inline flow;
  width: 96px;
  height: 1em;
  background-image: linear-gradient(to right, hsl(0, 0%, 50%), hsl(0, 100%, 50%))
`
const Saturation = () => <div>Saturation: 0% <SatSwatch /> 100%</div>

const LumSwatch = styled.div`
  display: inline flow;
  width: 96px;
  height: 1em;
  background-image: linear-gradient(to right, hsl(0, 100%, 0%), hsl(0, 50%, 50%), hsl(0, 100%, 100%))
`
const Luminance = () => <div>Luminance: 0% <LumSwatch /> 100%</div>

const ColorScheme = ({colors}) => {
  return <Fragment>
    {colors.map((c, i) => <ColorDisplay color={c} key={i} />)}
  </Fragment>

}

const ColorDisplay = ({color}) =>
  <Fragment>
    <div>
      <div style={{display: 'inline-block', backgroundColor: color.rgb().string(), width: '1em', height: '1em'}} />
      {color.rgb().string()}&emsp;{color.hsl().string()}
    </div>
  </Fragment>
