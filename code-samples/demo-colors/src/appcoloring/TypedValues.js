/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import React from 'react'
import styled from 'styled-components'

import ValueBox from './ValueBox'

const Percentage = ({value}) => <ValueBox value={Round(value, 100)} suffix='%' />
const Round = (v, max) => v >= 0 && v <= max ? Math.round(v) : 'N/A'

export const Hue = ({value}) => <ValueBox value={Round(value, 360)} suffix='°' />
export const HueHeading = () => <ValueBox value={'Hue'} />

export const Saturation = Percentage
export const SaturationHeading = () => <ValueBox value={'Sat'} />

export const Lightness = Percentage
export const LightnessHeading = () => <ValueBox value={'Lns'} />

export const RedHeading = () => <ValueBox value={'Red'} />
export const GreenHeading = () => <ValueBox value={'Grn'} />
export const BlueHeading = () => <ValueBox value={'Blue'} />
const RgbBox = styled.div`
  display: inline-block; /* TODO 181028 inline flow */
  width: 15ex;
  text-align: center;
`
export const RgbHeading = () => <RgbBox>Red Green Blue</RgbBox>
export const Rgb24 = ({value}) => <ValueBox value={Round(value, 255)} suffixWidth={1} />

export const LuminanceHeading = () => <ValueBox value={'Lum'} />
export const Luminance = Percentage

const RgbHexBox = styled.div`
  display: inline-block; /* TODO 181028 inline flow */
  width: 9ex;
  text-align: center;
`
export const RgbHexHeading = () => <RgbHexBox>Rgb hex</RgbHexBox>
export const RgbHex = ({value}) => <ValueBox value={value} width={8} suffixWidth={1} />
