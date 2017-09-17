/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import AvailabilityManager from './AvailabilityManager'
import getGlobals from './globals'
import {getISOTime} from './Status'

import classRunner from 'classrunner'

import fs from 'fs-extra'
import yaml from 'js-yaml'

import os from 'os'
import path from 'path'

classRunner({construct: AvailabilityManager, options: loadAllOptions})

const HAS_ARG = 1
const IS_HELP = 0
const optionMap = {
  help: IS_HELP,
  profile: HAS_ARG,
  file: HAS_ARG,
}

async function loadAllOptions() {
  const r = getGlobals() // string values injected at transpile
  const b = r.THE_NAME || path.basename(__filename)
  const commandName = r.THE_NAME || b.slice(0, -path.extname(b))

  // display greeting
  const theHost = os.hostname().replace(/\..*$/, '')
  const processLaunch = Date.now() - process.uptime()
  console.log(`\n\n=== ${theHost}:${r.THE_NAME + ':' || ''}${process.pid} ${getISOTime(processLaunch)}`)

  const options = getOpt(process.argv.slice(2))
  const isError = options instanceof Error
  if (!options || isError) {
    console.log(getUsage(r))
    if (isError) console.error(options.message)
    process.exit(isError ? 1 : 0)
  }

  // get yaml options
  if (!options.file) options.file = await findYamlFilename(commandName)
  const yamlOptions = await loadYaml(options.file)

  if (!options.profile) options.profile = yamlOptions.hostprofiles
    ? theHost
    : 'default'
  return {...yamlOptions, ...options}
}

function getOpt(argv, allowStrings) {
  const options = {}
  const strings = []

  while (argv.length) {
    const token = argv.shift()
    if (token === '--') { // remaining tokens are non-options
      Array.prototype.push.apply(strings, argv.slice(1))
      break
    }
    const ch = token[0]
    if (ch !== '-') { // string token
      strings.push(token)
      continue
    }
    const ch2 = token[1]
    const nohypens = token.substring(ch2 === '-' ? 2 : 1)
    const option = getBeforeEqual(nohypens)
    const hadEqual = option.length !== nohypens.length
    const optionType = optionMap[option]
    if (optionType === undefined) return new Error(`Unknown option: ${token}`)
    if (optionType === IS_HELP) return
    if (optionType === HAS_ARG) {
      if (!hadEqual && !argv.length) return new Error(`Missing argument for option ${token}`)
      options[option] = hadEqual ? nohypens.substring(option.length + 1) : argv.shift()
    } else return new Error(`Unimplemented option type: ${optionType}`)
  }
  if (strings.length) {
    if (!allowStrings) return new Error(`Extra arguments: ${strings.join(' ')}`)
    options.strings = strings
  }
  return options
}

function getBeforeEqual(s) {
  const i = s.indexOf('=')
  return ~i
    ? s.substring(0, i)
    : s
}

function getUsage(r) {
  return (
  `${r.THE_NAME || ''}\n` +
  `${r.THE_VERSION}${r.THE_BUILD ? ' built: ' + r.THE_BUILD : ''}\n` +
  `  -profile name, default 'default'\n` +
  `  -file name, paraneter yaml file\n`
  )
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
