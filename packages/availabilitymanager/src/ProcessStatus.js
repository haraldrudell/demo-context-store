/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import Status from './Status'

import os from 'os'

export default class ProcessStatus extends Status {
  constructor(o = false) {
    super({...o, printable: 'Process', isUp: true, lastFunctional: 1, everWorked: true})
    const oneSecond = 1e3
    const host_uptime_ms = os.uptime() * oneSecond
    const process_ms = process.uptime()
    this.hostUpTimeval = this.now - host_uptime_ms
    this.processTimeval = this.now - process_ms
  }

  toLog() {
    return `Monitoring since ${this.getISOTime(this.processTimeval, false, true)}. ` +
      `Host up since: ${this.getISOTime(this.hostUpTimeval, false, true)} ` +
      `ms: ${this.now % 1e3}`
  }
}
