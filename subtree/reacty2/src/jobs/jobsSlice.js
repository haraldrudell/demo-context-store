/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import {StoreSlice} from 'apputil'
import {getJobs, createJob as createJobApi} from 'api'
import {OrderedMap, fromJS, Map} from 'immutable'

class JobsSlice extends StoreSlice {
  async invokeApi() {
    return getJobs()
  }

  setSliceName(sliceName) {
    super.setSliceName(sliceName)
    this.ADD_ONE = `${sliceName}_ADD_ONE`
  }

  addOne({data}) { // action creator
    const {ADD_ONE: type} = this
    console.log(`${this._name}: ${type} data:`, data)
    const action = {type}
    if (data != null) action.data = fromJS(data) // Map
    return action
  }

  // create job thunk
  createJob = o => async (dispatch) => this._createJob(dispatch, o).catch(e => dispatch({type: this.SET_ERROR, e})).catch(console.error)

  async _createJob(dispatch, createObject) {
    const newJob = await createJobApi(createObject)
    dispatch(this.addOne({data: newJob}))
  }

  reducer(stateSlice = Map(), action) {
    const {ADD_ONE} = this
    switch(action.type) {
    case ADD_ONE:
      const {sliceName, eSlice, dataSlice} = this

      // debug
      const display = stateSlice instanceof Map ? `Map:${stateSlice.size}:${stateSlice.keySeq().toArray().join('\x20').substring(0, 20)}` : stateSlice
      console.log(`${sliceName} ${ADD_ONE}: ${display} action:`, action)

      // get action data
      let {data} = action
      const id = data.get('id')

      // get existing data
      const ee = stateSlice.get(eSlice)
      const oMap = stateSlice.get(dataSlice)

      // create new OrderedMap
      const newOMap = oMap ? oMap.set(id, data) : new OrderedMap([[id, data]])

      // construct new stateSlice
      const newMapArg = [[dataSlice, newOMap]]
      ee && newMapArg.push([eSlice, ee])
      return new Map(newMapArg)
    default: return super.reducer(stateSlice, action)
    }
  }
}

const instance = new JobsSlice()

export const setSliceName = instance.setSliceName
export const reducer = instance.reducer
export const createJob = instance.createJob
export const loadJobs = instance.load
export const getSliceData = instance.getSliceData
