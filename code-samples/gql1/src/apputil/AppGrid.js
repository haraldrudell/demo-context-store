/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, { PureComponent, Children, cloneElement } from 'react'
import styled from 'styled-components'
import Grid from '@material-ui/core/Grid'

export default class AppGrid extends PureComponent {
  render() {
    const {containerStyles, children, ...containerProps} = this.props
    const GridContainer = styled(Grid)([String(containerStyles || '')])
    containerProps.container = true

    return (
      <GridContainer {...containerProps}>
        {Children.map(children, child => <Grid item>{cloneElement(child)}</Grid>)}
      </GridContainer>
    )
  }
}
