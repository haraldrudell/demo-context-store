/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import fs from 'fs-extra'

import { getTime } from './util'

export default class Db { // TODO 181202: Node.js v11.3: no class properties
  constructor(config) {
    const {dir, db, dirsBase, dirs} = Object(config)
    const status = `up since ${getTime()}`
    Object.assign(this, {dir, db, dirsBase, dirs, status})
  }

  async init() {
    await fs.ensureDir(this.dir)
  }

  getStatus() {
    return this.status
  }
}
