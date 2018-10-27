/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
export default class Func {
  constructor({t, f}) {
    const tType = typeof t
    if (tType !== 'string') throw new Error(`Function: t not string: ${tType}`)
    const fType = typeof f
    if (fType !== 'function') throw new Error(`Function: f not function: ${fType}`)
    const t0 = Date.now()
    const v = f()
    const duration = (Date.now() - t0) / 1e3
    Object.assign(this, {t, f, v, duration})
  }

  getValue() {
    return this.v
  }

  getValueString() {
    return String(this.getValue())
  }

  getSource() {
    return this.t
  }

  getDuration() {
    return this.duration
  }
}
