/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import AvailabilityManager from './AvailabilityManager'
import getGlobals from './globals'
import {getISOTime} from './Status'
import {od, OptionsParser, findYamlFilename, loadYaml} from 'getopt2018'

import classRunner from 'classrunner'

import os from 'os'
import path from 'path'

const optionsData = {
  file: [od.mustHaveArg, 'name of yaml parameter file'],
  profile: [od.mustHaveArg, 'profile name from parameter file, default profile is \'default\''],
}

classRunner({construct: AvailabilityManager, options: loadAllOptions})

async function loadAllOptions() {
  const r = getGlobals() // string values injected at transpile
  const b = r.THE_NAME || path.basename(__filename)
  const commandName = r.THE_NAME || b.substring(0, b.length - path.extname(b).length)

  // display greeting
  const theHost = os.hostname().replace(/\..*$/, '')
  const processLaunch = Date.now() - process.uptime()
  console.log(`\n\n=== ${commandName} ${theHost}:${process.pid} ${getISOTime(processLaunch)}`)

  const optionsParser = new OptionsParser({
    name: commandName,
    options: optionsData,
  })
  const options = optionsParser.getOpt(process.argv.slice(2))
  const isHelp = !options
  const error = options instanceof Error && options
  if (isHelp || error) {
    if (error) console.error(error.message)
    console.error(
      `usage: ${commandName} [options]\n` +
      `  program version: ${r.THE_VERSION}${r.THE_BUILD ? ' built: ' + r.THE_BUILD : ''}\n` +
      optionsParser.usage().join('\n'))
    process.exit(error ? 2 : 0)
  }

  // get yaml options
  if (!options.file) options.file = await findYamlFilename(commandName)
  const yamlOptions = await loadYaml(options.file)

  if (!options.profile) options.profile = yamlOptions.hostprofiles
    ? theHost
    : 'default'
  return {...yamlOptions, cmdName: commandName, ...options}
}
