/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import React, { memo, useMemo, createContext } from 'react'
import { store, getState, subscribe, notify } from './plainStore'

export const storeContext = createContext()
export const {Provider: StoreProvider, Consumer: StoreConsumer} = storeContext

const contextValue = { store, getState, subscribe, notify }

export default memo(({children, store: storeProp}) => useMemo(() => Object.assign(store, {...storeProp}), [storeProp]) &&
  <StoreProvider value={contextValue}>{children}</StoreProvider>)
