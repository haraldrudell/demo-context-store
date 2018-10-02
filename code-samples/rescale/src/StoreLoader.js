/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import {OrderedMap, fromJS} from 'immutable'

export default class StoreLoader {
  static SET_RESULT = 'SET_RESULT'

  constructor({sliceName, apiMethod}) {
    this.eSlice = `${sliceName}error`
    this.dataSlice = `${sliceName}`
    Object.assign(this, {sliceName, apiMethod})
  }

  load({dispatch, getState}) {
    return this._doGetJobs(dispatch).catch(e => dispatch(this._setResult(e)))
  }

  async _doGetJobs(dispatch) {
    dispatch(this._setResult(undefined, await this.apiMethod()))
  }

  _setResult(e, data) { // action creator
    const {SET_RESULT} = StoreLoader
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

  _reducer(stateSlice = Map(), action) { // jobs store-slice reducer
    const {SET_RESULT} = StoreLoader
    const {sliceName, eSlice, dataSlice} = this
    console.log('jobs reducer state:', stateSlice, 'action:', action)
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
    }
    return stateSlice
  }
}