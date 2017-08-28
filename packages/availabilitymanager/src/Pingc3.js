/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import Network from './Network'
import Status from './Status'

import {EventEmitter} from 'events'
import {getCmdLines} from './spawner'

export default class Pingc3 extends EventEmitter {
  constructor(o) {
    super()
    const {errorHandler, status} = o
    const interval = o.interval >= 1e3 ? Number(o.interval) : 1e4
    this.timeout = o.timeout >= 2 * interval ? Number(o.timeout) : 2 * interval
    Object.assign(this, {errorHandler, status})

    getCmdLines({lineFn: this.ipLine, ...o.spawn}).then(this.ipExit).catch(this.errorHandler)
    setInterval(this.checkTimeout, o.timeout >= 1e3 ? o.timeout : 2e3)
  }

  checkTimeout = () => (async () => {
    let update = !this.lastPing
    if (!update && this.isUp) update = Date.now() - this.lastPing > this.timeout
    if (update) this.updateStatus(false)
  })().catch(this.errorHandler)

  ipLine = line => (async () => {
    const lastPing = this.lastPing
    this.lastPing = Date.now()
    if (!this.isUp || !lastPing) this.updateStatus(true)
  })().catch(this.errorHandler)

  updateStatus(isUp) {
    this.isUp = isUp
    const last = this.last
    const now = this.last = Date.now()
    this.emit('data', new Pingc3Status({isUp, last, now}))
  }

  ipExit = status => {
    console.error('NetworkMonitor.ipExit')
    this.errorHandler(new Error('Unexpected ip exit'))
  }
}

class Pingc3Status extends Status {
  constructor(o) {
    super(o)
    const {isUp, last, now} = o || false
    Object.assign(this, {isUp, last, now})
  }
  toLog() {
    return `Internet-c3: ${this.isUp ? 'up' : 'down'} ` +
      `previous change: ${this.last ? this.getISOTime(this.last) : 'none'}`
  }
  toString() {
    return `${this.getISOTime(this.now)} ${this.toLog()}`
  }
}
