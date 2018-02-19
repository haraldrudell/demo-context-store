/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import fs from 'fs-extra'
import yaml from 'js-yaml'

export async function loadYaml(file) {
  return yaml.safeLoad(await fs.readFile(file, 'utf-8'))
}
