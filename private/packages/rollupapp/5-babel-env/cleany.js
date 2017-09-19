/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import fs from 'fs-extra'
import path from 'path'

export default async function cleanx(args) {
  if (typeof args === 'string') args = [args]
  else if (!Array.isArray(args) || !args.length) throw new Error('clean: argument not non-empty string or array')
  for (let [index, s] of args) {
    const st = typeof s
    if (st !== 'string' || !s) throw new Error(`clean: index ${index}: not non-empty string: ${st}`)
  }
  console.log(`clean: ${args.join(' ')}…`)

  const projectDir = fs.realpathSync(process.cwd()) // project directory without symlinks
  await Promise.all(args.map(s => removeIfExist(path.resolve(projectDir, s))))
  console.log('clean completed successfully.')
}

async function removeIfExist(p) {
  if (await fs.exists(p)) await fs.remove(p)
}
