/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import {StoreSlice} from 'apputil'
import {getSoftware} from 'api'

class SwSlice extends StoreSlice {
  async invokeApi() {
    return getSoftware()
  }
}

const instance = new SwSlice()

export const setSliceName = instance.setSliceName
export const reducer = instance.reducer
export const loadSw = instance.load
export const getSliceData = instance.getSliceData
