/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, { memo } from 'react'
import { connect } from 'allstore'
import PasteValue from './PasteValue'

export default connect(({pastes}) => ({pastes}))(memo(({pastes}) =>
  pastes.keySeq().map(id => <PasteValue key={id} id={id} />)))
