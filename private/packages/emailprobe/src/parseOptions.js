/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import {tryYaml, loadYaml, mergeOptions} from './optionsHelpers'

import path from 'path'

export async function parseOptions({argv, name, version}) {
  function exit(message) {
    const usage = [
      `${name} -help -debug -config f email@server.com …`,
      `    version: ${version}`,
      '  tests email address validity',
      '    logs certificate information and results',
      '  -config f  load options from yaml file f resolved to current directory',
      `    if not provided, ${name}.yaml is scanned for in locations: . ~/apps ..`,
    ].join('\n')

    const statusCode = message ? 2 : 0
    const logFn = statusCode ? console.error : console.log
    message && logFn(`${message}\n`)
    logFn(usage)
    process.exit(statusCode)
  }

  const optionsDescriptions = {
    name,
    options: {
      debug: 'boolean',
      ssh: 'string',
      port: 'number',
    },
  }
  const mailboxes = []
  const options = {name, mailboxes}
  let hadConfig

  for (let i = 0, arg = argv[i]; i < argv.length; arg = argv[++i]) switch (arg) {
    case '-h':
    case '-help':
    case '--help':
      exit()
      // eslint-disable-line no-fallthrough
    case '-config':
      hadConfig = true
      Object.assign(options, await loadYaml(path.resolve(argv[++i])))
      break
    case '-debug':
      options.debug = true
      break
    default:
      if (arg.startsWith('-')) exit(`Unknown option: '${arg}'`)
      mailboxes.push(arg)
      break
  }
  if (!hadConfig) {
    const o = await tryYaml(options)
    o && mergeOptions(options, o, optionsDescriptions)
  }
  return options
}
