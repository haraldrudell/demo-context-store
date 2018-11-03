/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, { Component, Fragment } from 'react'
import styled from 'styled-components'

import { Grid, Portal } from 'apputil'
import Clipboard from 'clipboard'
import GqlPortal from 'gqlportal'
import { MaterialUIControls } from 'appdemo'

import Logo from './Logo'

const gridProps = { // props for Material-UI Grid component
  containerStyles: `
    max-width: 10.5in
    margin: 0
    li {
      margin-top: 6pt
      margin-bottom: 6pt
    }
  `,
  direction: 'column',
  alignItems: 'center',
  spacing: 40,
}
const PortalUpperRight = styled.div`
position: absolute
top: 0
right: 0
padding: 20px
background-color: ${props => props.theme.backgroundColor}
`
export default class App extends Component {
  render() {
    return <Fragment>
      <Portal>{/* children into specific dom element, renders nothing */}
        <PortalUpperRight>{/* a div in upper right corner of viewport */}
          <GqlPortal />
        </PortalUpperRight>
      </Portal>
      <Grid {...gridProps}>
        <Logo />
        <MaterialUIControls />{/* a demo of all Material-UI control appearances */}
        <Clipboard />
      </Grid>
    </Fragment>
  }
}
