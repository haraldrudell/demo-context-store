/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import Network from './Network'
import CommandMonitor from './CommandMonitor'
import {UP, DOWN} from './Status'

import {getCmdLines} from './spawner'

export default class DefaultRouteMonitor extends CommandMonitor {
  static command = {
    cmd: 'ip',
    args: ['monitor', 'route'],
  }

  constructor(o) {
    super(o)
    this.nw = new Network()
    this.checkRoute().catch(this.errorHandler) // provide initial state
    this.issueCommand({...DefaultRouteMonitor.command, lineFn: this.ipLine, timeout: 0})
  }

  async checkRoute2() {
    const result = {isFailure: true}
    const isUp = !result.isFailure
    const now = Date.now() // Result has no timestamp

    if (isUp && !this.everWorked) this.everWorked = true
    if (isUp != this.isSelfUp()) this.updateStatus(isUp, now, this.lastFunctional, this.everWorked)
    if (isUp) this.lastFunctional = now
  }

  async checkRoute() {
    const upSince = Date.now() // Result has no timestamp
    const result = await this.nw.defaultRoute()
    const isUp = !result.isFailure ? UP : DOWN

    if (isUp != this.status.isUp) {
      if (isUp === UP) {
        this.lastFunctional = upSince
        this.updateStatus({isUp, upSince})
      } else {
        const {lastFunctional} = this
        const firstFailure = upSince
        this.updateStatus({isUp, firstFailure, lastFunctional})
      }
    }
  }

  // default via 192.168.1.12 dev enx000ec6fa54d2 proto static metric 100
  // Deleted local 192.168.1.159 dev enx000ec6fa54d2 table local proto kernel scope host src 192.168.1.159
  ipLine = line => (async () => {
    if (line.startsWith('Deleted local') || line.startsWith('default via')) await this.checkRoute()
  })().catch(this.errorHandler)
}
