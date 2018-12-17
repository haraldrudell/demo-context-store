/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
export const store = {}
export const getState = () => store

function getSubscribeFn(v, invoke) {
  if (typeof Object(v).next === 'function') return invoke ? v.next(store) : true
  if (typeof v === 'function') return invoke ? v(store) : true
  throw new Error('plainStore: bad argument to subscribe')
}
export const _subscriptions = []
export const subscribe = v => getSubscribeFn(v) && _subscriptions.push(v) && ({unsubscribe: () => unsubscribe(v)})
function unsubscribe(v) {
  const i = _subscriptions.indexOf(v)
  if (i >= 0) _subscriptions.splice(i, 1)
}
export const notify = () => _subscriptions.forEach(v => getSubscribeFn(v, true))
