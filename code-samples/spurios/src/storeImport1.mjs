/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
// node --experimental-modules --no-warnings src/storeimport1
import {store} from './store'
import {printStore} from './storeimport2'
store.a = 1
printStore()
