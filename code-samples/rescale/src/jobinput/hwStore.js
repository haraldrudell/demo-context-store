/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import {getHardware} from '../api'
import StoreLoader from '../loadindicator/StoreLoader'

const sliceName = 'hw'
export const storeLoader = new StoreLoader({sliceName, apiMethod: getHardware})
export const eSlice = storeLoader.eSlice
export const dataSlice = storeLoader.dataSlice
export const hw = storeLoader.reducer
