/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import Logger from './Logger'
import FastTraverser from './FastTraverser'

import yaml from 'js-yaml'
import path from 'path'
import fs from 'fs-extra'

const m = 'PartitionLogger'

export default class UserDataLogger extends Logger {
  static dataPath = '/data'

  constructor(adb) {
    super(adb, '')
  }

  async next() {
    await (this.initPromise || (this.initPromise = this.init())) // one at a time
    if (false) { // TODO remove
      const {fileSystem} = this
      if (fileSystem) {
        const fsEntry = await fileSystem.next()
        if (!fsEntry.done) return {value: () => this.process(fsEntry.value)}
        this.fileSystem = null
        return fsEntry
      }
    }
    return UserDataLogger.done
  }

  async init() {
    const {adb} = this
    if (!await this.hasSu()) return
    await this.getRoot()
    this.fileSystem = new FastTraverser({fsPath: UserDataLogger.dataPath, root: true, adb})
    await this.fileSystem.traverse()
  }

  async process(entry) {
    console.log(`\nUserDataLogger ${this.deviceName}`, entry.absolute, '\n')
  }
}
