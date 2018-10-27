/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
// node --experimental-modules --no-warnings scripts/linkfonts.mjs
import fs from 'fs-extra'
import path from 'path'
import {default as resolvePkg} from 'resolve'

run({
  arg: process.argv[2],
  dir: path.join('src', 'root'),
  pkg: 'typeface-roboto',
  symlink: 'fonts.css',
  emptyFile: 'empty.css',
}).catch(errorHandler)



async function run({arg, dir, pkg, symlink, emptyFile}) {
  const action = arg === 'yes' ? true : arg === 'no' ? false : undefined
  if (action === undefined) throw new Error('Please provide argument \'yes\' or \'no\'')

  const dst = path.join(dir, symlink)
  await fs.remove(dst)

  const target = action
    ? path.relative(dir, await new Promise((resolve, reject) => resolvePkg(pkg,
      (e, r) => !e ? resolve(r) : reject(e))))
    : path.join(dir, emptyFile)

  return fs.symlink(target, dst)
}

function errorHandler(e) {
  console.error(e && e.message || e)
  process.exit(1)
}
