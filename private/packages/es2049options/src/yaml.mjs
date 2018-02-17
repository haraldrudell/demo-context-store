/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import fs from 'fs-extra'
import yaml from 'js-yaml'

import os from 'os'
import path from 'path'

export async function findYamlFilename(name, noneIsOk) {

  // get path list
  const paths = []
  const hostname = os.hostname().replace(/\..*$/, '')
  for (let basename of [`${name}-${hostname}.yaml`, `${name}.yaml`])
    paths.push(basename, path.join(os.homedir(), 'apps', basename), path.join('..', basename), path.join('/etc', basename))

  for (let aPath of paths) {
    if (await fs.pathExists(aPath)) return aPath
  }
  if (!noneIsOk) throw new Error(`Parameter files not found: ${paths.join(', ')}`)
}

export async function loadYaml(file) {
  return yaml.safeLoad(await fs.readFile(file, 'utf-8'))
}
