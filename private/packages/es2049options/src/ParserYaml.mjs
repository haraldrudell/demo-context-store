/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import ParserOptions from './ParserOptions'

import fs from 'fs-extra'
import yaml from 'js-yaml'

import os from 'os'
import path from 'path'

export default class ParserYaml extends ParserOptions {
  constructor(o) {
    super(o)
    const {optionsData} = o || false
    const {readYaml} = optionsData || false
    Object.assign(this, {readYaml})
  }

  async getYamlFilename(noneIsOk = true) {
    // get path list
    const paths = []
    const {name} = this
    const hostname = os.hostname().replace(/\..*$/, '') // remove possi ble file extension
    for (let basename of [`${name}-${hostname}.yaml`, `${name}.yaml`])
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
