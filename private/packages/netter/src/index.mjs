/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import Netter from './Netter'
import pjson from '../package.json'

import {OptionsParser, launchProcess, numeralities} from 'es2049options'

const optionsData = {
  properties: {
    check: {
      type: 'true',
      help: 'Basic connectivity check, executed by default',
    },
    checkdefault: {help: 'check connecivity using overriding vpn'},
    checkdefaultif: {help: 'check connecivity on underlying default interface'},
    checkdns: {help: 'check dns'},
    dns: {help: 'restart dnscrypt'},
    netChecker: {
      help: '',
    },
    startcaptive: {help: 'start captive portal flow'},
    stopcaptive: {help: 'end captive portal flow'},
    vpnroute: {help: 'insert default route for vpn'},
  },
  readYaml: true,
  args: numeralities.none,
  help: [
    'with no arguments, netter runs a basic connectivity check',
    'use -profile for specific tests',
  ].join('\n'),
}

launchProcess({run, name: pjson && pjson.name, version: pjson && pjson.version})

async function run({name, version, OnRejected}) {
  const options = await new OptionsParser({optionsData, name, version}).parseOptions(process.argv.slice(2))
  options.debug && OnRejected.setDebug() && console.log(`${name} options:`, options)
  return new Netter(options).run()
}
