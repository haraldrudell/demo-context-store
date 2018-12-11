/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import React, { memo, useMemo, createContext } from 'react'
import PlainStore from './PlainStore'

export const plainStore = new PlainStore()
export const storeContext = createContext()
export const {Provider: StoreProvider, Consumer: StoreConsumer} = storeContext

export default memo(({children, store}) => useMemo(() => plainStore.state = {...store}, [store]) &&
  <StoreProvider value={plainStore}>{children}</StoreProvider>)
