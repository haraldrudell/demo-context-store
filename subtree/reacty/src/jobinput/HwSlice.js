/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import {getHardware} from 'api/api'
import StoreSlice from 'loadindicator/StoreSlice'

export let instance

export default class HwSlice extends StoreSlice {
  constructor({sliceName}) {
    super({sliceName, apiMethod: getHardware})
    instance = this
  }
}
