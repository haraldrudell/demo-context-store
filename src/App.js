/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import React, {useState, useCallback, useRef, memo} from 'react'
import {OrderedMap, Map} from 'immutable'

import {store, Store, connect, notify, useAllstore} from './allstore'

// the value slice
let sliceName = 'value' // modifiable to avoid collisions setSliceName(s)
const setValue = v => !isNaN(v = +v) && (store[sliceName] = v)
const incValue = () => ++store[sliceName]
const valueSelector = state => ({value: state[sliceName]})

// the records slice
let sliceName1 = 'records' // modifiable to avoid collisions setSliceName(s)
const setRecords = list => store[sliceName1] = OrderedMap(list.map(o => [o.id, Map(o)]))
const recordsSelector = (state, {id}) => ({record: state[sliceName1].get(id)})
const getRecord = r => (r && r.toJS()) || {}

// initialize the store
setValue(1)
setRecords([{id: 1, record: 'One'}, {id: 2, record: 'Two'}])

export default memo(() => {
  const [id, setId] = useState(2)
  const idRef = useRef(id)
  idRef.current = id
  const idAction = useCallback(e => setId(3 - idRef.current), [])
  return <Store>
    <div style={{padding: '3em', display: 'flex', height: '30em', flexDirection: 'column', alignContent: 'start'}}>
      <h1>Demonstration of Allstore Single-Truth Store</h1>
      <p>94% less code-lines<br />
        &emsp;<a href="https://www.npmjs.com/package/allstore">Allstore at npm</a><br />
        &emsp;<a href="https://github.com/haraldrudell/demo-context-store/tree/master/src/allstore">Allstore source code</a><br />
      </p>
      <p>Click Increment to update value with 1 s delay via connect store-subscription<br />
        <button onClick={valueAction}>Increment</button></p>
      Click Change Id to display another record via:
      <ul style={{marginBlockStart: 0, marginBlockEnd: 0}}>
        <li>useAllstore React 16.7 hook-subscription and</li>
        <li>OrderedMap access</li>
      </ul>
      <div style={{marginBottom: '1em'}}><button onClick={idAction}>Change Id</button></div>
      <DisplayValue />
      <DisplayRecord id={id} />
      <p>Written by Harald Rudell harald.rudell@gmail.com (http://www.haraldrudell.com)</p>
    </div>
  </Store>
})
const valueAction = e => fetchValue().catch(console.error)

// fetch function, like a thunk
async function fetchValue() {
  await second() // faked fetch delay
  incValue(); notify()
}
const second = async () => new Promise(resolve => setTimeout(resolve, 1e3))

const DisplayValue = connect(valueSelector)(memo(({value}) =>
  <div>value: {String(value)}</div>))

const DisplayRecord = memo(({id}) => {
  const {record} = getRecord(useAllstore(recordsSelector, {id}).record)
  return <div>id: {id} record: {record || ''}</div>
})
