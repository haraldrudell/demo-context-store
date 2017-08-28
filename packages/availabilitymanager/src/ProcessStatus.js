/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import Status from './Status'

import os from 'os'

export default class ProcessStatus extends Status {
  constructor() {
    super()
    const now = Date.now()
    const uptime_s = os.uptime()
    const process_ms = process.uptime()
    this.computer = now - uptime_s * 1e3
    this.process = now - process_ms
    this.id = 'process'
  }
  toLog() {
    return `Monitoring started. host up since: ${this.getISOTime(this.computer)}`
  }
  toString() {
    return `Monitoring up since: ${this.getISOTime(this.process)} host: ${this.getISOTime(this.computer)}`
  }
}