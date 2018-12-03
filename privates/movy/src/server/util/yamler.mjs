/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import fs from 'fs-extra'
import yaml from 'js-yaml'

import path from 'path'
import os from 'os'

const yamlExt = '.yaml'

export async function loadYaml(file) {
  if (!file || typeof file !== 'string') throw new Error('loadYaml: file not non-empty string')
  const hasPath = path.basename(file) !== file
  const hasExt = !!path.extname(file) // '.txt'

  if (hasPath) return doLoad(hasExt ? file : file + yamlExt)

  const files = hasExt ? [file] : [`${file}-${getShortHostname()}`, file].map(f => f + yamlExt)
  const dirs = [path.join(os.homedir(), 'apps'), path.resolve('..'), '/etc']
  for (let dir of dirs)
    for (let aFile of files) {
      const abs = path.join(dir, aFile)
      if (!await fs.pathExists(abs)) continue
      return doLoad(abs)
    }
  throw new Error(`yaml not found: dirs: [${dirs.join(',\x20')}] files: [${files.join(',\x20')}]`)
}

async function doLoad(filename) {
  return Object(await yaml.safeLoad(await fs.readFile(filename, 'utf-8')))
}

export function getShortHostname() {
  const long = String(os.hostname())
  const i = long.indexOf('.')
  return i < 0 ? long : long.substring(0, i)
}
