/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import fs from 'fs-extra'

import File from './File'

export default class DirScanner {
  constructor(o) {
    const {dir, opts, print} = Object(o) // opts: {pacer, models, dir}
    Object.assign(this, {dir, opts, print})
  }

  async scan() {
    const {dir, opts, print} = this

    // create file structures and sort reverse time
    let c = 0
    const list = await Promise.all((await fs.readdir(dir))
      .filter(file => !file.startsWith('.'))
      .map(file => ++c && new File({file, dir, opts}).parse()))
    print && console.log(`${dir}: ${list.length} files`)
    return list
  }
}
