/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import fs from 'fs-extra'

import path from 'path'

export default class PackageFinder {
  async run(o) {
    const {command, marker: m = 'PackageFinder'} = o
    this.m = m

    const hasDirectory = path.dirname(command) !== '.'
    const o = hasDirectory
      ? this.examinePathWithDirectory(command)
      : this.which(command, this.getPathList()) // this.paths: searched paths

    const {executable} = o
    if (!executable) {
      if (o.paths) throw new Error(`${m} command not found: ${command} searched PATH: ${o.paths.join(',')}`)
      else if (o.e) throw e
      else throw new Error(`${m} command not found: ${command} at path: ${o.absolute}`)
    }

    // TODO
    // apt-file search -l o.executable
    // what packages are installed?
    // apt-cache policy packages
  }

  async examinePathWithDirectory(aPath) { // {absolute, resolved, executable, e}
    const absolute = path.resolve(aPath)
    let result = {absolute}
    if (await fs.pathExists(absolute)) {
      const resolved = result.resolved = await fs.readlink(absolute)
      const stats = fs.stat(resolved)
      if (stats.isFile()) {
        const isError = await fs.access(aPath, fs.constants.X_OK).catch(er => er) // e.code = 'EACCESS'
        if (!isError) result.executable = resolved
        else if (isError.code !== 'EACCESS') throw isError
        else result.e = isError
      } else result.e = new Error(`${this.m} not file: '${resolved}'`)
    }
    return result
  }

  async which(command, paths) {
    for (let pathEntry of paths) {
      const o = this.examinePathWithDirectory(path.join(pathEntry, command))
      if (o.executable) return o
    }
    return {paths}
  }

  getPathList() {
    const {env: PATH} = process
    const pt = typeof PATH
    if (pt !== 'string' || !PATH) throw new Error(`${this.m}: PATH not set: ${pt}`)
    return PATH.split(':')
  }
}
