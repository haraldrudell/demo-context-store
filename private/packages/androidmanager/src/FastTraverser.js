/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import DirectoryTraverser from './DirectoryTraverser'
import ShellBatcher from './ShellBatcher'

import path from 'path'

const m = 'FastTraverser'

export default class FastTraverser {
  static markers = ['yes', 'non'] // same length
  /*
  Because su is slow, all su has to happen in parallel
  Therefore, this traverser rpocess everythign immediately
  invoking the output function for each stat value in the proper order
  1. files in a directory
  2. subdirectories in order
  */
  output = this.output.bind(this)
  stat = this.stat.bind(this)
  ls = this.ls.bind(this)
  maxAdbSockets = 10
  sockets = 0
  socketQueue = []

  constructor(o) {
    const {adb, fsPath, root} = o || false
    const tfsPath = typeof fsPath
    if (tfsPath !== 'string' || !fsPath.startsWith('/')) throw new Error(`${m} fsPath argument not nonempty string beginning with slash'${fsPath}'`)
    Object.assign(this, {adb, fsPath, root})
    this.batcher = new ShellBatcher(adb)
  }

  async traverse() {
    /*
    submit all entries in parallel
    invoke output first for files in order, then for directories in order
    */
    const {fsPath} = this
    const parent = path.join(fsPath, '..')
    const name = path.basename(fsPath)
    const stat = await this.stat({absolute: fsPath, parent, name})
    this.output(stat)
    return stat.isDirectory &&
      new DirectoryTraverser(fsPath, this, this.output).traverse()
  }

  output(stat) {
    console.log('FastTraverser.output', stat.absolute)
  }

  async stat({absolute, parent, name}) {
    // batcher wraps in root, so no root here
    const {batcher, adb, root} = this
    const cmds = adb.getStatCmds(absolute)
    const ms = cmds.map(cmd => `${m}: stat failed: '${cmd}'`)
    const texts = await batcher.submit(cmds)
    const stat = adb.getStatResult(texts, ms)
    return {absolute, name, parent, ...stat,
      isDirectory: stat.perms.startsWith('d'),
    }
  }

  async ls(path) {
    // batcher wraps in root, so no root here
    const {adb, batcher} = this
    const {markers} = FastTraverser
    const cmd = `ls -1 "${path}" && echo -n ${markers[0]} || echo -n ${markers[1]}`
    const markedText = await batcher.submit(cmd)

    // remove marker
    const hasGoodMarker = markedText.endsWith(markers[0])
    const hasBadMarker = markedText.endsWith(markers[1])
    if (hasBadMarker || !hasGoodMarker) {
      console.error(`FastTraverser.ls '${path}'`, markedText.length, JSON.stringify(markedText))
      throw new Error(`${m} ls failed for '${path}'`)
    }
    const text = hasGoodMarker || hasBadMarker
      ? markedText.slice(0, -markers[0].length - 1) // also delete newline preceeding marker
        : markedText

    return adb.getLines(text)
  }
}
