/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import GitScanner from './GitScanner'
import pjson from '../package.json'

import {OptionsParser, launchProcess, numeralities, valueFlags, typeNames} from 'es2049options'

const optionsData = {
  readYaml: true,
  args: numeralities.optionalOnce,
  properties: {
    yaml: {
      type: typeNames.nestring,
      hasValue: valueFlags.always,
      value: 'gitData.yaml',
    },
  },
}

launchProcess({run, name: Object(pjson).name, version: Object(pjson).version})

async function run({name, version, OnRejected}) {
  const options = await new OptionsParser({optionsData, name, version}).parseOptions(process.argv.slice(2))
  if (options.args) {
    options.dir = options.args[0]
    delete options.args
  }
  OnRejected.logDebug({options, name})
  await new GitScanner(options).scan()
  return 0
}
