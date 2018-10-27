/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
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
