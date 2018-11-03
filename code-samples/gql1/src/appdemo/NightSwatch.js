/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, { Fragment } from 'react'
import styled from 'styled-components'

/*
bottom-left: black
top-right: yellow
to right: rgb(0, g, 0) = rgb(255, g, 0)
to top: rgb(r, 0, 0) - rgb(r, 255, 0)
*/
const Gradient = styled.div`
  width: ${props => props.width}px
  height: ${props => props.height}px
  background: linear-gradient(
    to right,
    rgb(0, ${props => props.g}, 0),
    rgb(255, ${props => props.g}, 0));
`
export default ({height: height0, width = 96, steps: steps0}) => {
  const steps = steps0 > 0 ? +steps0 : 10
  const perStep = 255 / steps
  const height = (height0 > 0 ? +height0 : 96) / steps
  const gProps = {width, height}
  return <Fragment>{Array.from(Array(steps).keys()).map(i =>
    <Gradient g={Math.round(i * perStep)} {...gProps} key={i} />
  )}
  </Fragment>
}
