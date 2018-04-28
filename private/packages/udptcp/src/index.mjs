/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
//import Netter from './Netter'
import pjson from '../package.json'

import {OptionsParser, launchProcess, numeralities} from 'es2049options'

const optionsData = {
  properties: {
    udp: 'portnumber',
    tcp: 'portnumber',
  },
  readYaml: true,
  args: numeralities.none,
  help: [
    'Forwards udp packets inside tcp for transport via ssh forwarding or the Tor network',
  ].join('\n'),
}

launchProcess({run, name: pjson && pjson.name, version: pjson && pjson.version})

async function run({name, version, OnRejected}) {
  const options = await new OptionsParser({optionsData, name, version, debug: true}).parseOptions(process.argv.slice(2))
  OnRejected.logDebug({options, name})
  return // new Netter(options).run()
}
