/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
export default class Status {
  /*
  isUp: boolean or null
  printable: like 'Internet Connection'
  last: optional timeval
  now: optional timeval
  downs: optional array of string
  lastFunctional: timeval
  everWorked: boolean
  */
  constructor({isUp, printable, last = 0, now = Date.now(), downs, lastFunctional, everWorked}) {
    const [it, pt, lt, et] = [typeof isUp, typeof printable, typeof lastFunctional, typeof everWorked]
    if (isUp !== null && it !== 'boolean') throw new Error(`Status isUp not boolean or null: ${it}`)
    if (pt !== 'string' || !printable) throw new Error(`Status printable not non-empty string: ${pt}`)
    if (!(lastFunctional > 0)) throw new Error(`Status lastFunction not timeval: ${lt}`)
    if (et !== 'boolean') throw new Error(`Status everWorked not boolean: ${et}`)
    Object.assign(this, {isUp, printable, last, now, downs, lastFunctional, everWorked})
  }

  getISOTime = Status.getISOTime

  toLog() {
    return `${this.printable}: ` +
      `${this.isUp ? 'up' : this.isUp === null ? 'blocked by: ' + (this.downs || []).join('+') : 'down'} ` +
      `previous change: ${this.last ? this.getISOTime(this.last, false, true) : 'none'} ` +
      `last functional: ${this.getISOTime(this.lastFunctional, true, true)} ` +
      `${this.everWorked ? '' : 'never worked '}` +
      `ms: ${this.now % 1e3}`
  }

  toString() {
    return `${this.getISOTime(this.now)} ${this.toLog()}`
  }

  static getISOTime(timeval, withMs, noTz) {
    if (!(timeval >= 0)) throw new Error(`Status.getISOTime: timeval not number >= 0: ${typeof timeval}`)
    const tzAddMin = -new Date().getTimezoneOffset()
    const s = new Date(timeval + tzAddMin * 6e4).toISOString() // 2017-09-01T19:02:46.322Z
    const endIndex = !withMs ? 19 : 23
    const day = s.substring(0, 10) // 2017-09-01
    const time = s.substring(11, endIndex) // 19:02:46 [.322]
    let result = `${day} ${time}`

    const withTz = !noTz
    if (withTz) {
      const tzMin = Math.abs(tzAddMin)
      const tzString = // '-07'
        `${tzAddMin < 0 ? '-' : '+'}` +
        `${tzMin < 600 ? '0' : ''}` +
        `${Math.floor(tzMin / 60)}` +
        `${tzMin % 60 > 0 ? Math.floor(tzMin % 60) : ''}`
      result += tzString
    }

    return result
    }
}

export const getISOTime = Status.getISOTime
