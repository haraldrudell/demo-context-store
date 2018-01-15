/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import yaml from 'js-yaml'
import fs from 'fs-extra'

import path from 'path'

export default class Logger {
  static done = {done: true}
  m = 'Logger constructor'
  /*
  adb.directory: '/x/tostorage/devices/generic/apk'
  adb.devicesDirectory: '/x/tostorage/devices'
  adb.serial
  adb.name: serial or deviceName (for unnamed devices)
  adb.deviceName: 's8plus' (it is verified that the device has a name)
  adb.sixDay: '171210' (local time zone)
  */
  constructor(o) { // AdbShim: .directory .devicesDirectory
    const {debug, adb, name} = o || false
    const deviceName = this.getNonEmptyString(adb, 'deviceName')
    this.m = `${name || 'Logger'} device ${deviceName}`
    const devicesDirectory = this.getNonEmptyString(o, 'devicesDirectory')
    const deviceDirectory = path.join(devicesDirectory, deviceName)
    const stateFile = path.join(deviceDirectory, this.getNonEmptyString(o, 'stateFile'))
    const nowT = Date.now()
    const now = new Date(nowT).toISOString()
    Object.assign(this, {debug, adb, deviceName, nowT, now, stateFile})
  }

  getNonEmptyString(o, prop) {
    const value = Object(o)[prop]
    const tv = typeof value
    if (!value || tv !== 'string') throw new Error(`${this.m} option '${prop}' not non-emoty string: ${tv}`)
    return value
  }

  async getRoot() {
    if (this.rqRoot) return
    this.rqRoot = true
    const {adb} = this
    const timer = setTimeout(() => console.log(`\nWaiting for root grant on ${this.deviceName}\n`), 1e3)
    const user = await adb.shell('su 0 whoami')
    clearTimeout(timer)
    if (user !== 'root') throw new Error(`${this.m}: device ${this.deviceName}: root denied`)
  }

  async hasSu() {
    const {adb} = this
    const suPath = await adb.shell('which su')
    if (suPath) {
      if (!suPath.endsWith('/su')) throw new Error(`${this.m}: bad response from Android which: '${suPath}'`)
    }
    return !!suPath
  }

  async getState() {
    const {stateFile} = this
    const v = await fs.pathExists(stateFile) && yaml.safeLoad(await fs.readFile(stateFile, 'utf-8'))
    return v || {}
  }

  async writeState(state) {
    return fs.writeFile(this.stateFile, yaml.safeDump(state))
  }

  // TODO 171225 hr: from availer/Status.js, should be in some package
  getISOTime(timeval, withMs, noTz) {
    if (!(timeval >= 0)) throw new Error(`Status.getISOTime: timeval not number >= 0: ${typeof timeval}`)
    const tzAddMin = -new Date().getTimezoneOffset()
    const s = new Date(timeval + tzAddMin * 6e4).toISOString() // 2017-09-01T19:02:46.322Z
    const endIndex = !withMs ? 19 : 23
    const day = s.substring(0, 10) // 2017-09-01
    const time = s.substring(11, endIndex) // 19:02:46 [.322]
    let result = `${day} ${time}`

    const withTz = !noTz
    if (withTz) {
      const tzMin = Math.abs(tzAddMin)
      const tzString = // '-07'
        `${tzAddMin < 0 ? '-' : '+'}` +
        `${tzMin < 600 ? '0' : ''}` +
        `${Math.floor(tzMin / 60)}` +
        `${tzMin % 60 > 0 ? Math.floor(tzMin % 60) : ''}`
      result += tzString
    }

    return result
  }
}
