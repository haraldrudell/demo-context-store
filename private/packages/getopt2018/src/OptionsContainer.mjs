/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import Option from './Option'
import Numerality from './Numerality'
import OptionTypes from './OptionTypes'
import {findYamlFilename, loadYaml} from './yaml'
import {types, defaultType} from './defaultTypes'

export default class OptionsContainer extends Numerality {
  constructor(o) {
    super({numerality: Object(Object(o).optionsData).args})
    const {optionsData, name: name0, version: v, debug} = o || false
    this.m = String(name0 || 'OptionsContainer')
    const version = this.getNonEmptyStringOrUndefined(v, 'version')
    const name = this.getNonEmptyString(name0, 'name')

    const {properties, exit = this.exit.bind(this), usage = this.getUsage.bind(this), equalSign: es, optionTypes: otypes, defaultType: dt = defaultType, help, readYaml} = optionsData || false
    const ot = typeof properties
    if (ot !== 'object') throw new Error(`${this.m} optionsData.properties not object: ${ot}`)
    const exitFn = this.getFn(exit, 'optionsData.exit')
    const usageFn = this.getFn(usage, 'optionsData.usage')
    const equalSign = es !== false

    const optionTypes = new OptionTypes()
    optionTypes.addTypes(Object.assign({}, types, otypes), dt)

    debug && console.log(`${this.m} OptionsContainer props:`, {name, version, debug, exitFn, usageFn, equalSign, readYaml})
    Object.assign(this, {name, version, debug, exitFn, usageFn, equalSign, readYaml, optionTypes, help})

    this.buildActions(properties)
  }

  doUsage() {
    const {usageFn, exitFn, name, version} = this
    console.log(usageFn({name, version}))
    exitFn(0)
  }

  doError(message) {
    const {usageFn, exitFn, name, version} = this
    console.error(`${message}\n\n${usageFn({name, version})}`)
    exitFn(2)
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

  ensureValueOk({i, arg, value, action}) {
    const {isHasValueNever, isHasValueAlways} = action
    const result = {}

    // -option=value
    if (value) {
      if (isHasValueNever) result.text = `${this.m} option ${arg} does not accept a value`
    } else if (!isHasValueNever) { // may or must have value
      value = i.argv[i.index]
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

  checkForMandatoryActions() {
    const {actions} = this
    const missing = []
    for (let action of actions) if (action.isNumeralityMandatory && !action.count) missing.push(action.names[0])
    if (missing.length) return `Missing mandatory options: ${missing.join(' ')}`
  }

  async mergeYaml(i) {
    const {name, debug} = this
    const file = await findYamlFilename(name)
    debug && console.log(`${this.m} mergeYaml ${file}`)
    if (file) {
      debug && console.log(`${this.m} mergeYaml ${file}`)
      const data = await loadYaml(file)
      const options = Object(data).options
      if (options) Object.assign(i.options, options)
    }
  }

  buildActions(properties) {
    const actions = this.actions = []
    const {equalSign, optionTypes} = this
    for (let [property, values] of Object.entries(properties)) {
      const type = optionTypes.getType(values.type)
      actions.push(new Option({property, equalSign, ...values, type}))
    }
    this.addToIndex(actions)
  }

  addToIndex(actions) {
    const {debug} = this
    const actionIndex = this.actionIndex || (this.actionIndex = {})
    const options = this.initialOptions || (this.initialOptions = {})

    for (let action of actions) {

      // index of option names
      const {names} = action
      if (names) {
        const n = Array.isArray(names) ? names : [names]
        for (let name of n) {
          if (actionIndex[name]) throw new Error(`${this.m} duplicate option: ${name}`)
          actionIndex[name] = action
        }
      }

      // initial options object
      // TODO 180130 hr NIMP no such types yet
      this.xyz = options
    }
    debug && console.log(`${this.m} addToIndex`, Object.keys(actionIndex), 'initialObject:', options)
  }

  getInitialOptions() {
    return {...this.initialOptions}
  }

  getNonEmptyStringOrUndefined(value, message) {
    if (value === undefined) return value
    return this.getNonEmptyString(value, message)
  }

  getNonEmptyString(value, message) {
    const vt = typeof value
    if (!value || vt !== 'string') throw new Error(`${this.m} ${message}: not non-empty string or undefined: ${vt}`)
    return value
  }

  getUsage({name, version}) {
    const {actions, help, isNumeralityMultiple, isNumeralityNever, isNumeralityMandatory} = this
    const h = Object(help)
    let helpArgs = h.args
    if (!helpArgs && !isNumeralityNever) {
      helpArgs = 'args'
      isNumeralityMultiple && (helpArgs += '…')
      !isNumeralityMandatory && (helpArgs = `[${helpArgs}]`)
    }
    const usage = [
      `${name} [options] ${helpArgs}`,
      `    version: ${version}`,
    ]
    const helpDesc = h.description
    helpDesc && usage.push(helpDesc)
    for (let action of actions) {
      let s = `  ${action.names.join(' ')}`
      if (action.help) s += ` ${action.help}`
      else {
        const tName = action.type.name
        tName && (s += ` ${tName}`)
        action.isNumeralityMandatory && (s += ` mandatory`)
        if (action.isHasValueAlways) s += ` value mandatory`
        else if (!action.isHasValueNever) s += ` may have value`
      }
      usage.push(s)
    }

    return usage.join('\n')
  }

  getFn(fn, message) {
    const et = typeof fn
    if (et !== 'function') throw new Error(`${this.m} action ${message} not function: ${et}`)
    return fn
  }

  exit(statusCode) {
    process.exit(statusCode)
  }
}
