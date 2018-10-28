/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import React, { memo, Fragment } from 'react'
import styled from 'styled-components'

import {
  RgbHeading,
  Rgb24,
  RgbHexHeading,
  RgbHex,
  Hue,
  HueHeading,
  Saturation,
  SaturationHeading,
  Lightness,
  LightnessHeading,
  Luminance,
  LuminanceHeading,
 } from './TypedValues'

export const ColorSwatch = styled.div`
  display: inline-block; /* TODO 181028 inline flow */
  background-color: ${props => props.color.rgb().string()};
  width: 1em
  height: 1em
  border: 1px solid black;
  box-sizing: border-box;
`
const Swatch = styled(ColorSwatch)`
  margin-right: 1em;
`
const SwatchHeading = styled.div`
  display: inline-block; /* TODO 181028 inline flow */
  width: 2em;
`
export const ColorDisplay = memo(({color}) => {
  const rgbHex = color.hex().toLowerCase()
  const rgb = color.rgb().array()
  const hsl = color.hsl()
  const hue = hsl.hue()
  const saturation = hsl.saturationl()
  const lightness = hsl.l()
  const luminosity = color.luminosity() * 100

  return <Fragment>
    <Swatch color={color} />
    <RgbHex value={rgbHex} />{rgb.map((v, i) =>
      <Rgb24 value={v} key={i} />)}
    <Hue value={hue}/>
    <Saturation value={saturation} />
    <Lightness value={lightness} />
    <Luminance value={luminosity} />
  </Fragment>
})

export const ColorHeading = () =>
  <Fragment>
    <SwatchHeading />
    <RgbHexHeading />
    <RgbHeading />
    <HueHeading /><SaturationHeading /><LightnessHeading />
    <LuminanceHeading />
  </Fragment>
