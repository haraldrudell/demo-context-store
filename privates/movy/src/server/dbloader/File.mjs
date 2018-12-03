/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import fs from 'fs-extra'
import path from 'path'

import * as parsers from './filenameParsing'
import { checksumFile } from '../util'
import SpawnAsync from './SpawnAsync'
const { spawnAsync } = SpawnAsync

export default class File {
  constructor(o) {
    const {file, dir, opts} = Object(o)
    Object.assign(this, {file, dir, opts})
    File.regExps = Object.values(parsers)
  }

  parse() {
    const {file} = this
    const {regExps} = File
    const extn = path.extname(file).length
    const base = !extn ? file : file.slice(0, -extn)
    let date
    for (let regExp of regExps) if ((date = regExp(base))) break
    if (!date) throw new Error(`File.parse: unsupported file name: ${this.getAbs()}`)
    //console.log(file, date.toISOString())
    this.date = date
    return this
  }

  getAbs() {
    return path.join(this.dir, this.file)
  }

  scanx(id) {
    const counters = File.counters || (File.counters = {})
    if (counters[id] == null) counters[id] = 1
    else counters[id]++
  }

  async scan() {
    this.scanx('scan')
    const {file, opts: {models: {Video, File}, baseDir, ssh, mutex}} = this
    const abs = this.getAbs()

    // make sure this is a normal file
    const stat = await fs.stat(abs)
    if (!stat.isFile()) throw new Error(`File.scan: not file: ${abs}`)

    // check for existing File record
    let fileRecord = {
      basename: file,
      dir: '',
      bytes: stat.size.toFixed(0),
      modified: stat.mtime,
      BaseDirId: baseDir.dataValues.id,
    }
    if (await this.hasFile(fileRecord, mutex, File)) return this.scanx('has')

    // check for File record with same md5 and length
    this.scanx('pregetmd5')
    if (abs === '/x/tostorage/mobile_media-0/2011-04-27 08.31.52.jpg') debugger
    const md5 = await this.getMd5(ssh, abs).catch(e => {
      if (e === undefined) {
        e = new Error(`UNDEFINED ${ssh} ${abs}`)
      }
      this.scanx('errmd5')
      throw e
    })
    this.scanx('postgetmd5')
    fileRecord.md5 = md5
    const fr = await this.findMd5(md5, File, fileRecord.bytes, mutex)
    if (fr &&
      fr.basename === fileRecord.basename &&
      fr.dir === fileRecord.dir &&
      fr.BaseDirId === fileRecord.BaseDirId) fileRecord = fr
    else if (fr) fileRecord.VideoId = fr.VideoId
    this.scanx('postmd5')

    if (!fileRecord.id) { // need to create File
      if (!fileRecord.VideoId) { // need to create Video
        const videoRecord = {start: this.date}
        const vr = await this.createVideoRecord(videoRecord, Video, mutex)
        fileRecord.VideoId = vr.id
      }

      // create File record
      const fr = await this.createFileRecord(fileRecord, File, mutex)
      fileRecord = fr
    }
    this.scanx('bottom')
    console.log('FIND', fileRecord)

    console.log(`File.scan: ${this.getAbs()}`)
  }

  async hasFile(fileRecord, mutex, File) {
    await mutex.wait()
    const fm = await File.findOne({where: fileRecord}).catch(e => {
      mutex.done()
      throw e
    })
    mutex.done()
    return !!fm
  }

  async getMd5(ssh, abs) {
    if (ssh) {
      if (abs.indexOf('\x20') !== -1) abs = `'${abs}'`
      const {stdout} = await spawnAsync({
        args: ['ssh', ssh, 'md5sum', abs],
        echo: true,
        capture: true,
        options: {silent: true},
      })
      if (stdout.indexOf('\x20') != 32) throw new Error(`File ssh md5sum failed: '${stdout}'`)
      return stdout.substring(0, 32)
    } else return checksumFile('md5', abs)
  }

  async findMd5(md5, File, bytes, mutex) {
    await mutex.wait()
    const fms = await File.findAll({where: {md5}}).catch(e => {
      mutex.done()
      throw e
    })
    mutex.done()
    for (let fm of fms) if (fm.get('bytes') == bytes) return fm.get({plain: true})
  }

  async createVideoRecord(videoRecord, Video, mutex) {
    await mutex.wait()
    const [vm, created] = await Video.findOrCreate({where: videoRecord}).catch(e => {
      mutex.done()
      throw e
    })
    mutex.done()
    return vm.get({plain: true})
  }

  async createFileRecord(fileRecord, File, mutex) {
    await mutex.wait()
    const [fileRec, created] = await File.findOrCreate({where: fileRecord}).catch(e => {
      mutex.done()
      throw e
    })
    mutex.done()
    return fileRec.get({plain: true})
  }

  static descDate(a, b) { // descending date
    const aDate = a.date
    const bDate = b.date
    return aDate > bDate ? -1 : aDate === bDate ? 0 : 1
  }
}
