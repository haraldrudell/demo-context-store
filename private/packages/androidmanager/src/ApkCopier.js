import ApkReader from './ApkReader'

import uuidv4 from 'uuid/v4'
import path from 'path'
import fs from 'fs-extra'
import crypto from 'crypto'
import os from 'os'

export default class ApkCopier extends ApkReader {
  constructor(o) {
    super(o)
    this.directory = o.directory
  }

  async next() {
    const i = await super.next()
    const {value, done} = i
    return value
      ? {value: () => this.copyApk(value), done}
      : i
  }

  async copyApk(apk) { // {apkfile, packageName}
    const tempfile = path.join(os.tmpdir(), `${uuidv4()}.apk`)

    const pullTransfer = await this.client.pull(this.serialNumber, apk.apkfile)
    await new Promise((resolve, reject) =>
      pullTransfer
        .on('error', reject)
        .pipe(fs.createWriteStream(tempfile))
        .on('error', reject)
        .once('finish', resolve)
    )

    const digest = await new Promise((resolve, reject) => {
      const hash = crypto.createHash('sha256')
      fs.createReadStream(tempfile)
        .on('data', d => hash.update(d))
        .on('error', reject)
        .once('end', () => resolve(hash.digest('hex')))
    })

    const socket = await this.client.shell(this.serialNumber, `dumpsys package ${apk.packageName} | sed -n '${'s/^ *versionName=\\(.*\\)$/\\1/p'}'`)
    const version = await new Promise((resolve, reject) => {
      let version = ''
      socket
        .on('data', s => version += s)
        .once('end', () => resolve(version))
        .on('error', reject)
        .setEncoding('utf8')
    })

    const outfile = `${apk.packageName}${version ? '-' + version : ''}-${digest}.apk`
    const absPath = path.join(this.directory, outfile)

    const v = await fs.pathExists(absPath).then(v => true, e => false)
    if (!v) console.log(`\nwriting: ${absPath}\n`)
    if (!v) await fs.move(tempfile, absPath)
    else await fs.remove(tempfile)
  }
}
