/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import ParserBase from './ParserBase'
import {NumeralityHOC} from './NumeralityHOC'
import {Option} from './Option'
import OptionHOC from './OptionHOC'
import * as builtInOptions from './OptionBuiltIn'

import {getNonEmptyString, Failure} from 'es2049lib'

export default class ParserOptionsData extends NumeralityHOC(ParserBase) {
  optionList = []
  optionIndex = {}
  initialOptions = {}
  optionTypeList = []
  optionTypeIndex = {}
  anonymousOptionTypeCounter = 0

  constructor(o) {
    super(Object.assign({numerality: Object(Object(o).optionsData).args}, o))
    this._addBuiltInOptionTypes(Object.values(Object(builtInOptions)))
    const {properties, optionTypes} = Object(o).optionsData || false
    this._addOptionTypesMap(optionTypes)
    this._addPropertiesMap(properties)
  }

  getInitialOptions() {
    return {...this.initialOptions}
  }

  getOptionName(token) {
    const equalIndex = String(token).indexOf('=')
    const optionName = !~equalIndex ? String(token) : String(token).substring(0, equalIndex)
    const optionValue = !~equalIndex ? undefined : String(token).substring(equalIndex + 1)
    return {optionName, optionValue}
  }

  getOptionByName({optionName}) { // '-debug'
    const {optionList, optionIndex} = this
    const matchingOptions = []
    const nameLength = String(optionName).length
    for (let [name, optionNo] of Object.entries(optionIndex)) {
      if (name === optionName.substring(0, nameLength)) {
        const option = optionList[optionNo]
        matchingOptions.push({name, option})
      }
    }
    if (matchingOptions.length === 1) return matchingOptions[0].option
    if (matchingOptions.length === 0) return `unknown option: ${optionName}: try -help`
    const optionNames = matchingOptions.map(({name: n}) => n).join(' ')
    return `ambiguous option: ${optionName} matches: ${optionNames}`
  }

  getOptionValue({option, optionName, optionValue, optionalValue}) {
    const result = {indexIncrement: 1}
    const {isHasValueNever, isHasValueAlways} = option
    const m = `option ${optionName}`

    if (isHasValueNever) {
      if (optionValue != null) result.errorText = `${m}: does not accept a value`
    } else {
      if (optionValue != null) result.value = optionValue
      else if (optionalValue != null) {
        result.value = optionalValue
        result.indexIncrement++
      } else if (isHasValueAlways) result.errorText = `${m}: requires a value`
    }
    return result
  }

  getOptionIndexNotEmpty() {
    return this.optionIndex.length !== 0
  }

  checkForMandatoryOptions() {
    const {optionList} = this
    const missing = []
    for (let option of optionList) {
      const errorText = option.isNumeralityBad()
      errorText && missing.push(option.names[0])
    }
    if (missing.length) return `Missing mandatory options: ${missing.join(' ')}`
  }

  addOptionType(optionConstructor) {
    const {optionTypeList, optionTypeIndex} = this
    const ot = typeof optionConstructor
    if (ot !== 'function') throw new Error(`${this.m} addOptionType option-type constructor not function: type: ${ot}`)
    const {type} = optionConstructor
    const s = getNonEmptyString(type)
    if (s instanceof Failure) throw new Error(`${this.m} addOptionType option-type constructor type name: ${s}`)
    const currentIndex = optionTypeIndex[type]
    if (currentIndex == null) {
      optionTypeIndex[type] = optionTypeList.length
      optionTypeList.push(optionConstructor)
    } else optionTypeList[currentIndex] = optionConstructor
  }

  createOption(optionData) {
    const od = {...optionData}
    const {type} = od
    let optionConstructor = this._getOrRegisterOptionType(type)
    const tt = typeof optionConstructor
    if (tt !== 'function') throw new Error(`${this.m} createOption: ${optionConstructor} optionData:`, optionData)
    delete od.type
    this.debug && (od.debug = true)
    this.addOption(new optionConstructor(od))
  }

  addOption(option) {
    const {optionList, initialOptions, optionIndex} = this
    if (!(option instanceof Option)) throw new Error(`${this.m} addOption: option not instanceof Options`)

    // initial value
    const {value, property: p} = option
    if (value !== undefined && p) initialOptions[p] = value

    // index
    const index = optionList.length
    optionList.push(option)
    const {names} = option // string or list of string
    for (let name of names) {
      if (optionIndex[name] != null) throw new Error(`${this.m} duplicate option name: ${name}`)
      optionIndex[name] = index
    }
  }

  async getOptionsHelp() {
    const {optionList} = this
    let helpList = []
    for (let option of optionList) {
      const {names, valueName, help} = option
      helpList.push({names, valueName, help: typeof help === 'function' ? await option.help() : help})
    }
    return helpList
  }

  _addPropertiesMap(propertiesMap) {
    for (let [property, values] of Object.entries(Object(propertiesMap))) {
      const od = {...values}
      const {type} = od
      const optionConstructor = this._getOrRegisterOptionType(type)
      if (typeof optionConstructor !== 'function') throw new Error(`${this.m} optionsData.properties key: ${property}: ${optionConstructor}`)
      delete od.type
      this.debug && (od.debug = true)
      this.addOption(new optionConstructor({property, ...od}))
    }
  }

  _addBuiltInOptionTypes(builtInList) {
    if (!Array.isArray(builtInList)) throw new Error(`${this.m} built-in option types list not array`)
    for (let [index, builtInConstructor] of builtInList.entries()) {
      let indexStr = `index#${index}`
      const bt = typeof builtInConstructor
      if (bt !== 'function') throw new Error(`${this.m} built-in option type constructor not function: ${indexStr} type: ${bt}`)
      indexStr = `class name: ${bt.name} ${indexStr}`
      const {type} = builtInConstructor
      const s = getNonEmptyString(type)
      if (s instanceof Failure) throw new Error(`${this.m} built-in option type does not have static type name: ${indexStr} constructor name: ${name}`)
      this.addOptionType(builtInConstructor)
    }
  }

  _addOptionTypesMap(types) {
    for (let [type, fn] of Object.entries(Object(types))) {
      const errStr = `${this.m} optionsData.optionTypes key: ${type}`
      const tf = typeof fn
      if (tf !== 'function') throw new Error(`${errStr} value not function: type: ${tf}`)
      const {type: fnType} = fn
      if (!fnType) fn = OptionHOC(fn, type)
      this.addOptionType(fn)
    }
  }

  _getOrRegisterOptionType(type) {
    if (type !== undefined) {
      const tt = typeof type
      if (tt !== 'string') {
        if (tt !== 'function') return `not function or non-empty string: type: ${tt}`
        const {type: typeVal} = type
        if (typeVal) return type // an inline Option or OptionHOC
        // optionsData.properties.type is simple function: on-the-fly OptionHOC
        const name = `customType${++this.anonymousOptionTypeCounter}`
        return OptionHOC(type, name) // won’t fail
      }
    }
    const {optionTypeIndex, optionTypeList} = this
    const index = type !== undefined ? optionTypeIndex[type] : 0
    const optionConstructor = optionTypeList[index]
    if (typeof optionConstructor === 'function') return optionConstructor
    return `unknown option type: '${type}' available types: ${Object.keys(optionTypeIndex).length}[${Object.keys(optionTypeIndex).join('\x20')}]`
  }
}
