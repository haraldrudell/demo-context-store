/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import AvailabilityManager from './AvailabilityManager'
import instantiate from 'asyncprocess'
import packageJson from '../package.json'
import fs from 'fs-extra'
import commander from 'commander'
import os from 'os'
import path from 'path'
import yaml from 'js-yaml'

instantiate({
  asyncFn: loadAllOptions,
  construct: AvailabilityManager,
  async: 'run',
})

async function loadAllOptions(options) {

  // get command-line options
  const commandName = packageJson.singleFile && packageJson.singleFile.name ||
  packageJson.name
  commander
    .name(commandName)
    .version(packageJson.version)
    .option('--profile <name>', 'monitoring profile, default "default"', 'default')
    .option('--file <name>', 'parameter yaml file')
    .parse(process.argv)
  if (commander.args.length) throw new Error(`Unknown addional parameters: '${commander.args.join(' ')}'`)
  const cmdOptions = commander.opts()
  delete cmdOptions.version
  cmdOptions.cmdName = commandName

  // get yaml options
  if (!cmdOptions.file) cmdOptions.file = await findYamlFilename(commandName)
  const yamlOptions = await loadYaml(cmdOptions.file)

  // save options
  if (!options.asyncArg) options.asyncArg = {}
  Object.assign(options.asyncArg, cmdOptions, yamlOptions)
}

async function findYamlFilename(name) {

  // get path list
  const paths = []
  const hostname = os.hostname().replace(/\..*$/, '')
  for (let basename of [`${name}-${hostname}.yaml`, `${name}.yaml`])
    paths.push(basename, path.join(os.homedir(), 'apps', basename), path.join(os.homedir(), 'apps', basename), path.join('/etc', basename))

  for (let aPath of paths) {
    if (await fs.pathExists(aPath)) return aPath
  }
  throw new Error(`Parameter files not found: ${paths.join(', ')}`)
}

async function loadYaml(file) {
  return yaml.safeLoad(await fs.readFile(file, 'utf-8'))
}
