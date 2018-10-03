/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import {storeLoader as swLoader} from './swStore'
import {storeLoader as hwLoader} from './hwStore'

export function preloadJobInput({dispatch, getState}) {
  console.log('preloadJobInput')
  swLoader.load({dispatch, getState})
  hwLoader.load({dispatch, getState})
}
