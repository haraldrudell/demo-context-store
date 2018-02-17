/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
const NONE = 0
const ISDEFAULT = 1
const ISMANDATORY = 2
const MORETHANONCE = 4
const ISPROHIBITED = 8

const numeralities = {
  optional: ISDEFAULT + MORETHANONCE,
  optionalOnce: NONE,
  mandatory: ISMANDATORY,
  mandatoryMany: ISMANDATORY + MORETHANONCE,
  none: ISPROHIBITED,
}

const defaultNumerality = getDefaultNumerality()
function getDefaultNumerality() {
  for (let [numerality, value] of Object.entries(numeralities)) if (value & ISDEFAULT) return numerality
}

const numeralityString = Object.keys(numeralities).join(', ')

export default class Numerality {
  constructor(o) {
    const nu = Object(o).numerality
    const num = nu !== undefined ? nu : defaultNumerality
    const v = numeralities[num]
    if (!v) throw new Error(`Unknown numerality: ${nu}, expected: ${numeralityString}`)
    v & ISMANDATORY && (this.isNumeralityMandatory = true)
    v & ISPROHIBITED && (this.isNumeralityNever = true)
    v & MORETHANONCE && (this.isNumeralityMultiple = true)
  }
}
