/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import ParserUsage from './ParserUsage'
import {valueFlags, numeralities} from './Option'
import OptionHelp from './OptionHelp'

export default class ParserDefaults extends ParserUsage {
  static defaultYamlKey = 'options'
  static yamlDisableOption = '-no-yaml'

  static helpOption = {
    names: ['-help', '--help'],
    type: OptionHelp,
    numerality: numeralities.optionalOnce,
    hasValue: valueFlags.never,
    help: 'display usage',
  }
  static debugOption = {
    property: 'debug',
    help: 'display diagnostic output',
  }
  static profileOption = {
    names: ['-profile'],
    type: 'nestring',
    property: 'optionsFileProfile',
    valueName: 'key',
  }
  static noYamlOption = {
    names: [ParserDefaults.yamlDisableOption],
    type: 'true',
    help: 'ignore yaml files',
  }

  constructor(o) {
    super(o)
    const {optionsData} = o || false
    const {defaults, profiles, readYaml} = optionsData || false
    const doAddDefaults = defaults !== false
    const {helpOption, debugOption, profileOption, noYamlOption} = ParserDefaults

    const optionList = []
    if (doAddDefaults) {
      optionList.push({...helpOption, fn: this.doUsage.bind(this)}, debugOption)
    }
    if (profiles || (profiles === undefined && readYaml)) optionList.push({...profileOption, help: this.profileHelp.bind(this)}, noYamlOption)
    for (let option of optionList) this.createOption(option)
  }

  async profileHelp() {
    const {readYaml} = this
    const key = typeof readYaml !== 'string' ? ParserDefaults.defaultYamlKey : readYaml
    const basenames = `${this.getYamlBasenames().join('\x20')}`
    let s = [
      `key is used to fetch from yaml top-level 'profiles' dictionary`,
      `yaml filenames searched are: ${basenames}`,
      `paths searched are ~/apps .. /etc`,
      `option defaults are fetched from the top-level '${key}' dictionary`,
    ].join('\n')
    const filename = await this.getYamlFilename()
    if (filename) {
      const yamlObject = await this.getYaml(filename)
      const keys = Object.keys(Object(Object(yamlObject).profiles))
      if (keys.length) s += `\nprofiles in '${filename}': '${keys.join(`'\x20'`)}'`
    }
    return s
  }
}
