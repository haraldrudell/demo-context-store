/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
export const store = {}
export const getState = () => store
export const notify = () => _subscriptions.forEach(v => getSubscribeFn(v, true))
export const subscribe = v => _subscriptions.push(getSubscribeFn(v)) && ({unsubscribe: () => unsubscribe(v)})

export const _subscriptions = []
function getSubscribeFn(v, invoke) {
  if (typeof Object(v).next === 'function') return invoke ? v.next(store) : v
  if (typeof v === 'function') return invoke ? v(store) : v
  throw new Error('plainStore: bad argument to subscribe')
}
function unsubscribe(v) {
  const i = _subscriptions.indexOf(v)
  if (i >= 0) _subscriptions.splice(i, 1)
}
