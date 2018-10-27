/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import {
  reducer as jobsReducer,
  setSliceName as jobsName,
} from 'jobs'
import {
  reducer as areaReducer,
  setSliceName as areaName} from 'dataarea'
import {
  reducerHw,
  setSliceNameHw,
  reducerSw,
  setSliceNameSw,
} from  'jobinput'

let reducers = {}

addSlice('area', areaReducer, areaName)
addSlice('jobs', jobsReducer, jobsName)
addSlice('hw', reducerHw, setSliceNameHw)
addSlice('sw', reducerSw, setSliceNameSw)

export const store = createStore(combineReducers(reducers), applyMiddleware(thunk))
reducers = null

function addSlice(sliceName, reducer, setSliceName) {
  setSliceName(sliceName)
  reducers[sliceName] = reducer
}
