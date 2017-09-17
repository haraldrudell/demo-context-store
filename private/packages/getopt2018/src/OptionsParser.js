/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import {od, OptionData} from './OptionData'
export {od}
export * from './yaml'

export class OptionsParser {
  constructor(o) {
    const {name, options, allowStrings: as, noHelp} = o || false
    const allowStrings = as === true
    const optionsData = this._parseOptions({options, name, noHelp})
    Object.assign(this, {name, optionsData, allowStrings})
  }

  getOpt(argv) { // return value: Error value, undefined: help or options obejct
    const options = {}
    const strings = []
    const {optionsData, aliasHelp, name, allowStrings} = this
    const m = `${name} OptionsParser:`
    if (!Array.isArray(argv) || !argv.every(v => typeof v === 'string')) throw new Error(`${m} argv not array of string`)

    while (argv.length) {
      const token = argv.shift()
      const ch = token[0]
      if (ch !== '-') { // string token
        strings.push(token)
        continue
      }
      const ch2 = token[1]
      const hasDoubleHyphen = ch2 === '-'
      if (hasDoubleHyphen && token.length === 2) { // '--': remaining tokens are non-options
        Array.prototype.push.apply(strings, argv.slice(1))
        break
      }
      const tokenLessHyphens = token.substring(hasDoubleHyphen ? 2 : 1)
      const equalIndex = tokenLessHyphens.indexOf('=')
      const hadEqual = !!~equalIndex
      const option = hadEqual ? tokenLessHyphens.substring(0, equalIndex) : tokenLessHyphens
      if (options[option]) return new Error(`${m} Repeated option: ${option}`)
      const optionData = optionsData[option]
      if (optionData === undefined) {
        if (aliasHelp && option === 'h') return // -h --h: provide help
        return new Error(`${m} Unknown option: ${option}`)
      }
      if (optionData.isHelp) return // undefined: help requested
      if (optionData.mustHaveArg) {
        if (!hadEqual && !argv.length) return new Error(`${m} Missing argument for option ${token}`)
        options[option] = hadEqual ? tokenLessHyphens.substring(option.length + 1) : argv.shift()
      } else return new Error(`Unimplemented option type: ${optionData}`)
    }

    if (strings.length) {
      if (!allowStrings) return new Error(`${m} Extra arguments: ${strings.join(' ')}`)
      options.strings = strings
    }
    return options
  }

  usage() { // array of string
    let result = []
    const {optionsData} = this
    for (let [optionName, odef] of Object.entries(optionsData))
      result.push(`  -${optionName}${odef.mustHaveArg ? ' arg' : ''}${odef.help ? ` ${odef.help}` : ''}`)
    return result
  }

  _parseOptions({options, name, noHelp}) {
    const m = `${name} OptionsParser:`
    const optionsData = {}
    let hadHelp
    if (!options) throw new Error(`${m} options argument missing`)
    for (let [optionName, optionData] of Object.entries(options)) {
      optionName = String(optionName)
      if (optionsData[optionName]) throw new Error(`${m} repeated option name: ${optionName}`)
      const odef = optionsData[optionName] = new OptionData({optionData, m, optionName})
      if (odef.isHelp) hadHelp = true
    }
    if (!noHelp && !hadHelp) {
      optionsData.help = new OptionData({optionData: [od.isHelp, 'display usage information'], m, optionName: 'help'}) // -help --help: provide help
      this.aliasHelp = true // -h --h: provide help
    }
    return optionsData
  }
}
