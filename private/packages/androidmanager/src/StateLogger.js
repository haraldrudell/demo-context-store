/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import Logger from './Logger'

const m = 'StateLogger'

// in AndroidManager, make StateLogger the only invocation
// npm start -- --serial 988954414744535835
export default class StateLogger extends Logger {
  constructor(adb) { // AdbShim: .directory .devicesDirectory
    super(adb, 'state.yaml')
  }

  /*
  AsyncModerator invokes next: {
    value: function returning a promise
    done: boolean
  }
  if done is false, value is a function returning a promise
  if done is true, value is a return value
  */
  async next() {
    if (this.isDone) return StateLogger.done
    this.isDone = true
    return {value: () => this.run()} // only runs once
  }

  async run() {
    const {deviceName, now} = this

    // last seen
    const state = await this.getState()
    if (!state.firstSeen) state.firstSeen = now
    state.lastSeen = now
    await this.writeState(state)

    // uptime
    const uptime = await this.getUptime() // {utc, local}
    const reboots = Array.isArray(state.reboots) ? state.reboots : [] // ensure array
    if (!this.utcSame(uptime, reboots[0])) {
      if (!reboots.length) state.reboots = reboots
      uptime.seenOn = now
      reboots.unshift(uptime)
      await this.writeState(state)
      console.log(`\nReboot detected for  ${deviceName} on ${uptime.local}\n`)
    }

    // root state
    const root = await this.hasSu(this.adb)
    const roots = Array.isArray(state.roots) ? state.roots : [] // ensure array
    if (root !== Object(roots[0]).root) {
      if (!roots.length) state.roots = roots
      roots.unshift({root, seenOn: now})
      await this.writeState(state)
      console.log(`\nNew root status for ${deviceName}: ${root}\n`)
    }

    if (!root) return // cannot do partitions without root
    await this.readPartitions()
  }

  async readPartitions() {
    const {adb} = this
    const partCrc = await adb.shell('su 0 /data/hq/bin/partcrc2')
    console.log(typeof partCrc, Object(partCrc).length, '[', partCrc, ']')

  }

  utcSame(utcDev, utcStored) { // {utc, local}
    // utc: '2017-11-01T21:47:00.000Z'
    const diffMs = Date.parse(Object(utcDev).utc) - Date.parse(Object(utcStored).utc)
    return !isNaN(diffMs) // NaN: one or both missing
      ? Math.abs(diffMs) < 120e3 // within 120 s
      : false
  }

  async getUptime() { // accuracy is 1 min: [ -1…+60 s]
    const sinceMs = await this.getUptimeTimeval()
    const deviceNow = await this.getNowTimeval()
    const minuteMs = 60e3
    const utcMs = deviceNow - sinceMs
    const utc = new Date(utcMs).toISOString()
    const local = this.getISOTime(utcMs)
    return {utc, local}
  }

  async getNowTimeval() {
    const {adb} = this
    const T171225ms = 1514236966000
    // string 10 '1514236966'
    const deviceNowEpochString = await adb.shell('date +%s')
    const deviceNow = Number(deviceNowEpochString) * 1e3
    if (!(deviceNow > T171225ms)) throw new Error(`${m}: bad response from Android date: '${deviceNowEpochString}'`)
    return deviceNow
  }

  async getUptimeTimeval() {
    const {adb} = this
    const minuteMs = 60e3
    const hourMs = 60 * minuteMs
    const dayMs = 24 * hourMs

    // 171225 hr: Android until 7.1.2 does not support uptime --since
    // string 71
    // ' 13:22:46 up 54 days, 31 min,  0 users,  load average: 7.06, 6.92, 7.01'
    // ' 13:56:26 up 54 days,  1:04,  0 users,  load average: 6.63, 6.89, 7.09'
    const uptime = await adb.shell('uptime')
    /* [0: matched string, 1: days
    2: hours or minutes
    3: colon-space-possible minutes
    4: undefined or minutes
    */
    const match = uptime.match(/[^u]+up ([\d]+) days, *([^: ]+)(:([^, ]+)| ).*/)
    const hasColon = match && match[4] !== undefined
    const days = Number(match && match[1])
    const hours = hasColon ? Number(match[2]) : 0
    const mins = match && Number(match[hasColon ? 4 : 2])
    if (!match || !(days >= 0) || !(hours >= 0) || !(mins >= 0)) throw new Error(`${m}: bad response from Android uptime: '${uptime}'`)
    return days * dayMs +
      hours * hourMs +
      mins * minuteMs
  }
}
