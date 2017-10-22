/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import Runner from './Runner'

import fs from 'fs-extra'

run({args: process.argv.slice(2), dir: process.cwd()}).catch(errorHandler)

async function run({args, dir}) {
  const m = 'nmrun'

  const command = getNonEmpty(args[0], `${m} command`)
  args.splice(0, 1)
  const dir = await fs.realpath(dir)
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
