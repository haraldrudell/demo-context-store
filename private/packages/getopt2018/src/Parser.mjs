/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import ParserDefaults from './ParserDefaults'

import util from 'util'

/*
const optionsData = {
  properties: {
    debug: {
      numerality: optional string default 'optionalOnce': 'optional' 'optionalOnce' 'mandatory' 'mandatoryMany'
      names: string/list of string option names like '-debug', default property name
      type: optional string or function({value, i: {argv, index, options}, parser, action}) default 'boolean'
      property: optional string: options object property name, false for none, default is key value
      equalSign: optional boolean: default is the global value
      hasValue: optional string default never: 'never' 'may' 'always'
    }
  }
  optionTypes: {
    'float': function floatParser()
  }
  exit: optional function(statusCode): default process.exit
  usage: optional function({name, version}) generate usage string, default: internally generated
  equalSign: optional boolean default true: allow equal sign in options: -file=abc
  args: optional string numerality-value: default 'optional'
  defaults: bolean default true: add -h/-help/--help/-debug actions
  readYaml: optional boolean default false: read [app]-[hostname].yaml or [app].yaml from . ~/apps .. /etc
}
*/

export default class OptionsParser extends ParserDefaults {
  constructor(o) {
    super(o)
    this.debug && console.log(`${this.m} OptionsParser props: ${util.inspect(this, {color: true, depth: null})}`)
  }

  async parseOptions(argv) {
    const {debug, readYaml} = this
    const options = this.getInitialOptions()
    const i = {options, argv, index: 0}
    if (readYaml) {
      const optionsFile = await this.getYamlFilename()
      const optionsFileProp = 'options'
      Object.assign(options, {optionsFile, optionsFileProp})
    }
    debug && console.log(`${this.m} parseOptions argv:`, argv, 'initialOptions:', options)
    const maxIndex = argv.length
    const parser = this

    while (i.index < maxIndex) {

      // non-options
      const token = argv[i.index]
      if (!token.startsWith('-')) {
        debug && console.log(`${this.m} non-option: ${token}`)
        const notAllowedMessage = this.addToArgs({arg: token, i})
        if (notAllowedMessage) this.doError(notAllowedMessage)
        continue
      }

      // option name
      const {arg: name, value: value0} = this.processEqualSign(token)
      const option = this.getOptionByName(name)
      if (!option) return this.doError(`Unknown option: ${name}`)
      if (!option.anotherInvocationOk()) return this.doError(`option: ${name} can only be provided once`)

      // option value
      const {value, text} = this.ensureValueOk({i, arg: name, value: value0, option})
      if (text) return this.doError(text)

      // execute action
      const v = await option.type({name, value, i, option, parser})
      if (typeof v === 'string') return this.doError(v)
      else if (v === true) continue

      i.index++
    }

    const mText = this.checkForMandatoryOptions()
    if (mText) return this.doError(mText)

    const {optionsFile, optionsFileProp} = options
    debug && console.log(`${this.m} premerging in yaml options:`, {optionsFile, optionsFileProp}, options)
    if (optionsFile) {
      const yamlOptions = await this.getYaml(optionsFile, optionsFileProp)
      debug && console.log(`${this.m} merging in yaml options:`, yamlOptions)
      Object.assign(options, yamlOptions)
    }

    return options
  }
}
