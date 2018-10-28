/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import React, { Component } from 'react'
import styled from 'styled-components'

import { ColorTheory } from 'appcolorschemes'
import { hue30, ColorScheme } from 'appcolorschemes'

const AppContainer = styled.div`
padding: 20px
background-color: #fce5cd
max-width: 10.5in;
li {
  margin-top: 6pt;
  margin-bottom: 6pt;
}
`
export default class App extends Component {
  render() {
    return <AppContainer>
      <ColorTheory />
      <ColorScheme scheme={hue30} />
    </AppContainer>
  }
}
