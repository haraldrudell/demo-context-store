/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import OptionsDefaults from './OptionsDefaults'

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

export default class OptionsParser extends OptionsDefaults {
  async parseOptions(argv) {
    const {debug} = this
    const i = {
      options: this.getInitialOptions(),
      argv,
      index: 0,
    }
    const maxIndex = argv.length
    debug && console.log(`${this.m} parseOptions argv:`, argv, 'initialOptions:', i.options)

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
      const {arg, value: value0} = this.processEqualSign(token)
      const action = this.actionIndex[arg]
      if (!action) this.doError(`Unknown option: ${arg}`)
      if (!action.anotherInvocationOk()) this.doError(`option: ${arg} can only be provided once`)

      // option value
      const {value, text} = this.ensureValueOk({i, arg, value: value0, action})
      if (text) this.doError(text)

      // execute action
      const v = await action.type({value, i, action, parser: this})
      if (typeof v === 'string') this.doError(v)
      else if (v === true) continue

      i.index++
    }

    const mText = this.checkForMandatoryActions()
    if (mText) this.doError(mText)

    if (this.readYaml) await this.mergeYaml(i)

    return i.options
  }
}
