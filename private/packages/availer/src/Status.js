/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
export const UP = true
export const DOWN = false
export const INIT = 0
export const BLOCKED = null
export const UNBLOCKED = 1

export default class Status {
  constructor(o, previousState) {
    this._updateStatus(this, o, previousState)
  }

  getNextStatus(o) {
    return new Status(o, this)
  }

  toLog() {
    const {ts, printable, isBlocked, downs, lastAvailable, /*unblockedSince, blockedSince, */isUp, upSince, lastFunctional} = this
    let result = `${printable}:`
    if (isBlocked) {
      result += ` blocked by: ${downs.join('+')}`
      result += lastAvailable ? ` last available: ${this.getISOTime(lastAvailable, true, true)}` : ' (never worked)'
    } else if (this.unblockedSince) {
      result += ` unblocked`
      if (!upSince) result += lastAvailable ? ` last available: ${lastAvailable}` : ' (never worked)'
    } else if (isUp === UP) {
      result += ` up`
      if (ts !== upSince) result += ` since: ${this.getISOTime(upSince, true, true)}`
    } else if (isUp === DOWN) {
      const last = (!lastFunctional || lastAvailable > lastFunctional) && lastAvailable || lastFunctional
      result += ` down ${last ? this.getISOTime(last, true, true) : '(never worked)'}`
    } else result += `monitoring`

    result += ` ms: ${ts % 1e3}`
    return result
  }

  toString() {
    return `${this.getISOTime(this.ts)} ${this.toLog()}`
  }

  isAvailable = () => this.isUp && !this.isBlocked
  hadNoUpDownEvents = () => this.isUp === INIT
  isSelfUp = () => this.isUp === UP

  /*
  mandatory for INIT: monitorSince, printable
  mandatory for UP: upSince
  mandatory for DOWN: firstFailure, lastFunctional, optional: lastFailure
  mandatory for BLOCKED: blockedSince downs[]
  mandatory for UNBLOCKED: unblockedSince
  */
  _updateStatus(o, {isUp, printable, monitorSince, upSince, firstFailure, lastFailure, lastFunctional, blockedSince, downs, unblockedSince}, prev) {
    if (!o) o = {}
    if (!prev) prev = false
    let ts

    let lastAvailable
    let isBlocked

    if (!printable) printable = prev.printable
    const pt = typeof printable
    if (!printable || pt !== 'string') throw new Error(`Status: bad printable: ${pt} '${printable}'`)
    const m = `Status ${printable}:`
    if (isUp === INIT) {
      this._checkTimeval(ts = monitorSince, 'monitorSince', m)
      Object.assign(o, {isUp, printable, monitorSince})
    } else {
      monitorSince = prev.monitorSince
      Object.assign(o, {printable, monitorSince})

      if (isUp === UP) {
        this._checkTimeval(ts = upSince, 'upSince', m)
        Object.assign(o, {isUp, upSince})
      } else if (isUp === DOWN) {
        this._checkTimeval(firstFailure, 'firstFailure', m)
        if (lastFailure) this._checkTimeval(ts = lastFailure, 'lastFailure', m)
        else ts = lastFailure = firstFailure
        if (lastFunctional != null) this._checkTimeval(lastFunctional, 'lastFunctional', m)
        Object.assign(o, {isUp, firstFailure, lastFailure, lastFunctional})
      } else {
        if (prev.isUp === UP) Object.assign(o, {isUp: UP, upSince})
        else if (prev.isUp === DOWN) {
          // eslint-disable-next-line no-shadow
          const {firstFailure, lastFailure, lastFunctional} = prev
          Object.assign(o, {isUp: DOWN, firstFailure, lastFailure, lastFunctional})
        } else o.isUp = INIT

        if (isUp === BLOCKED) {
          this._checkTimeval(ts = blockedSince, 'blockedSince', m)
          if (downs == null) throw new Error(`${m} bad downs: ${typeof downs} '${downs}'`)
          if (!Array.isArray(downs)) downs = [downs]
          downs.forEach((v, index) => this._checkString(v, `downs:${index}`, m))
          isBlocked = true
          lastAvailable = upSince ? blockedSince : lastFunctional
          Object.assign(o, {blockedSince, downs, lastAvailable})
        } else if (isUp === UNBLOCKED) {
          this._checkTimeval(ts = unblockedSince, 'unblockedSince', m)
          isBlocked = false
          if (!prev.upSince) o.lastAvailable = prev.lastAvailable
          o.unblockedSince = unblockedSince
        } else throw new Error(`${m} bad isUp: ${typeof isUp} '${isUp}'`)
      } // UP
    } // INIT
    if ((isBlocked = prev.isBlocked)) {
          // eslint-disable-next-line no-shadow
          const {blockedSince, downs, lastAvailable} = prev
      Object.assign(o, {blockedSince, downs, lastAvailable})
    } // an event after unblock clears unblock

    Object.assign(o, {ts, isBlocked})
    return o
  }

  _checkTimeval(t, name, m) {
    if (!(t > 0)) throw new Error(`${m} bad ${name}: ${typeof t} '${t}'`)
  }

  _checkString(t, name, m) {
    const tt = typeof t
    if (!t || tt !== 'string') throw new Error(`${m} bad ${name}: ${tt} '${t}'`)
  }

  getISOTime = Status.getISOTime

  //getISOTime es2049lib
}

export const getISOTime = Status.getISOTime
