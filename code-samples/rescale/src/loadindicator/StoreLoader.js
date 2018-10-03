/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import {OrderedMap, fromJS, Map} from 'immutable'

export default class StoreLoader {
  reducer = this.reducer.bind(this)
  load = this.load.bind(this)

  constructor({sliceName, apiMethod}) {
    this.eSlice = `${sliceName}error`
    this.dataSlice = `${sliceName}`
    this.SET_RESULT = `SET_RESULT_${sliceName}`
    this.ADD_ONE = `ADD_ONE_${sliceName}`
    Object.assign(this, {sliceName, apiMethod})
  }

  load({dispatch, getState}) {
    return this._doGetJobs(dispatch).catch(e => dispatch(this._setResult(e)))
  }

  async _doGetJobs(dispatch) {
    dispatch(this._setResult(undefined, await this.apiMethod()))
  }

  _setResult(e, data) { // action creator
    const {SET_RESULT} = this
    console.log('action:', SET_RESULT, 'e:', e && e.message, 'data:', data)
    if (data != null) {
      if (Array.isArray(data)) {
        data = new OrderedMap(data.map(job => [job.id, fromJS(job)]))
        //data = fromJS(data)
      } else if (!e) e = new Error('setResult: data not array')
    }
    if (e && !(e instanceof Error)) e = new Error(`value: ${e}`)
    return {
      type: SET_RESULT,
      e,
      data,
    }
  }

  addOne(e, data) {
    const {ADD_ONE} = this
    console.log('action:', ADD_ONE, 'e:', e && e.message, 'data:', data)
    if (data != null) data = fromJS(data) // Map
    if (e && !(e instanceof Error)) e = new Error(`value: ${e}`)
    return {
      type: ADD_ONE,
      e,
      data,
    }

  }

  reducer(stateSlice = Map(), action) { // jobs store-slice reducer
    const {sliceName, eSlice, dataSlice, SET_RESULT, ADD_ONE} = this
    console.log(`${sliceName} reducer state:`, stateSlice, 'action:', action)
    // eslint-disable-next-line
    switch(action.type) {
    case SET_RESULT:
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
}