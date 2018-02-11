/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import EmailVerifier from './EmailVerifier'
import pj0 from '../package.json'

import {OptionsParser, readPackageJson} from 'getopt2018'

let m = 'src/index'
let debug

const optionsData = {
  properties: {
    port: {
      type: 'integer',
      min: 1,
      max: 65535,
      hasValue: 'always',
    },
  },
  readYaml: true,
  help: {
    args: 'email@domain.com …',
    description: [
      '  Tests whether email addresses are valid',
    ].join('\n'),
  },
}

run().catch(onRejected)

async function run() {
  const pj = readPackageJson({name: 1, version: 1}, pj0)
  m = pj.name
  const options = await new OptionsParser({optionsData, ...pj}).parseOptions(process.argv.slice(2))
  options.debug && (debug = true) && console.log(`${m} options:`, options)
  const {args: mailboxes} = options
  delete options.args
  return new EmailVerifier(options).verify(mailboxes, true)
}

function onRejected(e) {
  debug && console.error(`${m} onRejected:`)
  if (!(e instanceof Error)) e = new Error(`Error value: ${typeof e}, '${e}'`)
  console.error(!debug ? e.message : e)
  debug && console.trace('onRejected invocation:')
  process.exit(1)
}
