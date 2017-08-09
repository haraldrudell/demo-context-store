import LineReader from './LineReader'

export default class ApkReader {
  static packageLineRegExp = /^package:([^=]+)=(.+)$/

  constructor(o) {
    this.client = o.client
    this.serialNumber = o.serialNumber
  }

  async next() {
    let result = this.done
    if (result) return result

    if (!this.lineReader)
      if (this._initPromise) await this._initPromise
      else await (this._initPromise = this._init())

    const value = await this.lineReader.getLine()
    if (value !== false) {
      const match = ApkReader.packageLineRegExp.exec(value)
      if (!match) throw new Error(`bad package line from adb: ${value}`)
      return {value: {apkfile: match[1], packageName: match[2]}}
    } else return this.done = {done: true}
  }

  async _init() {
    const socket = await this.client.shell(this.serialNumber, 'pm list packages -f')
    this.lineReader = new LineReader(socket)
  }
}
