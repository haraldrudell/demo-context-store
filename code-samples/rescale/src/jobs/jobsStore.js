/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import {getJobs} from '../api'
import StoreLoader from '../loadindicator/StoreLoader'

export const sliceName = 'jobs'
export const storeLoader = new StoreLoader({sliceName, apiMethod: getJobs})
export const eSlice = storeLoader.eSlice
export const dataSlice = storeLoader.dataSlice
export const jobs = storeLoader.reducer
