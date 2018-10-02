/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import {fromJS, OrderedMap, Map} from 'immutable'
import {getJobs} from './api'

export const eSlice = 'jobserror'
export const dataSlice = 'jobs'

const SET_RESULT = 'SET_RESULT'

export function loadJobs(dispatch, getState) {
  return doGetJobs(dispatch).catch(e => dispatch(setResult(e)))
}

async function doGetJobs(dispatch) {
  dispatch(setResult(undefined, await getJobs()))
}

function setResult(e, data) {
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

export function jobs(stateSlice = Map(), action) { // jobs store-slice reducer
  console.log('jobs reducer state:', stateSlice, 'action:', action)
  // eslint-disable-next-line
  switch(action.type) {
  case SET_RESULT:
    let {e, data} = action
    if (e !== undefined || data !== undefined) {
      const oldMap = stateSlice[jobs.name] || Map()
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
