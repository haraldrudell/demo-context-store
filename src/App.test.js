/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { plainStore } from 'allstore'
import { OrderedMap } from 'immutable'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<App />, div)
  ReactDOM.unmountComponentAtNode(div)
  const actual = plainStore.getState()
  expect(typeof actual).toBe('object')
  expect(actual.value).toBe(1)
  expect(OrderedMap.isOrderedMap(actual.records)).toBeTruthy()
})
