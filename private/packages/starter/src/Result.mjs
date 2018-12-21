/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import UIDGenerator from 'uid-generator'

export default class Result {
  static m= 'Result'
  static uid = new UIDGenerator(UIDGenerator.BASE16)

  constructor(o) {
    const {name, isFailure, message, results, data, timeval = Date.now(), quiet} = o || false
    const {m} = Result
    const nt = typeof name
    if (!(this.name = name) || nt !== 'string') throw new Error(`${m} name not non-empty string: type: ${nt}`)
    const it = typeof (this.isFailure = isFailure)
    if (it !== 'boolean') throw new Error(`${m} isFailure has not boolean: type: ${it}`)
    const mt = typeof message
    if (!(this.message = message) || mt !== 'string') throw new Error(`${m} message not non-empty string: type: ${nt}`)
    quiet && (this.quiet = true)
    if (results) {
      if (!Array.isArray(results)) throw new Error(`${m} results not array`)
      if (results.some(v => typeof v !== Result)) throw new Error(`${m} results has non-Result value`)
      this.results = results
    }
    data && (this.data = data)
    if (!(this.timeval = timeval) > 0) throw new Error(`${m} timeval bad`)
    this.uuid = this._uuid()
  }

  getPlainObject() {
    const {name, isFailure, message, results, data, timeval, uuid} = this
    const result = {name, isFailure, message, timeval, uuid}
    if (results) result.results = results.map(r => r.getPlainObject())
    if (data) result.data = this._clone(data)
    return result
  }

  _clone(data) {
    if (typeof data === 'object') {
      const isArray = Array.isArray(data)
      const d1 = isArray ? [] : {}
      for (let [p, v] of isArray ? data.entries() : Object.entries(data)) d1[String(p)] = this._clone(v)
      data = d1
    }
    return data
  }

  toLog() {
    const {m} = Result
    throw new Error(`${m} toLog NIMP`)
  }

  toString() {
    const {m} = Result
    throw new Error(`${m} toString NIMP`)
  }

  _uuid() {
    const {uid} = Result
    const u = uid.generateSync()
    return `${u.substr(0, 8)}-${u.substr(8, 4)}-${u.substr(12, 4)}-${u.substr(16, 4)}-${u.substr(20, 12)}`
  }
}
