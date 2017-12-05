/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import fs from 'fs-extra'

import path from 'path'

export default class EntryCreator {
  async run(o) {
    const m = 'EntryCreator'
    if (!await fs.pathExists(o.resumeDirectory)) throw new Error(`${m} resume directory does not exist: ${o.resumeDirectory}`)
    console.log('directory:', o.directory)
    await fs.ensureDir(o.directory)
    if (o.cover) this.copyFile(o.cover, o.directory)
    if (o.resume) this.copyFile(o.resume, o.directory)
    if (o.text) {
      for (let t of (Array.isArray(o.text) ? o.text : [o.text])) {
        const dest = path.join(o.directory, t)
        console.log(dest)
        fs.ensureFile(dest)
      }
    }
  }

  async copyFile(abs, directory) {
    const dest = path.join(directory, path.basename(abs))
    console.log(dest)
    return fs.copy(abs, dest, {overwrite: false, preserveTimestamps: true})
  }
}
