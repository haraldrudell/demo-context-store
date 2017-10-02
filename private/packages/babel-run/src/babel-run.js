/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import Compiler from './Compiler'

import fs from 'fs-extra'
import path from 'path'

run().catch(errorHandler)

async function run() {
  const m = 'babel-run'

  const projectDir = await fs.realpath(process.cwd()) // project directory without symlinks
  const args = process.argv.slice(2)
  const sourceDir = path.resolve(projectDir, getNonEmpty(args[0], `${m} source directory`))
  const destDir = path.resolve(projectDir, getNonEmpty(args[1], `${m} target directory`))
  const command = getNonEmpty(args[2], `${m} command`)
  args.splice(0, 3)
  return new Compiler().run({sourceDir, destDir, command, args})
}

function getNonEmpty(value, name) {
  if (!value) throw new Error(`${name}: not non-empty string`)
  return value
}

function errorHandler(e) {
  console.error(e instanceof Error ? e.message : e)
  process.exit(1)
}
