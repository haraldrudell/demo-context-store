/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import { createStore, combineReducers } from 'redux'
import JobsSlice from 'jobs/JobsSlice'
import AreaSlice from 'dataarea/AreaSlice'
import SwSlice from 'jobinput/SwSlice'
import HwSlice from  'jobinput/HwSlice'

export const store = getStore({
  jobs: JobsSlice,
  area: AreaSlice,
  hw: HwSlice,
  sw: SwSlice,
})

function getStore(slices) {
  const reducers = {}
  const actions = {}
  const sliceInstances = []

  for (let [sliceName, constr] of Object.entries(slices)) {
    const slice = new constr({sliceName})
    sliceInstances.push(slice)
    if (slice.getActions) {
      const a = slice.getActions()
      for (let [action, fn] of Object.entries(a)) {
        if (actions[action]) throw new Error(`Duplicate action: ${action}`)
        actions[action] = fn
      }
    }
    reducers[sliceName] = slice.reducer
  }

  const storeInstance = createStore(combineReducers(reducers))
  if (Object.keys(actions).length) storeInstance.dispatch.actions = actions
  const {dispatch, getState} = storeInstance
  sliceInstances.forEach(slice => slice.setDispatch && slice.setDispatch({dispatch, getState}))

  return storeInstance
}
