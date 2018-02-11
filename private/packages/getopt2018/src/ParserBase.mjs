/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import Numerality from './Numerality'

export default class ParserBase extends Numerality {
  constructor(o) {
    super({numerality: Object(Object(o).optionsData).args}) // o.optionsData.args is numerality
    !o && (o = false)
    const {optionsData, name: name0, version: version0, debug} = o
    this.m = String(name0 || 'OptionsContainer')
    const version = this.getNonEmptyStringOrUndefined(version0, 'version')
    const name = this.getNonEmptyString(name0, 'name')

    // optionsData global options
    const {exit = this.defaultExit.bind(this), usage = this.defaultUsage.bind(this), equalSign: es, help} = optionsData || false
    const exitFn = this.getFn(exit, 'optionsData.exit')
    const usageFn = this.getFn(usage, 'optionsData.usage')
    const equalSign = es !== false
    Object.assign(this, {name, version, debug, exitFn, usageFn, equalSign, help})
  }

  async doUsage() {
    const {usageFn, exitFn, name, version} = this
    console.log(await usageFn({name, version}))
    exitFn(0)
  }

  async doError(message) {
    const {usageFn, exitFn, name, version} = this
    console.error(`${message}\n\n${await usageFn({name, version})}`)
    exitFn(2)
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

  async defaultUsage({name, version}) {
    const {help, isNumeralityMultiple, isNumeralityNever, isNumeralityMandatory} = this
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

    for (let option of this.getOptions()) usage.push(await option.getOptionHelp())

    return usage.join('\n')
  }

  getFn(fn, message) {
    const et = typeof fn
    if (et !== 'function') throw new Error(`${this.m} action ${message} not function: ${et}`)
    return fn
  }

  defaultExit(statusCode) {
    process.exit(statusCode)
  }
}
