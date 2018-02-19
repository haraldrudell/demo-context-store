/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
const NONE = 0
const ISDEFAULT = 1
const ISMANDATORY = 2
const MORETHANONCE = 4
const ISPROHIBITED = 8

const numeralitiesMap = {
  optional: ISDEFAULT + MORETHANONCE,
  optionalOnce: NONE,
  mandatory: ISMANDATORY,
  mandatoryMany: ISMANDATORY + MORETHANONCE,
  none: ISPROHIBITED,
}

export const numeralities = Object.keys(numeralitiesMap).reduce((acc, name) => {
  acc[name] = name
  return acc
}, {})

export function NumeralityHOC(BaseClass) {
  return class Numerality extends BaseClass {
    static numeralityProperties = Object.keys({isNumeralityMandatory: 1, isNumeralityNever: 1, isNumeralityMultiple: 1})
    static defaultNumerality = Object.keys(numeralitiesMap).filter(numerality => numeralitiesMap[numerality] & ISDEFAULT)[0]
    static numeralityString = Object.keys(numeralitiesMap).join(', ')
    static numeralityMandatory = 'mandatory'
    static numeralityNever = 'prohibited'
    static numeralityOnce = 'once'

    constructor(o) {
      super(o)
      this.setNumerality(Object(o).numerality)
      this.numeralityCount = 0
    }

    setNumerality(numerality) {
      const num = numerality !== undefined ? numerality : Numerality.defaultNumerality
      const v = numeralitiesMap[num]
      if (v === undefined) throw new Error(`Unknown numerality: ${numerality}, expected one of: ${Numerality.numeralityString}`)
      for (let p of Numerality.numeralityProperties) if (this.hasOwnProperty(p)) delete this[p]
      v & ISMANDATORY && (this.isNumeralityMandatory = true)
      v & ISPROHIBITED && (this.isNumeralityNever = true)
      v & MORETHANONCE && (this.isNumeralityMultiple = true)
      this._setNumeralityDescription()
    }

    addNumeralityOccurrence() {
      this.numeralityCount++
    }

    isNumeralityBad() {
      const {numeralityCount, isNumeralityMandatory, isNumeralityNever, isNumeralityMultiple} = this
      if (isNumeralityMandatory && !numeralityCount) return 'is mandatory'
      if (isNumeralityNever && numeralityCount) return 'is prohibited'
      if (!isNumeralityMultiple && numeralityCount > 1) return 'can only be provided once'
    }

    _setNumeralityDescription() {
      // default understanding is that the flag is optional and can be specified multiple times
      const {isNumeralityMandatory, isNumeralityMultiple, isNumeralityNever} = this
      const {numeralityMandatory, numeralityNever, numeralityOnce} = Numerality
      const s = []
      if (isNumeralityMandatory) s.push(numeralityMandatory)
      else if (isNumeralityNever) s.push(numeralityNever)
      if (!isNumeralityNever && !isNumeralityMultiple) s.push(numeralityOnce)
      this.numeralityDescription = s.join(' ')
    }
  }
}
