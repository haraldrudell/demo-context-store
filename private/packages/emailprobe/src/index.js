/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import EmailVerifier from './EmailVerifier'

import {parseOptions} from './parseOptions'
import pjson from '../package.json'

let debug = true // TODO set to undefined
const m = pjson.name

run().catch(errorHandler)

async function run() {
  const {name} = pjson
  const {argv} = process
  const options = await parseOptions({argv, name, m})
  if (options.debug === undefined) options.debug = true // debug = options.debug TODO remove comment
  const {mailboxes} = options
  delete options.mailboxes
  await new EmailVerifier(options).verify(mailboxes)
}

function errorHandler(e) {
  debug && console.error(`${m} errorHandler:`)
  if (!(e instanceof Error)) e = new Error(`Error value: ${typeof e}, '${e}'`)
  console.error(!debug ? e.message : e)
  debug && console.error(new Error('ErrorHandler invocation'))
  process.exit(1)
}
