/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import ByIndex from './ByIndex'

import path from 'path'

const m = 'DirectoryTraverser'

export default class DirectoryTraverser {
  constructor(absolute, t, output) {
    if (!String(absolute).startsWith('/')) throw new Error(`${m} absolute argument not beginning with slash: '${absolute}'`)
    const to = typeof output
    if (output && to !== 'function') throw new Error(`${mm} output not function: ${to}`)
    const tstat = typeof t.stat
    if (tstat !== 'function') throw new Error(`${mm} bad t argument: ${tstat}`)
    this.files = new ByIndex({output})
    Object.assign(this, {absolute, t, output})
  }

  async traverse() {
    /*
    order of output is files in order, then subdirectories in order
    ls and stat are slow
    so stat all in parallel
    */
    // submit stat for all entries
    const {absolute, t, files} = this
    const entries = await t.ls(absolute)
    await Promise.all(entries.map((e, ix) => this.doStat(path.join(absolute, e), ix)))

    // wait for all files to be output
    files.setAllSubmitted()
    await files.promise

    // process directories
    const dirs = files.getHeld()
    for (let {stat, directory, promise} of dirs) {
      output(stat)
      directory.flush(output)
      await promise
    }
  }

  async doStat(absolute, index) {
    const {t, files} = this
    const stat = await t.stat(absolute)
    const {isDirectory} = stat
    if (!isDirectory) files.submit(stat, index)
    else {
      const directory = new DirectoryTraverser(absolute, t)
      const promise = directory.traverse()
      files.submit({stat, directory, promise}, index, true)
    }
  }

  flush(output) {
    const {files} = this
    files.setOutput(output)
    files.flush()
  }
}
