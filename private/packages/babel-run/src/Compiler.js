/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import {transformFile} from 'babel-core'

import fs from 'fs-extra'

import {spawn} from 'child_process'
import path from 'path'

export default class Compiler {
  static defaultExtension = '.js'

  async run({sourceDir, destDir, command, args}) {
    const m = 'babel-run'
    if (!await fs.exists(sourceDir)) throw new Error(`${m}: directory does not exist: '${sourceDir}'`)
    const files = this.verifyCommandExists(sourceDir, command)
    if (files) throw new Error(`${m}: no command ${files.join(' ')} exist in directory '${sourceDir}'`)
    await this.ensureDirCompiled(sourceDir, destDir, Compiler.defaultExtension)
    this.execCommand(path.resolve(sourceDir, command), args)
  }

  async execCommand(file, args) {
    const {status, signal} = await new Promise((resolve, reject) => spawn('node', [file].concat(args))
      .once('close', (st, si) => resolve({status: st, signal: si}))
      .on('error', reject)
    )
    if (signal) throw new Error(`signal: ${signal} status: ${status} from ${file}`)
    process.exit(status)
  }

  async ensureDirCompiled(sourceDir, destDir, ext) {
    await fs.ensureDir(destDir)
    const promises = []
    for (let file of await this.getSourceFiles(sourceDir, ext))
      promises.push(this.ensureCompiled(path.join(sourceDir, file), path.join(destDir, file)))
    return Promise.all(promises)
  }

  async ensureCompiled(src, dest) {
    let doIt = true // TODO check exists, modify time
    if (doIt) return this.compile(src, dest)
  }

  async compile(src, dest) {
    const data = await new Promise((resolve, reject) => transformFile(src, {}, (e, d) => !e ? resolve(d) : reject(e)))
    return fs.writeFile(dest, data)
  }

  async getSourceFiles(sourceDir, ext) {
    const result = []
    for (let file of await fs.readdir(sourceDir)) if (file.endsWith(ext)) result.push(file)
    return result
  }

  async verifyCommandExists(dir, cmd) {
    const files = [cmd]
    let ok
    if (!path.extname(cmd).length) files.push(cmd + Compiler.defaultExtension)
    for (let file of files)
      if (await fs.exists(path.join(dir, file))) {
        ok = true
        break
      }
    return ok ? undefined : files
  }
}
