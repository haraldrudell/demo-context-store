/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import React, { memo } from 'react'
import { OrderedMap, Map } from 'immutable'

import { Store, PlainStore, connect } from 'allstore'

class DemoStore extends PlainStore { // encapsulates immutable and store slice names
  setValue = v => (this.state.value = +v) & 0 || this
  incValue = () => (this.state.value++) & 0 || this
  valueSelector = ({value}) => ({value})

  setRecords = list => (this.state.records = OrderedMap(list.map(o => [o.id, Map(o)]))) && this
  recordsSelector = ({records}, {id}) => ({record: records.get(id)})
  getRecord = r => (r && r.toJS()) || {}
}

const store = new DemoStore().setValue(1).setRecords([{id: 1, record: 'One'}, {id: 2, record: 'Two'}])

export default () =>
  <div style={{padding: '3em', display: 'flex', height: '10em', flexDirection: 'column', justifyContent: 'space-between'}}>
    <div>Click update to increment with 1 s delay<br />
    Record demonstrates access of OrderedMap</div>
    <Store store={store}>
      <DisplayValue />
      <DisplayRecord id={2} />
    </Store>
    <div>Written by Harald Rudell harald.rudell@gmail.com (http://www.haraldrudell.com)</div>
  </div>

// fetch function, like a thunk
const second = async () => new Promise(resolve => setTimeout(resolve, 1e3))
async function fetchValue() {
  await second() // faked fetch delay
  store.incValue().notify()
}

const valueAction = () => fetchValue().catch(console.error)
const DisplayValue = connect(store.valueSelector)(({value}) =>
  <div>value: {String(value)}&emsp;<button onClick={valueAction}>Update</button></div>)

const DisplayRecord = connect(store.recordsSelector)(memo(({id, record}) =>
  <div>id: {id} record: {store.getRecord(record).record || ''}</div>))
