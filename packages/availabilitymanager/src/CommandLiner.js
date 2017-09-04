/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import {UP, DOWN} from './Status'
import CommandMonitor from './CommandMonitor'

const oneSecond = 1e3
const tenSeconds = 1e4

export default class CommandLiner extends CommandMonitor {
  constructor(o) {
    super(o || false)
    const {interval, spawn, timeout} = o || false
    this.everWorked = false
    const interval2 = interval >= oneSecond ? Number(interval) : tenSeconds
    this.timeout = timeout >= 2 * interval2 ? Number(timeout) : 2 * interval2
    setInterval(this.checkTimeout, interval2)
    this.issueCommand({...spawn, lineFn: this.ipLine})
  }

  checkTimeout = () => (async () => {
    const firstFailure = Date.now()
    const {lastFunctional, monitorSince, timeout} = this
    const t0 = Math.max(lastFunctional, monitorSince)
    if (firstFailure - t0 >= timeout) // timeout has elapsed
      if (this.isSelfUp() || this.hadNoUpDownEvents()) // we are up or have the first event
        this.updateStatus({isUp: DOWN, firstFailure, lastFunctional})
  })().catch(this.errorHandler)

  ipLine = line => (async () => {
    const upSince = this.lastFunctional = Date.now()
    !this.isSelfUp() && this.updateStatus({isUp: UP, upSince})
  })().catch(this.errorHandler)
}
