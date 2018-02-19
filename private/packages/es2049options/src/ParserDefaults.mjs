/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import ParserUsage from './ParserUsage'
import {valueFlags, numeralities} from './Option'
import OptionHelp from './OptionHelp'

export default class ParserDefaults extends ParserUsage {
  static helpOption = {
    names: ['-help', '-h', '--help'],
    type: OptionHelp,
    numerality: numeralities.optionalOnce,
    hasValue: valueFlags.never,
    help: 'display usage',
  }
  static debugOption = {
    property: 'debug',
    help: 'diagnostic output',
  }
  static profileOption = {
    names: ['-profile'],
    type: 'nestring',
    property: 'optionsFileProfile',
  }

  constructor(o) {
    super(o)
    const {optionsData} = o || false
    const {defaults, profiles, readYaml} = optionsData || false
    const doAddDefaults = defaults !== false
    const {helpOption, debugOption, profileOption} = ParserDefaults

    const optionList = []
    if (doAddDefaults) {
      optionList.push({...helpOption, fn: this.doUsage.bind(this)}, debugOption)
    }
    if (profiles || (profiles === undefined && readYaml)) optionList.push({...profileOption, help: this.profileHelp.bind(this)})
    for (let option of optionList) this.createOption(option)
  }

  async profileHelp() {
    let s = 'key name in yaml file, default name: options'
    const filename = await this.getYamlFilename()
    if (filename) {
      const yamlObject = await this.getYaml(filename)
      const keys = Object.keys(yamlObject)
      if (keys.length) s += `values in ${filename}: ${keys.join(' ')}`
    }
    return s
  }
}
