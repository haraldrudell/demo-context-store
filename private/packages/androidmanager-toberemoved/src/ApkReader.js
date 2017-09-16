/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import LineReader from './LineReader'

export default class ApkReader {
  static adbCommand = 'pm list packages -f'
  static packageLineRegExp = /^package:(.+)=(.+)$/ // split at last instance of '='
  static apkfileIndex = 1
  static packageNameIndex = 2

  constructor(adb) {
    this.adb = adb
  }

  async next() {
    if (!this.isDoneObject) {
      const lineReader = this.lineReader || await this._createLineReader()
      if (!this.isDoneObject) {
        const packageTextLine = await lineReader.getLine()
        if (packageTextLine !== false) {
          const match = ApkReader.packageLineRegExp.exec(packageTextLine)
          if (!match) throw new Error(`ApkReader.next bad text line from '${ApkReader.adbCommand}': '${packageTextLine}'`)
          const apkfile = match[ApkReader.apkfileIndex]
          const packageName = match[ApkReader.packageNameIndex]
          return {value: {apkfile, packageName}}
        }
      }
    }
    return this.isDoneObject || (this.isDoneObject = {done: true})
  }

  _createLineReader = async () => await (this._initPromise || (this._initPromise = this._issueAdbCommand()))

  _issueAdbCommand = async () => new LineReader(await this.adb.shellSocket(ApkReader.adbCommand))
}
