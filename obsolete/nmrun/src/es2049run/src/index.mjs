/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
// node --experimental-modules src (v8.5+ v9.3+)
import Runner from './Runner'
import pjson from '../package.json'

import fs from 'fs-extra'

const m = String(Object(pjson).name || 'src/index')
const debug = true // TODO set to undefined

run().catch(errorHandler)

async function run() {
  const args = process.argv.slice(2)
  const dir = await fs.realpath(process.cwd())

  if (args[0] === '-debug') debug = !!args.shift()

  const command = getNonEmpty(args.shift(), `${m} command`)
  return new Runner().run({dir, command, args})
}

function getNonEmpty(value, name) {
  if (!value) throw new Error(`${name}: not non-empty string`)
  return value
}

function errorHandler(e) {
  debug && console.error(`${m} error handler:`)
  if (!(e instanceof Error)) e = new Error(`Error value: ${typeof e} e`)
  console.error(!debug ? e.message : e)
  process.exit(1)
}
