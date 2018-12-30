/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import {store, getState, notify, _subscriptions, subscribe} from './plainStore'

it('store and getState', () => {
  expect(store).toBe(getState())
})

it('subscribe notify unsubscribe with next', () => {
  const actual = []
  const slice = {value: 2}
  const subscriber = {next: state => actual.push(state)}

  const subscription = subscribe(subscriber)
  expect(typeof Object(subscription).unsubscribe).toBe('function')
  expect(_subscriptions).toEqual([subscriber])

  Object.assign(store, slice); notify()
  expect(actual).toEqual([slice])

  subscription.unsubscribe()
  expect(_subscriptions).toEqual([])
})
