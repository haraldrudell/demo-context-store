/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
// node --experimental-modules --no-warnings scripts/linkfonts.mjs
import fs from 'fs-extra'
import path from 'path'

const project = {
  dir: path.join('src'),
  symlink: 'fonts.css',
  projectLink: 'fonts/fonts.css',
  onlineLink: 'fonts/fontsonline.css',
}

run({
  ...project,
  arg: process.argv[2], // 'yes' load css from project or 'no': import online
}).catch(errorHandler)

async function run({arg, dir, symlink, onlineLink, projectLink}) {
  const action = arg === 'yes' ? true : arg === 'no' ? false : undefined
  if (action === undefined) throw new Error('Please provide argument \'yes\' or \'no\'')

  const target = action ? projectLink : onlineLink
  const dst = path.join(dir, symlink)
  await fs.remove(dst)
  return fs.symlink(target, dst)
}

function errorHandler(e) {
  console.error(e && e.message || e)
  process.exit(1)
}
