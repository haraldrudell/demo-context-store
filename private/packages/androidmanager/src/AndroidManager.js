/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import AsyncModerator from './AsyncModerator'
import ApkCopier from './ApkCopier'
import AdbShim from './AdbShim'
import StateLogger from './StateLogger'
import PartitionLogger from './PartitionLogger'
import UserDataLogger from './UserDataLogger'

import fs from 'fs-extra'

export default class AndroidManager {
  async run(o) {
    const options = {
      directory: '/x/tostorage/devices/generic/apk',
      devicesDirectory: '/x/tostorage/devices',
      sixDay: this.getSixDay(),
    }
    const d = options.directory
    if (!await fs.pathExists(d)) throw new Error(`Directory does not exist: ${d}`)

    const asyncModerator = new AsyncModerator(60)
    asyncModerator.promise.then(this.done).catch(this.errorHandler)

    const serials = o.serial ? [o.serial] : await AdbShim.getSerials()
    for (let serial of serials) {
      const adb = Object.assign(new AdbShim({serial}), options)
      await adb.getDeviceName(true)
      console.log(`name: ${adb.deviceName} serial: ${serial}`)
      //asyncModerator.addAsyncIterator(new ApkCopier(adb))
      //asyncModerator.addAsyncIterator(new StateLogger(adb))
      //asyncModerator.addAsyncIterator(new PartitionLogger(adb))
      asyncModerator.addAsyncIterator(new UserDataLogger(adb))
    }
    asyncModerator.setAllSubmitted()
  }

  done = v => console.log(`AndroidManager successful exit`)

  getSixDay() {
    const msDiff = -new Date().getTimezoneOffset() * 60000
    const date = new Date(Date.now() + msDiff).toISOString()
    return `${date.substring(2, 4)}${date.substring(5, 7)}${date.substring(8, 10)}`
  }

  errorHandler = e => {
    console.error('\nAndroidManager.errorHandler invoked:')
    console.error(e)
    console.error(new Error('errorHandler invocation'))
    process.exit(1)
  }
}
