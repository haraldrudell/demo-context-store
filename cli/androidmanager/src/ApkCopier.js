/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import ApkReader from './ApkReader'

import uuidv4 from 'uuid/v4'
import path from 'path'
import fs from 'fs-extra'
import os from 'os'

export default class ApkCopier extends ApkReader {
  constructor(adb) {
    super(adb)
    this.apkCopierResult = {packageCount: 0, newCount: 0, packages: []}
  }

  async next() {
    const i = await super.next()
    const {value, done} = i
    if (done && !this.didSummary) {
      this.didSummary = true
      await this.writeSummary()
    }
    return value
      ? {value: () => this.copyApk(value), done}
      : i
  }

  async copyApk(apk) { // {apkfile, packageName}
    const {packageName, apkfile} = apk
    const {adb, apkCopierResult} = this
    const tempfile = path.join(os.tmpdir(), `${uuidv4()}.apk`)
    const results = await Promise.all([
      adb.pull(apkfile, tempfile),
      adb.getPackageVersion(packageName),
    ]).catch(e => {console.error(`ApkCopier.copyApk failed for package: '${packageName}' apk file: '${apkfile}'`); throw e})
    const version = results[1]
    const sha256 = await adb.hash(tempfile)
    const outfile = path.join(adb.directory, `${packageName}${version ? '-' + version : ''}-${sha256}.apk`)

    const exists = await fs.pathExists(outfile)
    if (!exists) {
      console.log(`\nwriting: ${outfile}`)
      await fs.move(tempfile, outfile)
    } else await fs.remove(tempfile)

    apkCopierResult.packageCount++
    if (!exists) apkCopierResult.newCount++
    apkCopierResult.packages.push({packageName, version, sha256})
  }

  async writeSummary() {
    const r = this.apkCopierResult
    console.log(`\n${this.adb.name}: packages: ${r.packageCount} new: ${r.newCount}`)
    if (r.newCount) await this.savePackageList()
  }

  async savePackageList() {
    const {adb, apkCopierResult} = this
    const {devicesDirectory, name, sixDay} = adb
    const outfile = path.join(devicesDirectory, name, `${sixDay}-${name}-applist.txt`)
    console.log(`writing ${outfile}`)
    const s = apkCopierResult.packages.map(o =>
      `${o.packageName} ${o.version} ${o.sha256}`
      ).sort().join('\n')
    return fs.outputFile(outfile, s)
  }
}
