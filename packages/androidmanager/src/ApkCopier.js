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
    this.apkCopierResult = o.apkCopierResult
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

    const cmd = `dumpsys package ${apk.packageName} | grep -e '^ *versionName=' | head -1`
    const socket = await this.client.shell(this.serialNumber, cmd)
    const version = await new Promise((resolve, reject) => {
      let version = ''
      socket
        .on('data', s => version += s)
        .once('end', () => {
          const i = version.indexOf('=')
          if (!~i) reject(new Error(`Android command failed: ${cmd}`))
          else resolve(version.substring(i + 1).replace(/[^\x20-\x7E]+/g, ''))
        })
        .on('error', reject)
        .setEncoding('utf8')
    })

    const outfile = `${apk.packageName}${version ? '-' + version : ''}-${digest}.apk`
    const absPath = path.join(this.directory, outfile)

    const exists = await fs.pathExists(absPath)

    if (!exists) console.log(`\nwriting: ${absPath}`)

    if (!exists) await fs.move(tempfile, absPath)
    else await fs.remove(tempfile)

    const result = this.apkCopierResult

    if (isNaN(result.packageCount)) result.packageCount = 1
    else result.packageCount++

    if (isNaN(result.newCount)) result.newCount = 0
    if (!exists) result.newCount++

    if (!Array.isArray(result.packages)) result.packages = []
    result.packages.push({
      packageName: apk.packageName,
      version,
      sha256: digest,
    })
  }
}
