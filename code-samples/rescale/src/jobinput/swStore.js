/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import {getSoftware} from '../api'
import StoreLoader from '../loadindicator/StoreLoader'

const sliceName = 'sw'
export const storeLoader = new StoreLoader({sliceName, apiMethod: getSoftware})
export const eSlice = storeLoader.eSlice
export const dataSlice = storeLoader.dataSlice
export const sw = storeLoader.reducer