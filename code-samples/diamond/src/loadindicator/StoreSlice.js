/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import {OrderedMap, fromJS, Map} from 'immutable'

export default class StoreSlice {
  reducer = this.reducer.bind(this)
  dispatch = () => this._notFn('dispatch')
  getState = () => this._notFn('getState')
  apiMethod = () => this._notFn('apiMethod')

  constructor({sliceName, apiMethod}) {
    if (!sliceName) throw new Error(`${this._name}: sliceName not set`)
    sliceName = String(sliceName)
    this.eSlice = `${sliceName}error`
    this.dataSlice = `${sliceName}`
    this.SET_RESULT = `SET_RESULT_${sliceName}`
    this.ADD_ONE = `ADD_ONE_${sliceName}`
    this._name = Object(this.constructor).name || 'StoreSlice'
    Object.assign(this, {sliceName, apiMethod})
  }

  setDispatch({dispatch, getState}) {
    typeof dispatch === 'function' && (this.dispatch = dispatch)
    typeof getState === 'function' && (this.getState = getState)
  }

  load = () => this._doGetJobs().catch(e => this._setResult(e)).catch(console.error)

  async _doGetJobs() {
    const {apiMethod} = this
    this._setResult(undefined, await apiMethod())
  }

  _setResult(e, data) { // action creator
    const {SET_RESULT: type, dispatch} = this
    console.log(`${this._name}: ${type} e:`, e && e.message, 'data:', data)
    if (data != null) {
      if (Array.isArray(data)) {
        data = new OrderedMap(data.map(job => [job.id, fromJS(job)]))
        //data = fromJS(data)
      } else if (!e) e = new Error('setResult: data not array')
    }
    if (e && !(e instanceof Error)) e = new Error(`value: ${e}`)
    dispatch({type, e, data})
  }

  addOne(e, data) {
    const {ADD_ONE: type, dispatch} = this
    console.log(`${this._name}: ${type} e:`, e && e.message, 'data:', data)
    if (data != null) data = fromJS(data) // Map
    if (e && !(e instanceof Error)) e = new Error(`value: ${e}`)
    dispatch({type, e, data})
  }

  reducer(stateSlice = Map(), action) { // jobs store-slice reducer
    const {sliceName, eSlice, dataSlice, SET_RESULT, ADD_ONE} = this
    const display = stateSlice instanceof Map ? `Map:${stateSlice.size}:${stateSlice.keySeq().toArray().join('\x20').substring(0, 20)}` : stateSlice
    // eslint-disable-next-line
    switch(action.type) {
    case SET_RESULT:
      console.log(`${sliceName} reducer state: ${display} action:`, action)
      let {e, data} = action
      if (e !== undefined || data !== undefined) {
        const oldMap = stateSlice[sliceName] || Map()
        e === undefined && (e = oldMap.get(eSlice))
        data === undefined && (data = oldMap.get(dataSlice))
        return new Map([
          [eSlice, e],
          [dataSlice, data],
        ])
      }
      break
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
    }
    return stateSlice
  }

  _notFn(name) {
    throw new Error(`${this._name}: ${name} not set`)
  }
}
