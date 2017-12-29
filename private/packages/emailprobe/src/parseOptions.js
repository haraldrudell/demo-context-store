/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import {tryYaml, loadYaml, mergeOptions} from './optionsHelpers'

import path from 'path'

export async function parseOptions({argv, name}) {
  const oDesc = {
    name,
    options: {
      debug: 'boolean',
      ssh: 'string',
      port: 'number',
    },
  }
  const mailboxes = []
  const options = {name, mailboxes}
  const help =
    `${name} -help -debug -config f email@server.com …\n` +
    '  tests email address validity'
  let hadConfig

  for (let i = 2, arg = argv[i]; i < argv.length; arg = argv[++i]) switch (arg) {
    case '-h':
    case '-help':
    case '--help':
      console.log(help)
      process.exit(0)
      // eslint-disable-line no-fallthrough
    case '-ssh':
      options.ssh = arg
      break
    case '-config':
      hadConfig = true
      Object.assign(options, await loadYaml(path.resolve(argv[++i])))
      break
      case '-debug':
      options.debug = true
      break
    default:
      if (arg.startsWith('-')) {
        console.error(`Unknown option: '${arg}'\n`)
        console.error(help)
        process.exit(2)
      }
      mailboxes.push(arg)
      break
  }
  if (!hadConfig) {
    const o = await tryYaml(options)
    o && mergeOptions(options, o, oDesc)
  }
  return options
}
