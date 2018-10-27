/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import React, { PureComponent } from 'react'
import styled from 'styled-components'

/*
SprayPaint
radius: outer visible corner radius of the edge of the radial gradient. Unit: px
- also the sum of padding background and linear gradient for edges
- radius is equally split into solid background and gradient
width: content width that spraypaint encloses. Unit: px
height: content height that spraypaint encloses. Unit: px
rgb: string rgb values like '255, 0, 0' color of spraypaint. Fades to 100% transparency
*/
export default class SprayPaint extends PureComponent {
  render() {
    const {radius, width, height, rgb, children} = this.props
    const outerWidth = 2 * radius + width
    const outerHeight = 2 * radius + height

    return <FlexBox width={outerWidth} height={outerHeight}>
      {/* top row */}
      <Corner radius={radius} at='bottom right' rgb={rgb}/>
      <Edge height={radius} width={width} to='top' rgb={rgb}/>
      <Corner radius={radius} at='bottom left' rgb={rgb}/>

      {/* middle row with content */}
      <Edge height={height} width={radius} to='left' rgb={rgb}/>
      <Content height={height} width={width} rgb={rgb}>
        {children}
      </Content>
      <Edge height={height} width={radius} to='right' rgb={rgb} />

      {/* bottom row */}
      <Corner radius={radius} at='top right' rgb={rgb}/>
      <Edge height={radius} width={width} to='bottom' rgb={rgb} />
      <Corner radius={radius} at='top left' rgb={rgb}/>
    </FlexBox>
  }
}
/*
linear gradients have half the distance in solid background then gradient to transparency
radial has 35% solid then transparency at 70%
- the length of the radial gradient is from corner-to-corner in a square
- to get from the diagonal to a side of the square is 1/sqrt(2) = 0.7
- solid background corner radius: 35% * 40 = 14px
- at transparent corner radius: 70% * 40 = 28px
*/
const FlexBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  height: ${props => props.height}px;
  width: ${props => props.width}px;
`
const Corner = styled.div`
height: ${props => props.radius}px;
width: ${props => props.radius}px;
background-image: radial-gradient(
  circle at ${props => props.at},
  rgba(${props => props.rgb}, 1),
  rgba(${props => props.rgb}, 1) 35%,
  rgba(${props => props.rgb}, 0) 70%)
`
const Edge = styled.div`
height: ${props => props.height}px;
width: ${props => props.width}px;
background-image: linear-gradient(
  to ${props => props.to},
  rgba(${props => props.rgb}, 1),
  rgba(${props => props.rgb}, 1) 50%,
  rgba(${props => props.rgb}, 0))
`
const Content = styled.div`
  height: ${props => props.height}px;
  width: ${props => props.width}px;
  background: rgb(${props => props.rgb});
`
