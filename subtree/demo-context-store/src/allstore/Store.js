/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import React, { memo, useMemo, createContext } from 'react'
import PlainStore from './PlainStore'

export const storeContext = createContext()
export const {Provider: StoreProvider, Consumer: StoreConsumer} = storeContext
let store
export const getStore = () => store

function createStore(storeProp) {
  if (storeProp === undefined) return new PlainStore()
  if (!(storeProp instanceof PlainStore)) throw new Error('Store: store prop not instanceof PlainStore')
  return storeProp
}

export default memo(({children, store: storeProp}) => useMemo(() => store = createStore(storeProp), [storeProp]) &&
  <StoreProvider value={store}>{children}</StoreProvider>)
