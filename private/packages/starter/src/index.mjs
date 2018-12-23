/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import Starter from './Starter'
import pjson from '../package.json'

import util from 'util'

import {OptionsParser, launchProcess, numeralities} from 'es2049options'

const optionsData = {
  readYaml: true,
  args: numeralities.none,
}

launchProcess({run, name: Object(pjson).name, version: Object(pjson).version})

async function run({name, version, OnRejected}) {
  const options = await new OptionsParser({optionsData, name, version}).parseOptions(process.argv.slice(2))
  options.debug && OnRejected.setDebug() && console.log(`${name} options: ${util.inspect(options, {colors: true, depth: null})}`)
  await new Starter(options).start()
  return 0
}
