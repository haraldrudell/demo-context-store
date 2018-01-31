/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import AndroidConfigurator from './AndroidConfigurator'
import {OptionsParser, readPackageJson} from 'getopt2018'
import pj0 from '../package.json'

let m = 'src/index'
let debug

const optionsData = {
  properties: {
    addcert: {
      type: 'filename',
      hasValue: 'may',
      help: '[file] add certificate, default or from file',
    },
  },
  readYaml: true,
  help: {
    args: '[adb device qualifier…]',
    description: [
      '  Configures Android devices',
      '  A qualifier is a serial 9326f8cef3a02463 or 192.168.1.196:5555',
      '  if missing: ANDROID_SERIAL or prompt',
    ].join('\n'),
  },
}

run().catch(onRejected)

async function run() {
  const pj = readPackageJson({name: 1, version: 1}, pj0)
  m = pj.name
  const options = await new OptionsParser({optionsData, ...pj}).parseOptions(process.argv.slice(2))
  options.debug && (debug = true) && console.log(`${m} options:`, options)
  process.env.ANDROID_SERIAL && (options.androidSerial = process.env.ANDROID_SERIAL)
  const serials = options.args
  delete options.args
  return new AndroidConfigurator(options).configure(serials)
}

function onRejected(e) {
  debug && console.error(`${m} onRejected:`)
  if (!(e instanceof Error)) e = new Error(`Error value: ${typeof e}, '${e}'`)
  console.error(!debug ? e.message : e)
  debug && console.error(new Error('onRejected invocation:'))
  process.exit(1)
}
