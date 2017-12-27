/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import ByIndex from './ByIndex'

import path from 'path'

const m = 'DirectoryTraverser'

export default class DirectoryTraverser {
  static ignoreDirs = ['/data/data/eu.chainfire.supersu/logs']

  constructor(absolute, t, output) {
    if (!String(absolute).startsWith('/')) throw new Error(`${m} absolute argument not beginning with slash: '${absolute}'`)
    const to = typeof output
    if (output && to !== 'function') throw new Error(`${mm} output not function: ${to}`)
    const tstat = typeof t.stat
    if (tstat !== 'function') throw new Error(`${mm} bad t argument: ${tstat}`)
    Object.assign(this, {absolute, t, output})
  }

  async traverse() {
    /*
    order of output is files in order, then subdirectories in order
    ls and stat are slow
    so stat all in parallel

    absolute has already been output
    a. all files must be output prior to the first subdirectory
    b. to find all files, all entries must be stat
    c. to capture all errors, await must include subdirectories
    d. therefore, await-internal logic must handle early otuput
    e. when count stats has been submitted, we can process directories
    */
    const {absolute, t, files, output} = this
    if (DirectoryTraverser.ignoreDirs.includes(absolute)) return
    const entries = await t.ls(absolute)
    const count = entries.length
    this.files = new ByIndex({output, count})
    console.log('DirectoryTraverser.lsCount', absolute, entries.length)
    await Promise.all(entries.map((name, index) => this.doStat({parent: absolute, name, index})))
    console.log('DirectoryTraverser.complete', absolute)
  }

  async doStat({parent, name, index}) {
    const {t, files} = this
    const absolute = path.join(parent, name)
    const stat = await t.stat({absolute, name, parent})
    const {isDirectory} = stat
    const directory = isDirectory && new DirectoryTraverser(absolute, t)
    const submitValue = isDirectory ? {stat, directory} : stat
    const allSubmitted = files.submit(submitValue, index, isDirectory)
    const p = []
    directory && p.push(directory.p = directory.traverse())
    allSubmitted && p.push(this.processDirectories())
    return Promise.all(p)
  }

  async processDirectories() {
    const {files, output} = this
    const dirs = files.getHeld()
    console.log('DirectoryTraverser.subDirCount', absolute, dirs.length)
    for (let {stat, directory} of dirs) {
      console.log('DirectoryTraverser.processSubdirectory', absolute, stat.absolute)
      output(stat)
      directory.flush(output)
      await directory.p
      console.log('DirectoryTraverser.endsubdir', absolute, stat.absolute)
    }
  }

  flush(output) {
    const {files} = this
    files.setOutput(this.output = output)
  }
}
