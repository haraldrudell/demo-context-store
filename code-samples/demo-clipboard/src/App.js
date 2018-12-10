/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React from 'react'
import styled from 'styled-components'
import Store from './Store'
import PastePanel from './PastePanel'
import PasteValues from './PasteValues'

const Margin = styled.div`
padding: 0 3em;
display: flex;
flex-direction: column;
&>:nth-child(n+2) { /* top-level children 2… */
  margin-bottom: 24px;
}
`
export default () =>
  <Margin>
    <Store>
      <h1>Clipboard</h1>
      <PastePanel />
      <PasteValues />
    </Store>
  </Margin>
