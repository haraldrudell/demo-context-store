import React, { Component, Fragment } from 'react'
import Color from 'color'
import styled from 'styled-components'

// red hsl: hsl(0, 100%, 50%)
//console.log('red hsl:', Color('red').hsl().string())

export default class App extends Component {
  colors1 = [
    Color('#fce5cd'),
    Color('#0055ff'),
    Color('#000000'),
    Color('#cde4fc'),
    Color('#007bff'),
    Color('#ff0000'),
    Color('#00ff00'),
  ]

  render() {
    return (
      <div className="App">
        <ul>
          <li>Contrast is a combination of hue and brightness</li>
          <li>rgb is 3 values 0…255 for each of red, green and blue</li>
          <li>hsl is hue, a position 0 - 359 on the color wheel, saturation % from gary to bright color and luminance % from black to white</li>
        </ul>
        <HueCircle />
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
        <ColorScheme colors={this.colors1} />
      </div>
    )
  }
}

const HueBox = styled.div`
width: 96px;
height: 96px;
background-image: conic-gradient(red, green, blue)
`

const ColorWheel = styled.div`
  height: 100px;
  width: 100px;
  margin: 0 auto;
  position: relative;
  transform-origin: 50px 150px;
  user-select: none;
  transition: all 0.5s linear;
  > span {
    position: absolute;
    transform-origin: 50% 50%;
    border-style: solid;
    border-width: 150px 50px;
    box-sizing: border-box;
  }
  :before {
    content: "";
    width: 300px;
    height: 300px;
    overflow: hidden;
    position: absolute;
    top: -30px;
    left: -130px;
    border-radius: 100%;
    border: 30px solid #ffffff;
    z-index: 100;
  }
  :after {
    content: "";
    width: 100px;
    height: 100px;
    overflow: hidden;
    position: absolute;
    top: 100px;
    left: 0px;
    border-radius: 100%;
    background: #ffffff;
  }
`
const Span01 = styled.span`
    transform: rotate(0deg);
    border-color: #43a1cd transparent transparent transparent;
`
const Span02 = styled.span`
  transform: rotate(36deg);
  border-color: #639b47 transparent transparent transparent;
`
const Span03 = styled.span`
  transform: rotate(72deg);
  border-color: #9ac147 transparent transparent transparent;
`
const Span04 = styled.span`
  transform: rotate(108deg);
  border-color: #e1e23b transparent transparent transparent;
`
const Span05 = styled.span`
  transform: rotate(144deg);
  border-color: #f7941e transparent transparent transparent;
`
const Span06 = styled.span`
  transform: rotate(180deg);
  border-color: #ba3e2e transparent transparent transparent;
`
const Span07 = styled.span`
  transform: rotate(216deg);
  border-color: #9a1d34 transparent transparent transparent;
`
const Span08 = styled.span`
  transform: rotate(252deg);
  border-color: #662a6c transparent transparent transparent;
`
const Span09 = styled.span`
  transform: rotate(288deg);
  border-color: #272b66 transparent transparent transparent;
`
const Span10 = styled.span`
  transform: rotate(324deg);
  border-color: #2d559f transparent transparent transparent;
`
const HueCircle = () =>
  <ColorWheel>
    <Span01 /><Span02 /><Span03 /><Span04 /><Span05 />
    <Span06 /><Span07 /><Span08 /><Span09 /><Span10 />
  </ColorWheel>

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
