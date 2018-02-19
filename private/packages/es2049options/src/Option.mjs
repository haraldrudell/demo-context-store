/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import OptionBase from './OptionBase'
import {NumeralityHOC, numeralities} from './NumeralityHOC'
import {ValueFlagHOC, valueFlags} from './ValueFlagHOC'

import {getNonEmptyStringOrUndefined, getStringOrFunctionOrUndefined, Failure} from 'es2049lib'

export {numeralities, valueFlags}

export class Option extends ValueFlagHOC(NumeralityHOC(OptionBase)) {
  static type = ''
  static valueName = 'value'
  static deletedProperties = Object.keys({names: 1, property: 1, type: 1, numerality: 1, hasValue: 1, valueName: 1, value: 1, help: 1, debug: 1})

  constructor(o) {
    super(o)
    const {type} = this.constructor
    if (!type) throw new Error(`${this.m} option type empty: instantiating base Option class?`)
    !o && (o = false)
    const names = this._getOptionNames(o.names, o.property)
    if ((this.names = names) instanceof Failure) throw new Error(`${this.m} option type: ${type}: names property: ${Failure.text}`)
    this.m = `option: ${names.join('\x20')}`
    const property = getNonEmptyStringOrUndefined(o.property)
    if (property instanceof Failure) throw new Error(`${this.m} property: ${Failure.text}`)
    if (property) this.property = property
    const {value} = o
    if (value !== undefined) this.value = value
    const valueName = getStringOrFunctionOrUndefined(o.valueName)
    if (valueName instanceof Failure) throw new Error(`${this.m}: valueName property: ${Failure.text}`)
    if (valueName !== undefined) this.valueName = valueName
    else if (!this.isHasValueNever && this.valueName === undefined) this.valueName = Option.valueName
    const help = getStringOrFunctionOrUndefined(o.help)
    if (help instanceof Failure) throw new Error(`${this.m}: help property: ${Failure.text}`)
    if (help !== undefined) this.help = help
    const props = {...o}
    const {deletedProperties} = Option
    for (let p of deletedProperties) delete props[p]
    Object.assign(this, {count: 0, props})
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

  _getOptionNames(names, property) {
    const nameList = names === undefined ? [`-${property}`] : Array.isArray(names) ? names : [names]
    for (let [index, name] of nameList.entries()) {
      const nt = typeof name
      if (!name || typeof nt !== 'string') return new Failure(`index #${index}: not non-empty string: type: ${nt}`)
      if (!name.startsWith('-')) return new Failure(`index #${index}: option name not starting with hypen: ${name}`)
    }
    return nameList
  }
}
