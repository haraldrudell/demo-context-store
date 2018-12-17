/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import React, {useContext} from 'react'
import ReactDOM from 'react-dom'
import {store, notify, _subscriptions} from './plainStore'
import Store, {storeContext} from './Store'
import {useAllstore} from './useAllstore'

it('useAllstore props should work', () => {
  const actual = []
  const key1 = 'a'
  const key2 = 'b'
  const store0 = {map: {[key1]:1, [key2]:2}}
  const expected = [store0.map[key1], store0.map[key2]]

  const div = document.createElement('div')
  ReactDOM.render(
    <Store store={store0}>
      <Fn id={key1} />
      <Fn id={key2} />
    </Store>, div)
  function Fn({id}) {
    const {value} = useAllstore(({map}, {id}) => ({value: map[id]}), {id})
    actual.push(value)
    return value
  }
  ReactDOM.unmountComponentAtNode(div)

  expect(actual).toEqual(expected)
})
/*
it('store update should re-render', async () => {
  const actual = []
  const value1 = {value: 1}
  const value2 = {value: 2}
  const expected = [value1.value, value2.value]

  const div = document.createElement('div')
  await new Promise((resolve, reject) => {
    ReactDOM.render(
      <Store store={value1}>
        <Fn />
      </Store>, div, () => console.log('ReactDOM.render complete'))
    function Fn() {
      const contextValue = useContext(storeContext)
      console.log('Fn.render contextValue:', contextValue)
      const {value} = useAllstore(({value}) => ({value}))
      actual.push(value)
      console.log('Fn.render value:', value, 'subscriptions:', _subscriptions)
      if (value === value1.value) Object.assign(store, value2) && notify()
      //else console.log('RESOLVE') || resolve()
      return value
    }
  })
  console.log('PROMISE resolve')
  ReactDOM.unmountComponentAtNode(div)

  expect(actual).toEqual(expected)
})
*/
