/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import { createContext } from 'react'

export const storeContext = createContext()
export const {Provider: StoreProvider, Consumer: StoreCosumer} = storeContext
