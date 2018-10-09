/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import {instance as swSlice} from './SwSlice'
import {instance as hwSlice} from './HwSlice'

export function preloadJobInput() {
  console.log('jobinput.preloadJobInput')
  swSlice.load()
  hwSlice.load()
}
