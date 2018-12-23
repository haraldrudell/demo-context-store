/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import Runner from './Runner'

import fs from 'fs-extra'

const m = 'nmrun'

run().catch(errorHandler)

async function run(o) {
  const {args: args0 = process.argv.slice(2), dir: dir0 = process.cwd()} = o || false

  const command = getNonEmpty(args0[0], `${m} command`)
  const args = args0.slice(1)
  const dir = await fs.realpath(dir0)
  return new Runner().run({dir, command, args})
}

function getNonEmpty(value, name) {
  if (!value) throw new Error(`${name}: not non-empty string`)
  return value
}

function errorHandler(e) {
  console.error(e instanceof Error ? e.message : e)
  process.exit(1)
}
