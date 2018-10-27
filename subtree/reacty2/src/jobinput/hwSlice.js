/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import {StoreSlice} from 'apputil'
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
export const getSliceData = instance.getSliceData
