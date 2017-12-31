/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import yaml from 'js-yaml'

import path from 'path'
import fs from 'fs-extra'
import os from 'os'

export async function tryYaml(options) {
  const basename = `${options.name}.yaml`
  for (let p of ['.', path.join(os.homedir(), 'apps'), '..']) {
    p = path.resolve(p, basename)
    if (await fs.pathExists(p)) return loadYaml(p)
  }
}

export async function loadYaml(f) {
  return yaml.safeLoad(await fs.readFile(f, 'utf-8'))
}

export function mergeOptions(options, o, oDesc) {
  for (let [name, type] of Object.entries(oDesc.options)) {
    if (options[name] === undefined) {
      let value = o[name]
      if (type === 'number' && value != null) {
        const n = Number(value)
        if (isNaN(n)) throw new Error(`${oDesc.name} value not numeric: ${value}`)
        value = n
      }
      if (value !== undefined) {
        const tValue = typeof value
        if (tValue !== type) throw new Error(`${oDesc.name} bad type for yaml option ${name}: ${tValue}, expected ${type}`)
        options[name] = value
      }
    }
  }
}
