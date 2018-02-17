/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved
*/
import AdbKitPatcher from './AdbKitPatcher'

let m = 'src/index'
let debug

const patches = {
  adbkit: 'src/adb.js',
  'adbkit-monkey': 'src/monkey.js',
  'adbkit-logcat': 'src/logcat.js',
}

run().catch(onRejected)

async function run() {
  debug = true
  m = 'AdbKitPatcher'
  return new AdbKitPatcher({name: m, debug}).patch(patches)
}

function onRejected(e) {
  debug && console.error(`${m} onRejected:`)
  if (!(e instanceof Error)) e = new Error(`Error value: ${typeof e} ${e}`)
  console.error(!debug ? e.message : e)
  debug && console.error(new Error('onRejected invocation:'))
  process.exit(1)
}
