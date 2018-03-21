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
    const {name, company, resume, cover, text, directory} = (options = setMDebug(options, this, 'EntryCreator'))
    this.m = String(name || 'EntryCreator')
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


/* junk below here

const defaultOptions = {
  resumeDirectory: '/opt/foxyboy/ownCloud/Resume',
  defaultResumeText: 'reddit',
}
const m = 'resume'

async function getOptions() {
  const o = {...defaultOptions}
  const {argv} = process
  for (let index = 2, indexMax = argv.length, param; index < indexMax; index++) switch (param = argv[index]) {
    case '-company':
      if (index + 1 === indexMax) throw new Error(`${m} -company: missing company name`)
      o.company = argv[++index]
      break
    case '-resume':
      if (index + 1 === indexMax) throw new Error(`${m} -resume: missing resume filename`)
      o.resume = argv[++index]
      break
    case '-cover':
      if (index + 1 === indexMax) throw new Error(`${m} -cover: missing cover filename`)
      o.cover = argv[++index]
      break
    case '-text':
      if (index + 1 === indexMax) throw new Error(`${m} -text: missing text option`)
      const text = argv[++index]
      if (!text) throw new Error(`${m} -text: string cannot be empty`)
      const current = o.text
      if (!current) o.text = text
      else if (!Array.isArray(current)) o.text = [current, text]
      else current.push(text)
      break
    case '-h':
    case '-help':
    case '--help':
      console.error('resume [-company c] [-resume file] [-cover file] [-text text] [-h -help --help]')
      process.exit(0)
      break
    default: throw new Error(`${m}: unknown options: ${param}`)
  }
  o.directory = getDirectoryName(o)
  return o
}

function getDirectoryName({resumeDirectory, company = 'generic'}) {
  const dateStrings = getDateStrings()
  return path.join(resumeDirectory, dateStrings.month6, `${dateStrings.day6} ${company}`)
}
*/
