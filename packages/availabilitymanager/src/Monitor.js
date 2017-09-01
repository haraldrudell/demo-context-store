/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import Status from './Status'

import {EventEmitter} from 'events'

export default class Monitor extends EventEmitter {
  constructor({eventBus, printable, depends}) {
    super()
    if (depends) {
      if (!Array.isArray(depends)) depends = [depends]
      this.depends = depends.reduce((r, v) => {r[v] = true; return r}, {})
      this.downs = {}
      eventBus.on('change', this.manageDependencies)
    }
    Object.assign(this, {eventBus, printable})
  }

  hadNoSelfEvents = () => this.selfUp === undefined
  isSelfUp = () => this.selfUp

  updateStatus(isUp, now = Date.now(), lastFunctional, everWorked) {
    const isUpBoolean = this.selfUp = !!isUp
    Object.assign(this, {lastFunctional, everWorked})
    if (this.isUp !== null) this.emitStatusChange(isUpBoolean, now)
  }

  emitStatusChange(isUp, now) {
    this.isUp = isUp // false true null
    const last = this.lastStatusChange
    this.lastStatusChange = now
    const {printable, lastFunctional, everWorked} = this
    const downs = isUp === null ? Object.keys(this.downs) : null
    this.emit('data', new Status({isUp, now, last, printable, downs, lastFunctional, everWorked}))
  }

  manageDependencies = status => {
    const {printable} = status
    if (this.depends[printable]) { // we depend on this
      const downs = this.downs
      const wasDown = downs[printable]
      if (!status.isUp) { // a dependency went down
        if (!wasDown) { // and it was not down before
          downs[printable] = true // add to list of down dependencies
          if (Object.keys(downs).length === 1) this.updateBlocking(true, status.now) // signal we are now blocked
        }
      } else if (wasDown) { // a dependency that was down is now up
        delete downs[printable]
        if (Object.keys(downs).length === 0) this.updateBlocking(false, status.now) // we are no longer blocked
      }
    }
  }

  updateBlocking(isBlocked, now) {
    if (isBlocked) {
      if (this.selfUp) this.emitStatusChange(null, now) // from up to blocked
      else this.isUp = null // silently from down to blocked
    } else if (this.selfUp) this.emitStatusChange(true, now) // from blocked to up
    else this.isUp = false // silently from blocked to down
  }
}
