/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under license found in the LICENSE file in the root directory of this source tree.
*/
import fs from 'fs-extra'
import path from 'path'

export default list => clean(list).catch(errorHandler)

async function clean(args) {
  if (typeof args === 'string') args = [args]
  else if (!Array.isArray(args)) throw new Error('clean: package.json cleans field not non-empty string or array')
  args.forEach((s, index) => {
    const st = typeof s
    if (st !== 'string' || !s) throw new Error(`clean: index ${index}: not non-empty string: ${st}`)
  })
  console.log(`clean: ${args.join(' ')}…`)

  const projectDir = process.cwd()
  await Promise.all(args.map(s => removeIfExist(path.join(projectDir, s))))
  console.log('clean completed successfully.')
}

async function removeIfExist(p) {
  if (await fs.exists(p)) fs.remove(p)
}

function errorHandler(e) {
  console.error(e instanceof Error ? e.message : e)
  process.exit(1)
}
