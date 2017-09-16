/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import {UP, DOWN, getISOTime} from './Status'
import CommandMonitor from './CommandMonitor'

const oneSecond = 1e3
const tenSeconds = 1e4

export default class CommandLiner extends CommandMonitor {
  constructor(o) {
    super(o || false)
    const {interval, spawn, timeout, warning} = o || false
    const interval2 = interval >= oneSecond ? Number(interval) : tenSeconds
    this.timeout = timeout >= 2 * interval2 ? Number(timeout) : 2 * interval2
    this.warning = warning >= 0 ? Number(warning) : 0
    setInterval(this.checkTimeout, interval2)
    this.issueCommand({...spawn, lineFn: this.ipLine})
  }

  checkTimeout = () => (async () => {
    const firstFailure = Date.now()
    if (this.getOverage(firstFailure, this.timeout)) // timeout has elapsed
      if (this.isSelfUp() || this.hadNoUpDownEvents()) { // we are up or have the first event
        const {lastFunctional} = this
        this.updateStatus({isUp: DOWN, firstFailure, lastFunctional})
      }
  })().catch(this.errorHandler)

  ipLine = line => (async () => {
    const upSince = Date.now()
    const overage = this.getOverage(upSince, this.warning)
    if (overage) console.log(`${getISOTime(upSince)} ${this.printable} warning: ${overage / oneSecond} s ms: ${upSince % 1e3}`)
    this.lastFunctional = upSince
    if (!this.isSelfUp()) this.updateStatus({isUp: UP, upSince})
  })().catch(this.errorHandler)

  getOverage(now, limit) {
    if (!limit) return 0
    const {lastFunctional, monitorSince} = this
    const elapsed = now - (lastFunctional || monitorSince)
    return elapsed >= limit ? elapsed : 0
  }
}
