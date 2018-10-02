/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import {fromJS} from 'immutable'
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
  console.log('setResult')
  if (data != null) {
    if (Array.isArray(data)) {
      data = fromJS(data)
    } else if (!e) e = new Error('setResult: data not array')
  }
  if (e && !(e instanceof Error)) e = new Error(`value: ${e}`)
  return {
    type: SET_RESULT,
    e,
    data,
  }
}

export function reducer(state = {}, action) {
  console.log('reducer state:', state, 'action:', action)
  if (action.type === SET_RESULT) {
    const {e, data} = action
    let isChanged
    const newState = {...state}
    e !== undefined && (isChanged = true) && (newState[eSlice] = e)
    data !== undefined && (isChanged = true) && (newState[dataSlice] = data)
    if (isChanged) {
      console.log('reducer state-out:', newState)
      return newState
    }
  }
  return state
}
