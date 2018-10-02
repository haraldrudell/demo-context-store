/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import {jobs} from './jobsstore'
import {area} from './areastore'

export const store = createStore(
  combineReducers({
    jobs,
    area,
  }),
  {},
  applyMiddleware(thunk)
)
