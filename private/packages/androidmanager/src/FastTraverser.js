/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import DirectoryTraverser from './DirectoryTraverser'

const m = 'FileSystemTraverser'

export default class FastTraverser {
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
  }

  async traverse() {
    /*
    submit all entries in parallel
    invoke output first for files in order, then for directories in order
    */
    const {fsPath} = this
    const stat = await this.stat(fsPath)
    this.output(stat)
    return stat.isDirectory &&
      new DirectoryTraverser(fsPath, this, this.output).traverse()
  }

  output(stat) {
    console.log('FastTraverser', stat)
  }

  async stat(path) {
    const {adb, root} = this
    await this.getSocket()
    const t = Date.now()
    const stat = await adb.stat(path, root)
    const e = (Date.now() - t).toFixed(1)
    console.log(`stat ${e} ${path}`)
    this.releaseSocket()
    stat.isDirectory = stat.perms.startsWith('d')
    return stat
  }

  async ls(path) {
    const {adb, root} = this
    await this.getSocket()
    const t = Date.now()
    const lines = adb.ls(path, root)
    const e = (Date.now() - t).toFixed(1)
    console.log(`ls ${e} ${path}`)
    this.releaseSocket()
    return lines
  }
  f = 0
  async getSocket() {
    console.log('getSocket')
    if (this.sockets >= this.maxAdbSockets) {
      if (!f) {
        this.f = true
        console.log('getSocket maxAdbSockets', this.sockets)
      }
      const {socketQueue} = this
      let _resolve
      const p = new Promise(resolve => _resolve = resolve)
      socketQueue.push(_resolve)
      await p
    }
    this.sockets++
    console.log('sockets:', this.sockets++)
  }

  async releaseSocket() {
    this.sockets--
    if (this.sockets == this.maxAdbSockets - 1) {
      const resolve = this.socketQueue.shift()
      if (resolve) resolve()
    }
  }
}
