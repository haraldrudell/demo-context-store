/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import {OrderedMap, fromJS, Map} from 'immutable'

export default class StoreSlice {
  reducer = this.reducer.bind(this)
  setSliceName = this.setSliceName.bind(this)
  getSliceData = this.getSliceData.bind(this)

  setSliceName(sliceName) {
    this.sliceName = String(sliceName || '')
    this.eSlice = `${sliceName}error`
    this.dataSlice = `${sliceName}`
    this.SET_RESULT = `${sliceName}_SET_RESULT`
    this.SET_ERROR = `${sliceName}_SET_ERROR`
    this._name = `${sliceName}SliceInstance`
  }

  // load thunk
  load = () => async dispatch => this.fetchData(dispatch).catch(e => dispatch({type: this.SET_ERROR, e})).catch(console.error)

  async fetchData(dispatch) {
    const {SET_RESULT, SET_ERROR} = this
    const apiData = await this.invokeApi()
    dispatch(Array.isArray(apiData)
      ? {type: SET_RESULT, data: new OrderedMap(apiData.map(job => [job.id, fromJS(job)]))}
      : {type: SET_ERROR, e: new Error('setResult: data not array')}
    )
  }

  async invokeApi() {
    throw new Error(`invokeApi not overridden`)
  }

  reducer(stateSlice = Map(), action) {
    const {SET_RESULT, SET_ERROR} = this
    switch(action.type) {
    case SET_RESULT:
    case SET_ERROR:
      return this.reducerResult(stateSlice, action)
    default: return stateSlice
    }
  }

  reducerResult(stateSlice, {e, data, type}) {
    const {sliceName, eSlice, dataSlice} = this

    // debug
    const display = stateSlice instanceof Map ? `Map:${stateSlice.size}:${stateSlice.keySeq().toArray().join('\x20').substring(0, 20)}` : stateSlice
    console.log(`${this._name} ${type}: ${display} data:`, data)

    // merge in existing data
    const oldMap = stateSlice[sliceName] || Map()
    e === undefined && (e = oldMap.get(eSlice))
    data === undefined && (data = oldMap.get(dataSlice))

    // construct the new stateSlice
    const newMapArg = []
    e && newMapArg.push([eSlice, e])
    data && newMapArg.push([dataSlice, data])
    return new Map(newMapArg)
  }

  getSliceData(state) { // selector
    const value = state[this.sliceName]
    return {
      e: value && value.get(this.eSlice),
      data: value && value.get(this.dataSlice),
    }
  }
}
