/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, { Component, memo } from 'react'
import { OrderedMap, Map } from 'immutable'

import Store, { plainStore } from './Store'
import { connect } from './connect'

export default class App extends Component {
  render() {
    return <Store store={{value: 1, records: OrderedMap([[1, 'One'], [2, 'Two']])}}>
      <DisplayValue />
      <DisplayRecord id={2} />
    </Store>
  }
}

// fetch function, like a thunk
const valueAction = () => fetchValue().catch(console.error)
const second = async () => new Promise(resolve => setTimeout(resolve, 1e3))
async function fetchValue() {
  await second() // faked fetch delay
  plainStore.getState().value++ // just DoIt
  plainStore.notify() // all subscribers check props for re-render
}

// Display the top-level store key: value
const valueSelector = ({value}) => ({value})
const DisplayValue = connect(valueSelector)(memo(({value}) =>
  <div>value: {String(value)}&emsp;<button onClick={valueAction}>Update</button></div>))

// Display a record by id
const recordSelector = ({records}, {id}) => ({record: (records || Map()).get(id)})
const DisplayRecord = connect(recordSelector)(memo(({id, record}) =>
  <div>id: {String(id)} record: {String(record)}</div>))
