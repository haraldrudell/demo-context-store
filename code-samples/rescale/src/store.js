/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import {jobs} from './jobs/jobsStore'
import {area} from './dataarea/areaStore'
import {sw} from './jobinput/swStore'
import {hw} from  './jobinput/hwStore'

export const store = createStore(
  combineReducers({
    jobs,
    area,
    hw,
    sw,
  }),
  {},
  applyMiddleware(thunk)
)
