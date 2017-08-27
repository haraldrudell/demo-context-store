/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/

import fs from 'fs-extra'

export default class AvailabilityManager {
  async run(o) {
    process.nextTick(() => {throw new Error('uncaught')})
    console.log('AvailabilityManager.run')
  }

  errorHandler = e => {
    console.error('\AvailabilityManager.errorHandler invoked:')
    console.error(e)
    console.error(new Error('errorHandler invocation'))
    process.exit(1)
  }
}
