/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved
*/
import AndroidManager from './AndroidManager'
import parseOptions from './parseOptions'
import {getJson} from './jsonExtractor'

let m = 'src/index'
let debug

run().catch(onRejected)

async function run() {
  const {name, version} = getJson()
  m = name
  const options = parseOptions({argv: process.argv.slice(2), name, version})
  options.onRejected = onRejected
  options.debug && (debug = true) && console.log(`${m} options:`, options)
  return new AndroidManager(options).run()
}

function onRejected(e) {
  debug && console.error(`${m} onRejected:`)
  if (!(e instanceof Error)) e = new Error(`Error value: ${typeof e}, '${e}'`)
  console.error(!debug ? e.message : e)
  debug && console.trace('onRejected invocation:')
  process.exit(1)
}
