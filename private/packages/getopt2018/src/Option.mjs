/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import ValueFlag from './ValueFlag'

export default class Option extends ValueFlag {
  static deletedProperties = Object.keys({name: 1, names: 1, type: 1, property: 1, equalSign: 1, help: 1})

  constructor(o) {
    super(o)
    const props = {...o}
    let {name, names, type, property, equalSign, help} = props
    this.m = String(name || 'Option')
    this.parseProperty(property) // undefined or ne-string
    names = this.parseNames(names || (property ? `-${property}` : undefined))
    this.m += ` ${names[0]}`
    const tt = typeof type
    if (tt !== 'function') throw new Error(`${this.m} type not funtion: ${tt}`)
    equalSign = Boolean(equalSign)
    const {deletedProperties} = Option
    for (let p of deletedProperties) delete props[p]
    Object.assign(this, {names, type, property, equalSign, count: 0, help, props})
  }

  anotherInvocationOk() {
    return ++this.count < 2 || this.isNumeralityMultiple
  }

  parseNames(value) {
    const names = Array.isArray(value) ? value : [value]
    if (!names.every(n => n && typeof n === 'string')) throw new Error(`${this.m} action name not non-empty string or list of non-empty string`)
    return names
  }

  parseProperty(value) {
    if (value !== undefined) {
      const tv = typeof value
      if (!value || tv !== 'string') throw new Error(`${this.m} action options property name not undefined or non-empty string`)
    }
    return value
  }

  async getOptionHelp() {
    const {names, help, type, isNumeralityMandatory, isHasValueAlways, isHasValueNever} = this
    let s = `  ${names.join(' ')}`
    if (typeof help === 'function') {
      s += ` ${await help()}`
    } else if (help) s += ` ${help}`
    else {
      const tName = type.name
      tName && (s += ` ${tName}`)
      isNumeralityMandatory && (s += ` mandatory`)
      if (isHasValueAlways) s += ` value mandatory`
      else if (!isHasValueNever) s += ` may have value`
    }
    return s
  }
}
