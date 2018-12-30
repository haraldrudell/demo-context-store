/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import React, { useState, useMemo } from 'react'
import { OrderedMap, Map } from 'immutable'

import { store, Store, connect, notify, useAllstore } from './allstore'

// the value slice
let sliceName = 'value' // modifiable to avoid collisions setSlicename(s)
const setValue = v => !isNaN(v = +v) && (store[sliceName] = v)
const incValue = () => ++store[sliceName]
const valueSelector = state => ({value: state[sliceName]})

// the records slice
let sliceName1 = 'records' // modifiable to avoid collisions setSlicename(s)
const setRecords = list => store[sliceName1] = OrderedMap(list.map(o => [o.id, Map(o)]))
const recordsSelector = (state, {id}) => ({record: state[sliceName1].get(id)})
const getRecord = r => (r && r.toJS()) || {}

// initialize the store
setValue(1)
setRecords([{id: 1, record: 'One'}, {id: 2, record: 'Two'}])

export default function App() {
  const [id, setId] = useState(2)
  const idActionBind = useMemo(() => idAction.bind(undefined, setId, id), [id])
  return <div style={{padding: '3em', display: 'flex', height: '15em', flexDirection: 'column', justifyContent: 'space-between', alignContent: 'start'}}>
    <div>Click Increment to update value with 1 s delay via connect store-subscription<br />
      <button onClick={valueAction}>Increment</button></div>
    <div>Click Change Id to display another record via useAllstore React 16.7 hook-subscription and OrderedMap access<br />
      <button onClick={idActionBind}>Change Id</button></div>
    <Store>
      <DisplayValue />
      <DisplayRecord id={id} />
    </Store>
    <div>Written by Harald Rudell harald.rudell@gmail.com (http://www.haraldrudell.com)</div>
  </div>
}
const idAction = (setId, id, e) => setId(3 - id)
const valueAction = () => fetchValue().catch(console.error)

// fetch function, like a thunk
async function fetchValue() {
  await second() // faked fetch delay
  incValue(); notify()
}
const second = async () => new Promise(resolve => setTimeout(resolve, 1e3))

const DisplayValue = connect(valueSelector)(({value}) =>
  <div>value: {String(value)}</div>)

function DisplayRecord({id}) {
  const {record: map} = useAllstore(recordsSelector, {id})
  const {record} = getRecord(map)
  return <div>id: {id} record: {record || ''}</div>
}
