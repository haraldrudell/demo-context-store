/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import Netter from './Netter'
import pjson from '../package.json'

import {OptionsParser, launchProcess} from 'es2049options'

const netChecker = {
}

const optionsData = {
  properties: {
    check: {help: 'Basic connectivity check'},
    checkdefault: {help: 'check connecivity using overriding vpn'},
    checkdefaultif: {help: 'check connecivity on underlying default interface'},
    checkdns: {help: 'check dns'},
    dns: {help: 'restart dnscrypt'},
    netChecker: {
      value: netChecker,
      help: '',
    },
    startcaptive: {help: 'start captive portal flow'},
    stopcaptive: {help: 'end captive portal flow'},
    vpnroute: {help: 'insert default route for vpn'},
  },
  readYaml: true,
  args: 'none',
/*
  help: {
    args: 'email@domain.com …',
    description: [
      '  Tests whether email addresses are valid',
    ].join('\n'),
  },
*/
}

launchProcess({run, pjson})

async function run({name, version, OnRejected}) {
  const options = await new OptionsParser({optionsData, name, version}).parseOptions(process.argv.slice(2))
  options.debug && OnRejected.setDebug() && console.log(`${name} options:`, options)
  return new Netter(options).run()
}
