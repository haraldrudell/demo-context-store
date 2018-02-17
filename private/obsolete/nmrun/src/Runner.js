/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import fs from 'fs-extra'

import {spawn} from 'child_process'
import path from 'path'

export default class Runner {
  async run({dir, command, args}) {
    const m = 'nmrun'
    let abs
    for (;;) {
      if (abs = await this.findCommand(dir, command)) break
      if (!(dir = this.getParentDirectory(dir))) break
    }
    if (!abs) throw new Error(`${m}: command not found in node_modules/.bin directories: '${command}'`)
    console.log(abs)
    return this.execCommand(abs, args)
  }

  async findCommand(dir, command) {
    const abs = path.resolve(dir, 'node_modules', '.bin', command)
    return await fs.pathExists(abs) ? abs : undefined
  }

  getParentDirectory(dir) {
    const nextDir = path.join(dir, '..')
    return nextDir !== dir ? nextDir : undefined
  }

  async execCommand(file, args) {
    const {status, signal} = await new Promise((resolve, reject) => spawn(file, args, {stdio: 'inherit'})
      .once('close', (st, si) => resolve({status: st, signal: si}))
      .on('error', reject)
    )
    if (signal) throw new Error(`signal: ${signal} status: ${status} from ${file}`)
    process.exit(status)
  }
}
