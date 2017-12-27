/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import path from 'path'

const m = 'FileSystemTraverser'

export default class FileSystemTraverser {
  static done = {done: true}
  nextPromise = Promise.resolve()

  constructor(o) {
    const {adb, fsPath, root} = o || false
    const tfsPath = typeof fsPath
    if (tfsPath !== 'string' || !fsPath.startsWith('/')) throw new Error(`${m} fsPath argument not nonempty string beginning with slash'${fsPath}'`)
    Object.assign(this, {adb, fsPath, root})
  }

  async next() { // {name: 'data', isDirectory: true, directory: '/', absolute: '/data', stat}
    /*
    In traversing a file system, entries must be processed in order
    On a next () invocation, use a promise chain to enforce first-in-first-out
    */
    const  {nextPromise} = this
    return this.nextPromise = nextPromise.then(() => this.nextProcessor())
  }

  async nextProcessor() {
    if (!this.isDone) {
      const value = await this.getEntry()
      if (value) return {value}
      this.isDone = true
    }
    return FileSystemTraverser.done
  }

  async getEntry() {
    const {adb, root, directory: d0} = this
    if (!d0) { // process initial fsPath
      const {fsPath} = this
      this.directory = path.join(fsPath, '..')
      this.entries = [path.basename(fsPath)]
      this.subdirectories = []
    }

    const {directory, entries} = this
    while (entries.length) { // scan next directory
      const name = entries.shift()
      const absolute = path.join(directory, name)
      const stat = await adb.stat(absolute, root)
      const isDirectory = stat.perms.startsWith('d')
      const result = {name, isDirectory, directory, absolute, stat}
      if (!isDirectory) return result
      this.subdirectories.push(result)
    }

    const {subdirectories} = this
    if (subdirectories.length) {
      const dir = subdirectories.shift()
      const {absolute} = dir
      this.directory = absolute
      this.entries = await adb.ls(absolute, root)
      return dir
    }
  }
}
