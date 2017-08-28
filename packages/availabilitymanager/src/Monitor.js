/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import NetworkMonitor from './NetworkMonitor'
import os from 'os'
import {options as syslogOptions, default as log} from './SysLog'

export default class Monitor {
  constructorMap = {
    NetworkMonitor: NetworkMonitor,
  }

  constructor(o) {
    const {monitor, profile} = (o || false)
    if (!Array.isArray(monitor)) throw new Error(`Profile ${profile}: monitor not list`)
    const now = Date.now()
    const uptime_s = os.uptime()
    const process_ms = process.uptime()
    const status = this.status = {
      computer: now - uptime_s * 1e3,
      process: now - process_ms,
    }
    console.log(`Computer up since ${this.getISOTime(status.computer)} monitor: ${this.getISOTime(status.process)}`)
    syslogOptions.appName = o.cmdName
    log('syslogs').then(e => !e ? console.log('log complete') : console.error('syslog failed:', e))
  }

  eventConsumer(o) {
  }

  getISOTime(timeval) {
    const tzAddMin = -new Date().getTimezoneOffset()
    const s = new Date(timeval + tzAddMin * 6e4).toISOString()
    const tzMin = Math.abs(tzAddMin)
    const tzString =
      `${tzAddMin < 0 ? '-' : '+'}` +
      `${tzMin < 600 ? '0' : ''}` +
      `${Math.floor(tzMin / 60)}` +
      `${tzMin % 60 > 0 ? Math.floor(tzMin % 60) : ''}`
    return `${s.substring(0, 10)} ${s.substring(11,19)}${tzString}`
  }
}
