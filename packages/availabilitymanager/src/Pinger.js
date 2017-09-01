/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import CommandMonitor from './CommandMonitor'

const oneSecond = 1e3
const tenSeconds = 1e4

export default class Pinger extends CommandMonitor {
  constructor(o) {
    super(o || false)
    const {interval, spawn, timeout} = o || false
    this.everWorked = false
    const interval2 = interval >= oneSecond ? Number(interval) : tenSeconds
    this.timeout = timeout >= 2 * interval2 ? Number(timeout) : 2 * interval2
    setInterval(this.checkTimeout, interval2)
    this.issueCommand({...spawn, lineFn: this.ipLine})
    this.timerStart = Date.now()
  }

  checkTimeout = () => (async () => {
    if (this.isSelfUp() || this.hadNoSelfEvents()) {
      const now = Date.now()
      if (now - this.timerStart > this.timeout) this.updateStatus(false, now, this.timerStart, this.everWorked)
    }
  })().catch(this.errorHandler)

  ipLine = line => (async () => {
    const now = Date.now()
    if (!this.everWorked) this.everWorked = true
    !this.isSelfUp() && this.updateStatus(true, now, this.timerStart, this.everWorked)
    this.timerStart = now
  })().catch(this.errorHandler)
}
