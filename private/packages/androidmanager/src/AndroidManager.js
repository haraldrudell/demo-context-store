import AsyncModerator from './AsyncModerator'
import ApkCopier from './ApkCopier'

import fs from 'fs-extra'
import adb from 'adbkit'
import path from 'path'

export default class AndroidManager {
  async run(o) {
    const directory = this.directory = '/x/tostorage/devices/generic/apk'
    await fs.pathExists(directory)

    this.devicesDirectory = '/x/tostorage/devices'

    this.serialNumber = o.serial
    this.client = adb.createClient()

    const asyncModerator = new AsyncModerator(20)
    asyncModerator.promise.then(this.done).catch(this.errorHandler)
    this.apkCopierResult = {}
    asyncModerator.addAsyncIterator(new ApkCopier(this))
    asyncModerator.setAllSubmitted()
  }

  done = v => {
    const r = this.apkCopierResult || false
    let s = []
    if (!isNaN(r.packageCount)) s.push(`package count: ${r.packageCount}`)
    if (!isNaN(r.newCount)) s.push(`new packages: ${r.newCount}`)
    console.log(`AndroidManager.done${s.length ? ': ' + s.join(' '): ''}`)
    if (this.apkCopierResult.newCount) this.savePackageList().catch(this.errorHandler)
  }

  async savePackageList() {
    const deviceName = await this.getDeviceName()
    if (!deviceName) throw new Error(`No device name for serial ${this.serialNumber}`)
    const outfile = path.join(this.devicesDirectory, deviceName, `${this.getSixDay()}-${deviceName}-applist.txt`)
    console.log(`writing ${this.apkCopierResult.packageCount} to ${outfile}`)
    const s = this.apkCopierResult.packages.map(o =>
      `${o.packageName} ${o.version} ${o.sha256}`
      ).sort().join('\n')
    return fs.outputFile(outfile, s)
  }

  getSixDay() {
    const msDiff = -new Date().getTimezoneOffset() * 60000
    const date = new Date(Date.now() + msDiff).toISOString()
    return `${date.substring(2, 4)}${date.substring(5, 7)}${date.substring(8, 10)}`
  }

  async getDeviceName() {
    const cmd = `ls /sdcard/Safe/hostname.* | grep hostname | head -1`
    const socket = await this.client.shell(this.serialNumber, cmd)
    return new Promise((resolve, reject) => {
      let name = ''
      socket
        .on('data', s => name += s)
        .once('end', () => {
          const i = name.indexOf('hostname.')
          if (!~i) reject(new Error(`Android command failed: ${cmd}`))
          else resolve(name.substring(i + 9).replace(/[^\x20-\x7E]+/g, ''))
        })
        .on('error', reject)
        .setEncoding('utf8')
    })
  }

  errorHandler = e => {
    console.error('\nAndroidManager.errorHandler')
    process.nextTick(() => {throw e})
  }

}
