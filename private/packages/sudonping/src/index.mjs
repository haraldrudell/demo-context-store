/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import NPinger from './NPinger'
import pjson from '../package.json'

import {OptionsParser, launchProcess, numeralities} from 'es2049options'

const optionsData = {
  properties: {},
  args: numeralities.none,
}

launchProcess({run, name: pjson && pjson.name, version: pjson && pjson.version})

async function run({name, version, OnRejected}) {
  const options = await new OptionsParser({optionsData, name, version}).parseOptions(process.argv.slice(2))
  Object.assign(options, {uid: process.getuid(), name})
  options.debug && OnRejected.setDebug() && console.log(`${name} options:`, options)
  return new NPinger(options).nping()
}
