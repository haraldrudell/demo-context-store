/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import {INIT, UP, DOWN, BLOCKED, UNBLOCKED, default as Status} from './Status'

import {EventEmitter} from 'events'

export default class Monitor extends EventEmitter {
  constructor({eventBus, printable, depends}) {
    super()
    if (depends) {
      if (!Array.isArray(depends)) depends = [depends]
      this.depends = depends.reduce((r, v) => {r[String(v)] = true; return r}, {})
      this.downs = {}
      eventBus.on('change', this.manageDependencies)
    }
    Object.assign(this, {eventBus, printable})
    this.status = new Status({isUp: INIT, printable, monitorSince: this.monitorSince = Date.now()})
  }

  hadNoUpDownEvents = () => this.status.hadNoUpDownEvents()
  isSelfUp = () => this.status.isSelfUp()

  updateStatus(o) {
    this.status = this.status.getNextStatus(o)
    if (!this.status.isBlocked) this.emit('data', this.status)
  }

  manageDependencies = status => {
    const {printable} = status
    if (this.depends[printable]) { // we depend on this
      const downs = this.downs
      const wasDown = downs[printable]
      if (status.isBlocked || status.isUp === DOWN) { // a dependency is down
        if (!wasDown) { // and it was not down before
          downs[printable] = true // add to list of down dependencies
          if (Object.keys(downs).length === 1 && !this.status.isBlocked) { // need to change state to blocked
            const time = status.isBlocked ? status.blockedSince : status.firstFailure
            this.emit('data', this.status = this.status.getNextStatus({isUp: BLOCKED, blockedSince: time, downs}))
          }
        }
      } else if (status.isUp === UP && wasDown) { // a dependency that was down is now up
        delete downs[printable]
        if (Object.keys(downs).length === 0) { // need to signal that we are unblocked
          const time = o.unblockedSince || o.upSince
          this.emit('data', this.status = this.status.getNextStatus({isUp: UNBLOCKED, unblockedSince: time}))
        }
      }
    }
  }
}
