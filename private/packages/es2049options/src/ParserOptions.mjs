/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import Option from './Option'
import OptionTypes from './OptionTypes'
import ParserBase from './ParserBase'

export default class ParserOptions extends ParserBase {
  optionList = []
  optionIndex = {}
  initialOptions = {}

  constructor(o) {
    super(o)
    const {optionsData} = o || false
    const {properties, optionTypes: oTypes} = optionsData || false

    this.optionTypes = new OptionTypes().addOptionTypes(oTypes)

    const ot = typeof properties
    if (ot !== 'object') throw new Error(`${this.m} optionsData.properties not object: ${ot}`)

    this.addOptions(properties)
  }

  getOptionByName(name) { // '-debug'
    return this.optionIndex[name]
  }

  getOptions() {
    return this.optionList
  }

  addOptions(properties) {
    const {optionList, equalSign, optionTypes, initialOptions, optionIndex} = this
    for (let [property, values] of Object.entries(properties)) {
      // create option object
      const {type: optionTypeName} = values
      const type = optionTypes.getOptionTypeFn(optionTypeName)
      const modifier = optionTypes.getOptionTypeModifier(optionTypeName)
      const optionConstructorArguments = {property, equalSign, ...values, type}
      if (modifier) modifier(optionConstructorArguments)
      const option = new Option(optionConstructorArguments)
      optionList.push(option)

      // initial value
      const {props: {value}, property: p} = option
      if (value !== undefined && p) initialOptions[p] = value

      // index
      const {names} = option // string or list of string
      if (names) {
        const nameList = Array.isArray(names) ? names : [names]
        for (let name of nameList) {
          if (optionIndex[name]) throw new Error(`${this.m} duplicate option: ${name}`)
          optionIndex[name] = option
        }
      }
    }
  }

  getInitialOptions() {
    return {...this.initialOptions}
  }

  checkForMandatoryOptions() {
    const {optionList} = this
    const missing = []
    for (let option of optionList) if (option.isNumeralityMandatory && !option.count) missing.push(option.names[0])
    if (missing.length) return `Missing mandatory options: ${missing.join(' ')}`
  }

  ensureValueOk({i, arg, value, option}) {
    const {isHasValueNever, isHasValueAlways} = option
    const result = {}

    // -option=value
    if (value) {
      if (isHasValueNever) result.text = `${this.m} option ${arg} does not accept a value`
    } else if (!isHasValueNever) { // may or must have value
      value = i.argv[i.index + 1]
      if (isHasValueAlways) { // always: use even if begins with '-'
        if (value !== undefined) i.index++
        else result.text = `${this.m} option ${arg} must have a value`
      } else { // may: only use if not beings with '-'
        const isValue = !value.startsWith('-')
        if (isValue) i.index++
        else value = undefined
      }
    }

    if (!result.text && value) result.value = value
    return result
  }

  addToArgs({arg, i}) {
    const {isNumeralityNever, isNumeralityMultiple} = this
    if (isNumeralityNever) return `args not allowed: ${arg}`

    let {args} = i.options
    if (args) args.push(arg)
    else i.options.args = args = [arg]
    i.index++

    if (args.length > 1 && !isNumeralityMultiple) return `only 1 arg allowed: ${arg}`
  }

  processEqualSign(arg) {
    if (this.equalSign) {
      const eq = arg.indexOf('=')
      if (~eq) {
        const value = arg.substring(eq + 1)
        arg = arg.substring(0, eq)
        return {arg, value}
      }
    }
    return {arg}
  }
}
