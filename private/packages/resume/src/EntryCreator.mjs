/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import getDateStrings from './getDateStrings'

import {setMDebug, classLogger, getNonEmptyString} from 'es2049lib'

import fs from 'fs-extra'

import path from 'path'

export default class EntryCreator {
  constructor(options) {
    const {company, resume, cover, text, directory} = setMDebug(options, this, 'EntryCreator')
    let s = {}
    if (getNonEmptyString({company, s})) throw new Error(`${this.m} company: ${s.text}`)
    this.throwIfSep(company, 'company name')
    if (getNonEmptyString({directory, s})) throw new Error(`${this.m} directory: ${s.text}`)
    resume && (this.resume = String(resume))
    cover && (this.cover = String(cover))
    text && (this.text = this.throwIfSepTextOrArray(text, 'text option'))
    Object.assign(this, s.properties)
    classLogger(this, EntryCreator)
  }

  async run() {
    const {directory: resumeDirectory, company, cover, resume, text} = this
    if (!await fs.pathExists(resumeDirectory)) throw new Error(`${this.m} resume directory does not exist: '${resumeDirectory}'`)
    const dateStrings = getDateStrings()
    const directory = path.join(resumeDirectory, dateStrings.month6, `${dateStrings.day6} ${company}`)
    console.log('directory:', directory)
    await fs.ensureDir(directory)

    if (cover) this.copyFile(cover, directory)
    if (resume) this.copyFile(resume, directory)
    if (text) {
      for (let t of (Array.isArray(text) ? text : [text])) {
        const dest = path.join(directory, t)
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

  throwIfSepTextOrArray(t, label) {
    if (!Array.isArray(t)) return this.throwIfSep(t, label)
    const result = []
    for (let tt of t) result.push(this.throwIfSep(tt, label))
    return result
  }

  throwIfSep(t, label) {
    t = String(t)
    if (t.includes(path.sep)) throw new Error(`${this.m} ${label} cannot contain: ${path.sep}: '${t}'`)
    return t
  }
}
