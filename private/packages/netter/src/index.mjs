/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import Netter from './Netter'
import pjson from '../package.json'

import util from 'util'

import {OptionsParser, launchProcess, numeralities} from 'es2049options'

const optionsData = {
  properties: {
    check: {
      type: 'true',
      help: 'Basic connectivity check, executed by default',
    },
    dns: {help: 'NIMP restart dnscrypt'}, // TODO 180223 hr NIMP
    startcaptive: {help: 'NIMP start captive portal flow'}, // TODO 180223 hr NIMP
    stopcaptive: {help: 'NIMP end captive portal flow'}, // TODO 180223 hr NIMP
    vpnroute: {help: 'NIMP insert default route for vpn'}, // TODO 180223 hr NIMP
  },
  readYaml: true,
  args: numeralities.none,
  help: [
    'with no arguments, netter runs a basic connectivity check',
    'use -profile for specific tests',
  ].join('\n'),
}

launchProcess({run, name: Object(pjson).name, version: Object(pjson).version})

async function run({name, version, OnRejected}) {
  const options = await new OptionsParser({optionsData, name, version}).parseOptions(process.argv.slice(2))
  options.debug && OnRejected.setDebug() && console.log(`${name} options: ${util.inspect(options, {colors: true, depth: null})}`)
  return new Netter(options).run()
}
