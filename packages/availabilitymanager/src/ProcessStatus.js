/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import {INIT, default as Status} from './Status'

import os from 'os'

export default class ProcessStatus extends Status {
  constructor(o = false) {
    super({...o, printable: 'Process', isUp: INIT, monitorSince: Date.now() - process.uptime()})
    const oneSecond = 1e3
    this.hostUpTimeval = Date.now() - os.uptime() * oneSecond
  }

  toLog() {
    const {monitorSince, hostUpTimeval} = this
    return `Monitoring, host up since: ${this.getISOTime(hostUpTimeval, false, true)} ms: ${Math.round(monitorSince % 1e3)}`
  }
}
