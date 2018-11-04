/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import React, { PureComponent, Children, cloneElement } from 'react'
import styled from 'styled-components'
import Grid from '@material-ui/core/Grid'

export default class AppGrid extends PureComponent {
  constructor(props) {
    super(props)
    let {containerStyles} = props
    containerStyles = String(containerStyles || '')
    this.GridContainer = containerStyles ? styled(Grid)([containerStyles]) : Grid
  }
  render() {
    const {GridContainer, props: {children, containerStyles, ...containerProps}} = this

    return <GridContainer {...containerProps} container>
      {Children.map(children, child => <Grid item>{cloneElement(child)}</Grid>)}
    </GridContainer>
  }
}
