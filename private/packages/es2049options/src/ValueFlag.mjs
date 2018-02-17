/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import Numerality from './Numerality'

const NONE = 0
const ISDEFAULT = 1
const NEVER = 2
const ALWAYS = 4

const hasValues = {
  never: NEVER + ISDEFAULT,
  may: NONE,
  always: ALWAYS,
}

const defaultHasValue = getDefault()
function getDefault() {
  for (let [hasValue, value] of Object.entries(hasValues)) if (value & ISDEFAULT) return hasValue
}

const valueString = Object.keys(hasValues).join(', ')

export default class ValueFlag extends Numerality {
  constructor(o) {
    super(o)
    const hv = Object(o).hasValue
    const hasValue = hv !== undefined ? hv : defaultHasValue
    const v = hasValues[hasValue]
    if (v === undefined) throw new Error(`Unknown hasValue: ${hv}, expected: ${valueString}`)
    v & NEVER && (this.isHasValueNever = true)
    v & ALWAYS && (this.isHasValueAlways = true)
  }
}
