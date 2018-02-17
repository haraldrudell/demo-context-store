/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import path from 'path'

/*
option type function:
name: string option name like '-debug'
value: string: provided value or undefined if no value
i: iteration instance: {argv: list of string, index: number, options: object}
option: Option object
parser: Parser object

return value:
non-empty string: usage error message, exit status 2
falsey: caller increments index
truish non-string: index has been adjusted, do nothing
*/

export default class OptionTypes {
  defaultOptionType = 'boolean'
  optionTypes = {
    boolean: OptionTypes.boolean,
    string: OptionTypes.string,
    filename: OptionTypes.filename,
    integer: OptionTypes.integer,
    nestring: OptionTypes.nestring,
  }
  optionModifiers = {
    nestring: OptionTypes.setValueMandatory,
  }

  static setValueMandatory(optionConstructorArguments) {
    optionConstructorArguments.hasValue = 'always'
  }

  static boolean({i: {options}, option: {property}}) {
    property && (options[property] = true)
  }

  static string({value, i: {options}, option: {property}}) {
    property && (options[property] = value)
  }

  static nestring({name, value, i: {options}, option: {property}}) {
    if (!value) return `option ${name} not non-empty string: ${typeof value}`
    property && (options[property] = value)
  }

  static async filename({name, value, i: {options}, option: {property, isHasValueAlways}}) {
    if (property) {
      if (value === undefined && isHasValueAlways) return `option ${name} of filename type: filename cannot be empty`
      options[property] = value ? path.resolve(value) : ''
    }
  }

  static integer(o) {
    const {name, value, i: {options}, option: {props, property}} = o
    const number = +value
    if (isNaN(number)) return `${name}: value not numeric: ${value}`
    if (!Number.isInteger(number)) return `${name}: value not integer: ${value} ${number}`
    const {min, max} = props
    if (typeof min === 'number' && value < min) return `${name}: ${value} cannot be less than ${min}`
    if (typeof max === 'number' && value > max) return `${name}: ${value} cannot be greater than ${max}`
    options[property] = number
  }

  addOptionTypes(types) {
    if (typeof types === 'object') {
      for (let [typeName, typeFn] of Object.entries(types)) {
        const tt = typeof typeFn
        if (tt !== 'function') throw new Error(`${this.m} addOptionTypes: type ${typeName} value not function: ${tt}`)
      }
      const {optionTypes} = this
      Object.assign(optionTypes, types)
    }
    return this
  }

  getOptionTypeFn(optionTypeName) {
    const {optionTypes, defaultOptionType} = this

    const valueFn = optionTypeName === undefined
      ? optionTypes[defaultOptionType]
      : typeof optionTypeName === 'function' ? optionTypeName : optionTypes[optionTypeName]

    const tv = typeof valueFn
    if (tv !== 'function') throw new Error(`${this.m} action type not function: ${tv} input: ${optionTypeName}`)

    return valueFn
  }

  getOptionTypeModifier(optionTypeName) {
    return this.optionModifiers[optionTypeName]
  }
}
