/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, { createElement } from 'react'
import styled, { keyframes, css } from 'styled-components'
import './fonts/fonts.css'
import './fonts/bladeRunner.css'

const Margin = styled.div`
padding: 5em
`
/*
get a hue animation
hue-color is a effect, unclear if it can be aimated

multiple backgrounds: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Backgrounds_and_Borders/Using_multiple_backgrounds

css filter: filter effect
hue-rotate
blur, grayscale to color

transition: between two states
animation: any number of key frames
*/
/*
animate text color from bacl to red: works
*/
const coloring = keyframes`
  from {
    color: red;
  }
  50% {
    color: black;
  }
  to {
    color: red;
  }
`
const TextColoring = styled.div`
font: bolder 50pt Arial, Helvetica, sans-serif;
animation: ${coloring} 4s linear infinite;
`
/*
now try hue: it works!
*/
const huing = keyframes`
  from {
    color: hsl(0, 100%, 50%);
  }
  33% {
    color: hsl(120, 100%, 50%);
  }
  66% {
    color: hsl(240, 100%, 50%);
  }
  to {
    color: hsl(360, 100%, 50%);
  }
`
const TextHuing = styled.div`
font: bolder 50pt Arial, Helvetica, sans-serif;
animation: ${huing} 4s linear infinite;
`
/*
Make a background based on a gradient
linear-gradient
Repeating-linear-gradient()
Radial-gradient()
use div with multiple backgrounds
*/
const DivMulti = styled.div`
width: 4in;
height: 2in;
/*background: red;*/
/*radial-gradient(200% at -50%, red, white);*/
background: radial-gradient(circle at center, red, white);`
const stacked = css`
width: 2in
height: 1in
position: absolute
`
const square = css`
width: 2in
height: 1in
`
const Red = styled.div`
${stacked}
color: red
`
const Green = styled.div`
${stacked}
color: green
`
const Blue = styled.div`
${stacked}
color: blue
`
/*const rotate = keyframes`
  from {
    transform: hue-rotate(0deg);
  }
  to {
    transform: hue-rotate(360deg);
  }
`*/
const pinkTones = keyframes`
  from {
    color: hsl(0, 100%, 50%); // red
  }
  33% {
    color: black;
  }
  66% {
    color: hsl(240, 100%, 50%);
  }
  to {
    color: hsl(360, 100%, 50%);
  }
`
const TheText = styled.div`
background: radial-gradient(100% 100% at left 15% top 15%, #f2e5cd, #f9c7c7);
width: 100%;
height: 2in;
display: flex;
justify-content: center;
align-items: center
div {
  font: bolder 50pt Arial, 'Baloo Tamma'/*Helvetica, sans-serif*/;
  animation: ${pinkTones} 8s linear infinite;
}
`
/*
const H = styled.h1`
color: red;
animation: ${rotate} 2s linear infinite;
`
*/
export default () =>
  <Margin>
    <TextColoring>ABC</TextColoring>
    <TextHuing>ABC</TextHuing>
    {[
      styled.div`${square};background: blue`, // solid blue
      styled.div`${square};background: radial-gradient(circle at center, red, white)`, // red in cennter, white at edges
      styled.div`${square};background: radial-gradient(circle at left -50% top 25%, red, white)`,
      styled.div`${square};background: radial-gradient(100% 100% at left 15% top 15%, #f2e5cd, #f9c7c7)`, // heiht width center point,
    ].map((s, i) => createElement(s, {key: i}))}
    <TheText><div>Harald Rudell</div></TheText>
    <DivMulti />
    <div>3 divs on top of each other</div>
    <div><Red /><Green /><Blue /></div>
  </Margin>
