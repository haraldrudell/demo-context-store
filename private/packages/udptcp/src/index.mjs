/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
// bin/udptcp -d -tcp 1024
import UdpTcp from './UdpTcp'
import TcpPusher from './TcpPusher'
import HttpPusher from './HttpPusher'
import UdpPusher from './UdpPusher'
import pjson from '../package.json'

import {OptionsParser, launchProcess, numeralities} from 'es2049options'

const optionsData = {
  properties: {
    udp: {type: 'port'},
    tcp: {type: 'port'},
  },
  readYaml: true,
  args: numeralities.none,
  help: [
    'Forwards udp packets inside tcp for transport via ssh forwarding or the Tor network',
  ].join('\n'),
}

const constrs = {
  tcp: TcpPusher,
  udp: UdpPusher,
  http: HttpPusher,
}

launchProcess({run, name: pjson && pjson.name, version: pjson && pjson.version})

async function run({name, version, OnRejected}) {
  const options = await new OptionsParser({optionsData, name, version}).parseOptions(process.argv.slice(2))
  Object.assign(options, {constrs})
  OnRejected.logDebug({options, name})
  return new UdpTcp({name, debug: options.debug}).run(options)
}
