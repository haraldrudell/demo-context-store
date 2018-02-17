/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved
*/
import resolve from 'resolve'
import fs from 'fs-extra'

import path from 'path'
import util from 'util'

export default class AdbKitPatcher {
  constructor(o) {
    const {name, debug} = o || false
    Object.assign(this, {m: name, debug})
    this.resolve = util.promisify(resolve)
  }
  async patch(patches) {
    const cwd = process.cwd()
    for (let [packageName, file] of Object.entries(Object(patches))) {
      console.log(`${this.m} package: ${packageName}…`)
      const importValue = path.join(packageName, 'package.json')
      const fsPath = await this.resolve(importValue)
      const packagePath = path.join(fsPath, '..')
      console.log(`${this.m} file system location: ${path.relative(cwd, packagePath)}`)

      const fileThatMustExit = path.join(packagePath, file)
      if (!await fs.pathExists(fileThatMustExit)) {
        console.log(`${this.m} creating: ${fileThatMustExit}…`)
        await fs.ensureFile(fileThatMustExit)
      }
    }
    console.log(`${this.m} Completed successfully.`)
  }
}
