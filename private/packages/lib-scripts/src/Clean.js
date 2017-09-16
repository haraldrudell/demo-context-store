/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import path from 'path'
import fs from 'fs-extra'

export default class Clean {
  async run() {
    await fs.remove(path.resolve('bin'))
    await fs.remove(path.resolve('build'))
  }
}
