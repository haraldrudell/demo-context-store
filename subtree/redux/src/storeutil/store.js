/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import {
  reducer as jobsReducer,
  setSliceName as jobsName,
} from 'jobs/jobsSlice'
import {
  reducer as asReducer,
  setSliceName as asName} from 'dataarea/AreaSlice'
import {
  reducer as swReducer,
  setSliceName as swName
} from 'jobinput/swSlice'
import {
  reducer as hwReducer,
  setSliceName as hwName
} from  'jobinput/hwSlice'

let reducers = {}

addSlice('area', asReducer, asName)
addSlice('jobs', jobsReducer, jobsName)
addSlice('hw', hwReducer, hwName)
addSlice('sw', swReducer, swName)

export const store = createStore(combineReducers(reducers), applyMiddleware(thunk))
reducers = null

function addSlice(sliceName, reducer, setSliceName) {
  setSliceName(sliceName)
  reducers[sliceName] = reducer
}
