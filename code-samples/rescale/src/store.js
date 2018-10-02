/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import {reducer} from './jobsstore'

export const store = createStore(
  combineReducers({
    reducer,
  }),
  {},
  applyMiddleware(thunk)
)
