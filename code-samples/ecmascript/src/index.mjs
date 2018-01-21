/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved
*/
import Runner from './Runner'
import {readPackageJson} from './readPackageJson'

let m = 'src/index'
let debug

run().catch(onRejected)

async function run() {
  const argv = process.argv.slice(2)
  const {name} = readPackageJson({name: 1})
  m = name
  debug = argv[0] === '-debug'
  debug && console.log(`${m} test async control flow with http server`, {debug, name})
  return new Runner({debug, name}).run()
}

function onRejected(e) {
  debug && console.error(`${m} onRejected:`)
  if (!(e instanceof Error)) e = new Error(`Error value: ${typeof e} ${e}`)
  console.error(!debug ? e.message : e)
  process.exit(1)
}
