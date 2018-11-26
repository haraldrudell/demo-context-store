/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import {StoreSlice} from 'storeutil'
import {getJobs, createJob as createJobApi} from 'api'

class JobsSlice extends StoreSlice {
  async invokeApi() {
    return getJobs()
  }

  // create job thunk
  createJob = o => async (dispatch) => this._createJob(dispatch, o).catch(e => dispatch({type: this.SET_RESULT, e})).catch(console.error)

  async _createJob(dispatch, createObject) {
    const newJob = await createJobApi(createObject)
    dispatch(this.addOne({data: newJob, dispatch}))
  }
}

const instance = new JobsSlice()

export const setSliceName = instance.setSliceName
export const reducer = instance.reducer
export const createJob = instance.createJob
export const loadJobs = instance.load
export const getSliceData = instance.getSliceData
