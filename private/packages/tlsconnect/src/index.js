/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import TlsConnector from './TlsConnector'

import {parseOptions} from './parseOptions'
import pjson from '../package.json'

let debug
const m = pjson.name

run().catch(errorHandler)

async function run() {
  const {name} = pjson
  const {argv} = process
  const options = await parseOptions({argv, name, m})
  debug = options.debug
  const {sockets} = options
  delete options.mailboxes
  await new TlsConnector(options).verify(sockets)
}

function errorHandler(e) {
  debug && console.error(`${m} errorHandler:`)
  if (!(e instanceof Error)) e = new Error(`Error value: ${typeof e}, '${e}'`)
  console.error(!debug ? e.message : e)
  debug && console.error(new Error('ErrorHandler invocation'))
  process.exit(1)
}
