/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import {StoreSlice} from 'storeutil'
import {getHardware} from 'api'

class HwSlice extends StoreSlice {
  async invokeApi() {
    return getHardware()
  }
}

const instance = new HwSlice()

export const setSliceName = instance.setSliceName
export const reducer = instance.reducer
export const loadHw = instance.load
export const eSlice = instance.eSlice
export const dataSlice = instance.dataSlice
export const getSliceData = instance.getSliceData
