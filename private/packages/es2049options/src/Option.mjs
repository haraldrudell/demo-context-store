/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import OptionBase from './OptionBase'
import {NumeralityHOC, numeralities} from './NumeralityHOC'
import {ValueFlagHOC, valueFlags} from './ValueFlagHOC'

import {getNonEmptyStringOrUndefined, getStringOrFunctionOrUndefined, getNonEmptyString} from 'es2049lib'

import util from 'util'

export {numeralities, valueFlags}

export class Option extends ValueFlagHOC(NumeralityHOC(OptionBase)) {
  static type = ''
  static valueName = 'value'
  static deletedProperties = Object.keys({names: 1, property: 1, type: 1, numerality: 1, hasValue: 1, valuename: 1, value: 1, help: 1, debug: 1, key: 1})

  constructor(o) {
    super(o)
    const {names, property, value, valueName, help, debug, key} = Object(o)
    const {deletedProperties} = Option
    let s = {}
    const {type} = this.constructor // fetch static type member from derived class
    if (getNonEmptyString({type, s})) throw new Error(`${this.m} option class static type member: ${s.text}: instantiating base Option class?`)
    delete s.properties.type
    if (typeof (this.names = s.text = this._getOptionNames(names, property, key)) === 'string') throw new Error(`${this.m} option type: ${type}: names property: ${s.text}`)
    if (getNonEmptyStringOrUndefined({property, s}, key)) throw new Error(`${this.m} property: ${s.text}`)
    if (value !== undefined) {
      this.value = value // any type
      this.isDefaultValue = true
    }
    if (getStringOrFunctionOrUndefined({valueName, s})) throw new Error(`${this.m} valueName property: ${s.text}`)
    if (valueName === undefined && !this.isHasValueNever) this.valueName = Option.valueName
    if (getStringOrFunctionOrUndefined({help, s})) throw new Error(`${this.m}: help property: ${s.text}`)
    const props = {...o}
    for (let p of deletedProperties) delete props[p]
    Object.assign(this, s.properties, {count: 0, props})
    debug && this.constructor === Option && console.log(`${this.m} constructor: ${util.inspect(this, {colors: true, depth: null})}`)
  }

  anotherInvocationOk() {
    return ++this.count < 2 || this.isNumeralityMultiple
  }

  async help() {
    const {numeralityDescription, valueFlagDescription} = this
    const s = []
    numeralityDescription && s.push(numeralityDescription) // mandatory/prohibited/once
    valueFlagDescription && s.push(valueFlagDescription) // mandatory value/may have value
    return s.join(', ')
  }

  _getOptionNames(names, property, key) {
    // names must be a non-empty array of non-empty strings starting with a hyphen
    // defult value is hyphenated: key from optionsData.properties or property
    const nameList = names === undefined ? [`-${key || property}`] : Array.isArray(names) ? names : [names]
    for (let [index, name] of nameList.entries()) {
      const nt = typeof name
      if (!name || typeof nt !== 'string') return `index #${index}: not non-empty string: type: ${nt}`
      if (!name.startsWith('-')) return `index #${index}: option name not starting with hypen: ${name}`
    }
    return nameList
  }
}
