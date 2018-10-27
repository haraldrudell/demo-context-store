/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
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
    this.SET_RESULT = `SET_RESULT_${sliceName}`
    this.ADD_ONE = `ADD_ONE_${sliceName}`
    this._name = `${sliceName}SliceInstance`
  }

  // load thunk
  load = () => async (dispatch) => this._doGetJobs(dispatch).catch(e => dispatch({type: this.SET_RESULT, e})).catch(console.error)

  async _doGetJobs(dispatch) {
    const apiData = await this.invokeApi()
    let e, data
    if (Array.isArray(apiData)) {
      data = new OrderedMap(apiData.map(job => [job.id, fromJS(job)]))
      //data = fromJS(data)
    } else e = new Error('setResult: data not array')
    dispatch({type: this.SET_RESULT, e, data})
  }

  async invokeApi() {
    throw new Error(`invokeApi not overridden`)
  }

  addOne({data, e}) { // action creator
    const {ADD_ONE: type} = this
    console.log(`${this._name}: ${type} e:`, e && e.message, 'data:', data)
    if (data != null) data = fromJS(data) // Map
    if (e && !(e instanceof Error)) e = new Error(`value: ${e}`)
    return {type, e, data}
  }

  reducer(stateSlice = Map(), action) {
    const {sliceName, eSlice, dataSlice, SET_RESULT, ADD_ONE} = this
    const display = stateSlice instanceof Map ? `Map:${stateSlice.size}:${stateSlice.keySeq().toArray().join('\x20').substring(0, 20)}` : stateSlice
    switch(action.type) {
    case SET_RESULT:
      console.log(`${this._name} ${SET_RESULT}: ${display} action:`, action)
      let {e, data} = action
      if (e === undefined && data === undefined) return stateSlice
      const oldMap = stateSlice[sliceName] || Map()
      e === undefined && (e = oldMap.get(eSlice))
      data === undefined && (data = oldMap.get(dataSlice))
      return new Map([
        [eSlice, e],
        [dataSlice, data],
      ])
    case ADD_ONE:
      console.log(`${sliceName} reducer state: ${display} action:`, action)
      // get the action data
      let {e: ee, data: data2} = action
      const id = data2.get('id')

      // ensure we have the new error
      if (ee === undefined) ee = stateSlice.get(eSlice)

      // get the new ordered map
      const oMap = stateSlice.get(dataSlice)
      const newOMap = oMap ? oMap.set(id, data2) : new OrderedMap([[id, data2]])

      // prepare for Map construction
      const constrArg = [[dataSlice, newOMap]]
      ee && constrArg.push([eSlice, ee])

      return new Map(constrArg)
    default: return stateSlice
    }
  }

  getSliceData(state) {
    const value = state[this.sliceName]
    return {
      e: value && value.get(this.eSlice),
      data: value && value.get(this.dataSlice),
    }
  }
}
