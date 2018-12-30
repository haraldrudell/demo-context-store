/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
export * from './connect' // connect connect2
export * from './useAllstore'
export { store, getState, subscribe, notify } from './plainStore'
export { storeContext, StoreProvider, StoreConsumer, default as Store } from './Store'
