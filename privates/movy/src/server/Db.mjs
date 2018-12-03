/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import fs from 'fs-extra'

import FakeDb from './FakeDb'

export default class Db extends FakeDb { // TODO 181202: Node.js v11.3: no class properties
  constructor(config) {
    super()
    const {dir, db, dirsBase, dirs} = Object(config)
    console.log({dir, db, dirsBase, dirs})
    Object.assign(this, {dir, db, dirsBase, dirs})
    this.setStatus('up since')
  }

  async init() {
    const {dir} = this
    await fs.ensureDir(dir)
  }
}
