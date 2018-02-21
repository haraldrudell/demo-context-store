/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import util from 'util'

/*
Allowed values in payload:

null

boolean: true false

number: not values: NaN +Infinity -Infinity
- -0 is converted to 0
- 64-bit precision
- range approximately ±10^300
- Integer range approximately ±10^15

string: normalized Unicode 10 utf-16 characters approximate max length 2 GiB in bytes
- NFC: Normalization Form Canonical Composition
- no unpaired surrogates allowed (this ensures a string of valid unicode code points)

object: keys may only be string values approximate max number of properies 4 billion

array: only continuous zero-based indices, max length approximately 4 billion

not allowed value: undefined

lost metadata: functions, non-plain objects like Error, RegExp or Set, non-iterable properties
*/
export default class EntityBase {
  payload = null

  constructor(o) {
    const {name, debug, payload} = o || false
    this.m = String(name || 'EntityBase')
    if (payload !== undefined) this.setPayload(payload)
    debug && (this.debug = true) && this.constructor === EntityBase && console.log(`${this.m} constructor: ${util.inspect(this, {colors: true, depth: null})}`)
  }

  setPayload(payload) {
    this.payload = this._clone(payload)
  }

  getPayload() {
    return this._clone(this.payload)
  }

  _clone(v, location = '') {
    const vt = typeof v
    switch (vt) {
      case 'object':
        if (Array.isArray(v)) {
          const len = v.length
          const v1 = Array(len)
          for (let index = 0; index < len; index++) {
            v1[index] = this._clone(v[index], `${location}[${index}]`)
          }
          return v1
        }
        let count = 0
        let v1 = {}
        for (let p of Object.keys(v)) {
          count++
          if (typeof p !== 'string') throw cloneError(`non-string key at property#${count}`)
          checkString(p)
          v1[p.normalize()] = this._clone(v[p], `${location}{${p}}`)
        }
        return v1
      case 'string':
        checkString(v)
        return v.normalize()
      case 'number':
        if (isNaN(v)) throw cloneError(`number value isNaN`)
        if (v === Infinity) throw cloneError(`number value Infinity`)
        if (v === -Infinity) throw cloneError(`number value -Infinity`)
        // eslint-disable-next-line no-fallthrough
      case 'boolean':
      case 'null':
        return v
    }
    throw cloneError(`type: ${vt}`)

    function cloneError(t) {
      return new Error(`${this.m} ${t}: not allowed. At: ${location || 'top level'}`)
    }

    function checkString(s) {
      for (let codePoint of s) if (codePoint >= 0xd800 && codePoint <= 0xdfff) throw cloneError(`string: invalid utf-16 encoding`)
    }
  }


}
