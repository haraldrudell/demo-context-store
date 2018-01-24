/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import EmailVerifier from './EmailVerifier'
import {parseOptions} from './parseOptions'
import {readPackageJson} from './readPackageJson'

let m = 'src/index'
let debug = true

run().catch(onRejected)

async function run() {
  const pj = readPackageJson({name: 1, version: 1})
  m = pj.name
  const options = await parseOptions({argv: process.argv.slice(2), ...pj})
  debug = options.debug
  debug && console.log(`${m} options:`, options)
  const {mailboxes} = options
  delete options.mailboxes
  return new EmailVerifier(options).verify(mailboxes, true)
}

function onRejected(e) {
  debug && console.error(`${m} onRejected:`)
  if (!(e instanceof Error)) e = new Error(`Error value: ${typeof e}, '${e}'`)
  console.error(!debug ? e.message : e)
  debug && console.error(new Error('onRejected invocation:'))
  process.exit(1)
}
