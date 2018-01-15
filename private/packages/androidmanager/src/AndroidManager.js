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
  directory = '/x/tostorage/devices/generic/apk'
  devicesDirectory = '/x/tostorage/devices'
  sixDay = this.getSixDay()
  concurrency = 60

  constructor(options) {
    const {debug, name, serials, onRejected, doApk, doState, doPartitions, doUserData} = options || false
    this.m = String(name || 'AndroidManager')
    const tf = typeof onRejected
    if (tf !== 'function') throw new Error(`${this.m} options.onRejected not function: ${tf}`)
    options = {doApk, doState, doPartitions, serials, doUserData}
    Object.assign(this, {debug, options, onRejected})
    this.asyncModerator = new AsyncModerator(this.concurrency)
  }

  async run() {
    const {debug, asyncModerator, directory, devicesDirectory, sixDay, options: {doApk, doState, doPartitions, doUserData, serials}} = this
    if (!await fs.pathExists(directory)) throw new Error(`${this.m} directory does not exist: ${directory}`)

    const serialsList = serials ? Array.isArray(serials) ? serials : [serials] : await AdbShim.getSerials()
    for (let serial of serialsList) {
      const adb = new AdbShim({serial})
      await adb.getDeviceName(true)
      console.log(`name: ${adb.deviceName} serial: ${serial}`)

      doApk && asyncModerator.addAsyncIterator(new ApkCopier({debug, adb, devicesDirectory, directory, sixDay}))
      doState && asyncModerator.addAsyncIterator(new StateLogger({debug, adb, devicesDirectory}))
      doPartitions && asyncModerator.addAsyncIterator(new PartitionLogger({debug, adb, devicesDirectory}))
      doUserData && asyncModerator.addAsyncIterator(new UserDataLogger({debug, adb, devicesDirectory}))
    }
    debug && console.log(`${this.m} all async iterator submitted`)
    asyncModerator.setAllSubmitted()
    await asyncModerator.promise
    console.log(`${this.m} successful exit`)
  }

  getSixDay() {
    const msDiff = -new Date().getTimezoneOffset() * 60000
    const date = new Date(Date.now() + msDiff).toISOString()
    return `${date.substring(2, 4)}${date.substring(5, 7)}${date.substring(8, 10)}`
  }
}
