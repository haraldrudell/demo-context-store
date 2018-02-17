/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import ParserOptions from './ParserOptions'
import {findYamlFilename, loadYaml} from './yaml'

export default class ParserYaml extends ParserOptions {
  constructor(o) {
    super(o)
    const {optionsData} = o || false
    const {readYaml} = optionsData || false
    Object.assign(this, {readYaml})
  }

  async getYamlFilename() {
    const {name} = this
    return findYamlFilename(name, true)
  }

  async getYaml(filename, key) {
    this.debug && console.log(`${this.m} getYaml ${filename}`)
    const data = Object(await loadYaml(filename))
    return key ? Object(data[key]) : data
  }
}
