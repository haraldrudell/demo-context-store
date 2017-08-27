/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import instantiate from './util/Process'
import paths from './paths'
import fs from 'fs-extra'

export default class Clean {
  async run() {
    await fs.remove(paths.appBuild)
  }
}

instantiate({
  construct: Clean,
  async: 'run',
  require: typeof require !== 'undefined' && require,
  module: typeof module !== 'undefined' && module,
})
