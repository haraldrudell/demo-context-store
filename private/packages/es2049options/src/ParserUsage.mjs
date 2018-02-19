/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import ParserOptionsData from './ParserOptionsData'

import {getFn, getNonEmptyString, getNonEmptyStringOrUndefined, getStringOrFunctionOrUndefined, Failure} from 'es2049lib'

export default class ParserUsage extends ParserOptionsData {
  static statusCodeOk = 0
  static statusCodeUsage = 2
  static argsSingle = 'args'
  static argsMultiple = 'args…'

  constructor(o) {
    super(o)
    !o && (o = false)
    const {property} = this
    if ((this.usageFn = getFn(Object(o.optionsdata).usage, this.defaultUsage.bind(this))) instanceof Failure) throw new Error(`${this.m} optionsData.usage: ${Failure.text}`)
    if ((this.name = getNonEmptyString(o.name)) instanceof Failure) throw new Error(`${this.m} name property: ${Failure.text}`)
    if ((this.version = getNonEmptyStringOrUndefined(o.version)) instanceof Failure) throw new Error(`${this.m} version property: ${Failure.text}`)
    const help = getStringOrFunctionOrUndefined(o.help)
    if (help instanceof Failure) throw new Error(`${this.m} option ${property}: help property: ${Failure.text}`)
    if (help !== undefined) this.help = help
    const helpArgs = getStringOrFunctionOrUndefined(o.helpArgs)
    if (helpArgs instanceof Failure) throw new Error(`${this.m} option ${property}: helpArgs property: ${Failure.text}`)
    if (helpArgs !== undefined) this.helpArgs = helpArgs
  }

  async doUsage() {
    const {usageFn, exitFn, name, version} = this
    console.log(await usageFn({name, version}))
    exitFn(ParserUsage.statusCodeOk)
  }

  async doError(message) {
    const {usageFn, exitFn, name, version} = this
    console.error(`${message}\n\n${await usageFn({name, version})}`)
    exitFn(ParserUsage.statusCodeUsage)
  }

  async defaultUsage({name, version}) {
    const {help, helpArgs, isNumeralityMultiple, isNumeralityNever, isNumeralityMandatory} = this
    let usage = []

    // 'command [options] args…'
    let s0 = `${name}`
    if (this.getOptionIndexNotEmpty()) s0 += ` [options]`
    if (helpArgs == null) {
      if (!isNumeralityNever) {
        const {argsSingle, argsMultiple} = ParserUsage
        let s01 = isNumeralityMultiple ? argsMultiple : argsSingle
        if (isNumeralityMandatory) s01 = `[${s01}]`
        s0 += ` ${s01}`
      }
    } else if (helpArgs) s0 += ` ${typeof helpArgs === 'function' ? await this.helpArgs() : helpArgs}`
    usage.push(s0)

    // 'version: 1.2.3'
    version && usage.push(this._indent(`version: ${version}`, 2))

    // 'description'
    if (help) {
      const helpS = typeof help === 'function' ? await this.help() : help
      if (helpS) usage.push(this._indent(helpS))
    }

    // options table: 2 columns
    // '-h -help --help' 'display usage'
    const left = []
    const right = []
    let leftWidth = 0
    let entryCount = 0

    // populate table content
    const helpList = await this.getOptionsHelp()
    for (let {names, valueName, help: optionHelp} of helpList) {
      let flags = names.join(' ')
      if (valueName) flags += ` ${valueName}`
      const flagsLength = flags.length
      if (flagsLength > leftWidth) leftWidth = flagsLength
      left.push(flags)
      right.push(String(optionHelp || ''))
      entryCount++
    }

    // format table
    const leftSpacing = '\x20'.repeat(leftWidth + 1)
    for (let index = 0; index < entryCount; index++) {

      // first line
      const leftLine = left[index]
      const leftLineLength = leftLine.length
      const rightLines = right[index].split('\n')
      let sx = leftLine
      if (rightLines[0]) sx += `${leftSpacing.substring(leftLineLength)}${rightLines[0]}`
      usage.push(this._indent(sx, 1))

      // subsequent lines on the right
      for (let ii = 1; ii < rightLines.length; ii++) usage.push(this._indent(`${leftSpacing}${rightLines[ii]}`, 1))
    }

    return usage.join('\n')
  }

  _indent(s, x) {
    const indentString = '\x20'.repeat(x >= 0 ? 2 * +x : 2)
    return s ? `${indentString}${String(s).replace(/\n/g, `\n${indentString}`)}` : ''
  }
}
