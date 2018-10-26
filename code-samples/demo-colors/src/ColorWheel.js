/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import React, { PureComponent } from 'react'
import styled from 'styled-components'

/*
The color wheel starts at 0 = red at the top
To have sectors center on primary colors 120 - green and 240 - blue:
- make sectors a multiple of 3
*/

export default class ColorWheel extends PureComponent {
  render() {
    const {diameter = 96, sectors: sectors0 = 6, background = '#fff'} = this.props // unit: px = inch / 96
    const sectors = sectors0 >= 3 ? +sectors0 : 3 // at least 3 sectors, ensure number
    const radius = diameter / 2
    const degreesPerSector = 360 / sectors
    const sectorHalfAngleWidth = radius * Math.tan(degreesPerSector / 2 * Math.PI / 180)

    return <ColorWheelContainer diameter={diameter} background={background}> {/* allocate space in the page-layout */}
      {Array.from({length: sectors}, (_, i) => degreesPerSector * i).map((deg, i) =>
        <Sector radius={radius} width={sectorHalfAngleWidth} angle={deg} key={i} />
      )}
    </ColorWheelContainer>
  }
}

const ColorWheelContainer = styled.div`
/* allocate space in the page-layout */
height: ${props => props.diameter}px;
width: ${props => props.diameter}px;

/* make round and clip any content to this circle */
border-radius: 50%;
overflow: hidden;

position: relative; /* a positioned parent that is the reference for its absolute-positioned children */
transform-origin: centre; /* transforms around the center of this box */
:after { /* create circular center */
  content: "";

  /* at the center of container, size a third of diameter */
  position: absolute;
  top: 33%;
  left: 33%;
  width: 33%;
  height: 33%;

  border-radius: 50%; /* completely round */
  background: ${props => props.background};
}
`

const Sector = styled.span`
position: absolute; /* position relative to ColorWheelContainer */
left: ${props => props.radius - props.width}px; /* center horizontally */
/*
top border solid color hue according to angle
left-right-bottom borders invisible
*/
border-color: hsl(${props => props.angle}, 100%, 50%) transparent transparent transparent;
border-style: solid;

/* Make height equal diameter and width 2 * width prop */
border-width: ${props => props.radius}px ${props => props.width}px;
box-sizing: border-box; /* make border be inside height and width */

transform: rotate(${props => props.angle}deg); /* rotate span to proper angle */
`
