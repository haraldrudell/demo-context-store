/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
const NONE = 0
const ISDEFAULT = 1
const NEVER = 2
const ALWAYS = 4

const valueFlagsMap = {
  never: NEVER + ISDEFAULT,
  may: NONE,
  always: ALWAYS,
}

export const valueFlags = Object.keys(valueFlagsMap).reduce((acc, name) => {
  acc[name] = name
  return acc
}, {})

export function ValueFlagHOC(BaseClass) {
  return class ValueFlag extends BaseClass {
    static valueFlagProperties = Object.keys({isHasValueNever: 1, isHasValueAlways: 1})
    static defaultHasValue = Object.keys(valueFlagsMap).filter(valueFlag => valueFlagsMap[valueFlag] & ISDEFAULT)[0]
    static valueFlagString = Object.keys(valueFlags).join(', ')
    static valueFlagMust = 'mandatory value'
    static valueFlagMay = 'may have value'

    constructor(o) {
      super(o)
      this.setValueFlag(Object(o).hasValue)
    }

    setValueFlag(hasValue0) {
      const {defaultHasValue, valueFlagString, valueFlagProperties} = ValueFlag
      const hasValue = hasValue0 !== undefined ? hasValue0 : defaultHasValue
      const v = valueFlagsMap[hasValue]
      if (v === undefined) throw new Error(`Unknown hasValue: ${hasValue0}, expected one of: ${valueFlagString}`)
      for (let p of valueFlagProperties) if (this.hasOwnProperty(p)) delete this[p]
      v & NEVER && (this.isHasValueNever = true)
      v & ALWAYS && (this.isHasValueAlways = true)
      this._setValueFlagDescription()
    }

    _setValueFlagDescription() {
      // default understanding is that the option flag cannot have value
      const {isHasValueNever, isHasValueAlways} = this
      const {valueFlagMust, valueFlagMay} = ValueFlag
      this.valueFlagDescription = isHasValueNever ? '' : isHasValueAlways ? valueFlagMust : valueFlagMay
    }
  }
}
