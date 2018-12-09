/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import React, { memo } from 'react'
import { OrderedMap, Map } from 'immutable'

import { Store, plainStore, connect } from 'allstore'

const store0 = {value: 1, records: OrderedMap([[1, 'One'], [2, 'Two']])}

export default () =>
  <div style={{padding: '3em', display: 'flex', height: '10em', flexDirection: 'column', justifyContent: 'space-between'}}>
    <div>Click update to increment with 1 s delay<br />
    Record demonstrates access of OrderedMap</div>
    <Store store={store0}>
      <DisplayValue />
      <DisplayRecord id={2} />
    </Store>
  </div>

// fetch function, like a thunk
const valueAction = () => fetchValue().catch(console.error)
const second = async () => new Promise(resolve => setTimeout(resolve, 1e3))
async function fetchValue() {
  await second() // faked fetch delay
  plainStore.getState().value++ // just DoIt
  plainStore.notify() // all subscribers check their props for re-render
}

const DisplayValue = connect(({value}) => ({value}))(({value}) =>
  <div>value: {String(value)}&emsp;<button onClick={valueAction}>Update</button></div>)

const recordSelector = ({records}, {id}) => ({record: (records || Map()).get(id)})
const DisplayRecord = connect(recordSelector)(memo(({id, record}) =>
  <div>id: {String(id)} record: {String(record)}</div>))
