/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import React, { memo, useMemo } from 'react'

import PlainStore from './PlainStore'
import { StoreProvider } from './context'

export const plainStore = new PlainStore()

export default memo(({children, store}) => {
  useMemo(() => plainStore.state = {...store}, [store])
  return <StoreProvider value={plainStore}>{children}</StoreProvider>
})
