/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import React, { Fragment } from 'react'
import styled from 'styled-components'

const Value = styled.div`
  /* display: inline flow; TODO 181028 not supported */
  display: inline-block;
  width: ${props => props.widthEx}ex;
  text-align: right;
`
const Suffix = styled.div`
display: inline-block;
width: ${props => props.widthEx}ex;
`
export default ({value, suffix, width: n, suffixWidth: ns}) => {
  value = String(value)
  const width = n > 0 ? +n : 4
  suffix = String(suffix || '')
  const sWidth = ns > 0 ? +ns : 2

  return <Fragment>
    <Value widthEx={width}>{value}</Value>
    <Suffix widthEx={sWidth}>{suffix}</Suffix>
  </Fragment>
}
