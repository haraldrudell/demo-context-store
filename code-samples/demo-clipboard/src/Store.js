/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React from 'react'
import { Store } from 'allstore'
import { OrderedMap, Map } from 'immutable'

const store = {
  pastes: OrderedMap(), // key: id, value: Map(text, format)
  nextId: 0,
}

export default ({children}) => <Store store={store}>{children}</Store>

export function createPastesValue({text, format}) {
  return Map([['text', text], ['format', format]])
}
