/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import instantiate from './util/Process'

import path from 'path'
import fs from 'fs-extra'

export default class Clean {
  static dirs = ['bin', 'build', 'tmp']
  async run() {
    const dirs = Clean.dirs
    console.log(`Clean: ${dirs.join(' ')}`)
    const projectDir = path.resolve(process.cwd())
    return Promise.all(dirs.map(d => fs.remove(path.join(projectDir, d))))
  }
}

if (typeof module !== 'undefined' && module && !module.parent)
  instantiate({
    construct: Clean,
    async: 'run',
  })
