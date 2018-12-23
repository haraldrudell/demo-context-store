/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import ParserDefaults from './ParserDefaults'

import fs from 'fs-extra'
import yaml from 'js-yaml'

import os from 'os'
import path from 'path'

export default class ParserYaml extends ParserDefaults {
  constructor(o) {
    super(o)
    const {optionsData} = Object(o)
    const {readYaml} = Object(optionsData)
    readYaml && (this.readYaml = readYaml)
  }

  getYamlBasenames() {
    const {name} = this
    const hostname = os.hostname().replace(/\..*$/, '') // remove possible file extension
    return [`${name}-${hostname}.yaml`, `${name}.yaml`]
  }

  async getYamlFilename(noneIsOk = true) {
    const {optionsYamlFile} = this
    if (optionsYamlFile) return optionsYamlFile
    // get path list
    const paths = []
    for (let basename of this.getYamlBasenames())
      paths.push(basename, path.join(os.homedir(), 'apps', basename), path.join('..', basename), path.join('/etc', basename))
    for (let aPath of paths) {
      if (await fs.pathExists(aPath)) return aPath
    }
    if (!noneIsOk) throw new Error(`Parameter files not found: ${paths.join(', ')}`)
  }

  async getYaml(filename, key) {
    this.debug && console.log(`${this.m} getYaml ${filename}`)
    const data = Object(await yaml.safeLoad(await fs.readFile(filename, 'utf-8')))
    return key ? Object(data[key]) : data
  }
}
