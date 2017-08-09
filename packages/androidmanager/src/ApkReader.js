import LineReader from './LineReader'

export default class ApkReader {
  static packageLineRegExp = /^package:([^=]+)=(.+)$/

  constructor(adb) {
    this.adb = adb
  }

  async next() {
    let result = this.done
    if (result) return result

    const lineReader = this.lineReader ||
      await (this._initPromise || (this._initPromise = this._init()))
    const value = await lineReader.getLine()
    if (value !== false) {
      const match = ApkReader.packageLineRegExp.exec(value)
      if (!match) throw new Error(`bad package line from adb: ${value}`)
      return {value: {apkfile: match[1], packageName: match[2]}}
    } else return this.done = {done: true}
  }

  _init = async () => new LineReader(await this.adb.shellSocket('pm list packages -f'))
}
