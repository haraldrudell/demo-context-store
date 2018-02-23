/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import ParserYaml from './ParserYaml'

import util from 'util'
/*
const optionsData = {
  properties: {
    debug: {
      names: optional string of string array option names like '-debug', default properties key name preceded by hyphen '-'
      property: optional string, default properties key name: false for none. The property in the resulting options object
      type: optional string or function({value, i: {argv, index, options}, parser, action}) default 'boolean': option type name
      numerality: optional string default 'optionalOnce': 'optional' 'optionalOnce' 'mandatory' 'mandatoryMany' 'none'
      hasValue: optional string default 'never': 'never' 'may' 'always'
      valueName: optional string or async function returning string: name describing the value. default defined by option type
      value: value initially present in resulting options object, default none
      help: optional string or async function returning string: help text, default defined by option type
    }
  }
  optionTypes: {
    'float': value: class extends Option or function
  }
  exit: optional function(statusCode): default process.exit
  usage: optional async function({name, version}) generate usage string, default: internally generated
  args: optional string numerality-value: allowable non-option string, default 'optional'
  defaults: bolean default true: add -h/-help/--help/-debug/-profile flags to options
  profiles: add -profile flag to options. default value is readYaml
  readYaml: optional boolean default false: read [app]-[hostname].yaml or [app].yaml from . ~/apps .. /etc. true: use 'options' key in yaml. string: use this key name
  help: optional string or async function returning string: help text, default no description
  helpArgs: optional string or async function returning string: help text for args, default 'args…'
}
*/

export default class Parser extends ParserYaml {
  constructor(o) {
    super(o)
    this.debug && console.log(`${this.m} constructor: ${util.inspect(this, {colors: true, depth: null})}`)
  }

  async parseOptions(argv) {
    const {debug, readYaml} = this
    const options = this.getInitialOptions()
    const i = {options, argv, index: 0}
    let yamlProfiles, s

    // readYaml
    if (readYaml) {
      const optionsFile = await this.getYamlFilename()
      if (optionsFile) {
        const optionsFileProp = typeof readYaml === 'string' ? readYaml : Parser.defaultYamlKey
        const data = Object(await this.getYaml(optionsFile))
        yamlProfiles = Object(data.profiles)
        const yamlOptions = Object(data[optionsFileProp])
        debug && console.log(`${this.m} merging yaml options from ${optionsFile} key: ${optionsFileProp}:`, yamlOptions)
        Object.assign(options, yamlOptions, {optionsFile, optionsFileProp})
      }
    }

    debug && console.log(`${this.m} parseOptions argv:`, argv, 'initialOptions:', options)
    const maxIndex = argv.length
    while (i.index < maxIndex) {

      // non-options
      const token = argv[i.index]
      if (!token.startsWith('-')) {
        debug && console.log(`${this.m} non-option: ${token}`)
        this.addNumeralityOccurrence()
        if ((s = this.isNumeralityBad())) return this.doError(s)
        const {args} = options
        if (!args) options.args = [token]
        else args.push(token)
        i.index++
        continue
      }

      // option name and value
      const {optionName, optionValue} = this.getOptionName(token)
      const option = this.getOptionByName({optionName, token})
      if (typeof option === 'string') return this.doError(option)
      const nextIndex = i.index + 1
      const nextToken = nextIndex < maxIndex ? argv[nextIndex] : undefined
      const optionalValue = nextToken && !nextToken.startsWith('-') ? nextToken : undefined
      const {value, indexIncrement, errorText} = this.getOptionValue({option, optionName, optionValue, optionalValue})
      if (errorText) return this.doError(errorText)
      option.addNumeralityOccurrence()
      if ((s = option.isNumeralityBad())) return this.doError(`option ${optionName}: ${s}`)

      // execute option
      debug && console.log(`${this.m} execute option: ${option.constructor.type}`, {name: optionName, value, i, indexIncrement})
      const optionResult = await option.execute({name: optionName, value, i, indexIncrement})
      if (typeof optionResult === 'string') return this.doError(optionResult)
      else if (optionResult === true) continue
      i.index += indexIncrement
    }
    if ((s = this.checkForMandatoryOptions())) return this.doError(s)
    if (options.optionsFileProfile != null) options.optionsFileProfiles = /*Object(*/yamlProfiles/*)*/ // -profile strings provided

    return options
  }
}
