/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import spawn from 'spawn-async'

import fs from 'fs-extra'
import path from 'path'

const m = 'Builder'

export default class Builder {
  async build(o = false) {
    const {zipFile, srcDir} = o
    if (await fs.pathExists(zipFile)) await fs.remove(zipFile)
    const zipDir = path.join(zipFile, '..')
    if (!await fs.pathExists(zipDir)) await fs.ensureDir(zipDir)
    return spawn({
      cmd: 'zip',
      args: ['-r', zipFile, '.',],
      options: {
        cwd: srcDir,
      }})
  }
}
