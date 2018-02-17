/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import ParserYaml from './ParserYaml'

export default class ParserDefaults extends ParserYaml {
  static helpOption = {
    names: ['-help', '-h', '--help'],
    help: 'display usage',
  }
  static debugOption = {
    names: '-debug',
    property: 'debug',
    help: 'diagnostic output',
    type: 'boolean',
  }
  static profileOption = {
    names: ['-profile'],
    type: 'nestring',
    hasValue: 'always',
    property: 'optionsFileProp',
  }

  constructor(o) {
    super(o)
    const {optionsData} = o || false
    const {defaults} = optionsData || false
    const doAddDefaults = defaults !== false
    if (doAddDefaults) {
      const {helpOption: ho, debugOption, profileOption} = ParserDefaults
      const {readYaml} = this
      const helpOption = {...ho, type: this.doUsage.bind(this)}
      const options = [helpOption, debugOption]
      if (readYaml) {
        profileOption.help = this.profileHelp.bind(this)
        options.push(profileOption)
      }
      this.addOptions(options)
    }
  }

  async profileHelp() {
    let s = 'key name in yaml file, default name: options'
    const filename = await this.getYamlFilename()
    if (filename) {
      const yamlObject = await this.getYaml(filename)
      const keys = Object.keys(yamlObject)
      if (keys.length) s += `\n    values in ${filename}: ${keys.join(' ')}`
    }
    return s
  }
}
