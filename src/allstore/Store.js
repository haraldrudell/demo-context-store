/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, { memo, useMemo } from 'react'

import PlainStore from './PlainStore'
import { StoreProvider } from './context'

export const plainStore = new PlainStore()

export default memo(({children, store}) => {
  useMemo(() => plainStore.state = {...store}, [store])
  return <StoreProvider value={plainStore}>{children}</StoreProvider>
})
