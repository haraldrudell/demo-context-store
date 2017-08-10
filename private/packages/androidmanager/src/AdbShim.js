import adb from 'adbkit'
import fs from 'fs'
import crypto from 'crypto'

export default class AdbShim {
  static sharedClient

  static getClient(shared) {
    let result = shared && AdbShim.sharedClient
    if (!result) {
      try {
        result = adb.createClient()
        if (shared) AdbShim.sharedClient = result
      } catch (e) {
        console.error('AdbShim.getClient')
        throw e
      }
    }
    return result
  }

  static async getSerials(client) {
    if (!client) client = AdbShim.getClient(true)
    const result = []
    const objectList = await client.listDevices().catch(e => {
      console.error('AdbShim.getSerials')
      throw e
    })
    for (let o of objectList) result.push(o.id)
    return result
  }

  constructor(o) {
    this.client = o.client || AdbShim.getClient(true)
    this.name = this.serial = o.serial
  }

  async shellOneLine(cmd) {
    const output = await this.shell(cmd)
    if (output.includes('\n')) throw new Error(`AdbShim.shellOneLine ${this.name} Expected one-line result: ${cmd} '${output}`)
    return output
  }

  async shell(cmd) {
    const socket = await this.shellSocket(cmd)
    return new Promise((resolve, reject) => {
      let output = ''
      socket
        .on('data', s => output += s) // line terminators are \n
        .once('end', () => { // remove final /r/n or /n or /r
          if (output.endsWith('\n')) output = output.slice(0, -1)
          if (output.endsWith('\r')) output = output.slice(0, -1)
          resolve(output)
        })
        .on('error', reject)
        .setEncoding('utf8')
    }).catch(e => {
      console.error(`AdbShim.shell ${this.name} streaming '${cmd}'`)
      throw e
    })
  }

  getErrorHandler = message => e => {
    console.error(message)
    throw e
  }

  shellSocket = async (cmd) =>
    this.client.shell(this.serial, cmd).catch(e => {
      console.error(`AdbShim.shellSocket ${this.name} '${cmd}'`)
      throw e
    })

  async md5sumFar(remoteFile) {
    const s = await this.shell(`md5sum ${remoteFile}`)
    const md5 = s.substring(0, s.indexOf(' '))
    if (md5.length !== 32 || md5.replace(/[0-9a-f]/g, '').length) throw new Error(`remote md5 failed for ${remoteFile} md5: ${md5}`)
    return md5
  }

  async pull(from, to) {
    const results = await Promise.all([
      this.md5sumFar(from),
      this._pull(from, to)
    ])
    const md5far = results[0]
    const md5near = await this.hash(to, 'md5')
    if (md5far !== md5near)
      throw new Error(`md5 mismatch:\n${md5far} android: ${from}\n${md5near} ${to}`)
  }

  async _pull(from, to) {
    const eh = this.getErrorHandler(`AdbShim.pull ${this.name} ${from}`)
    const pullTransfer = await this.client.pull(this.serial, from).catch(eh)
    return new Promise((resolve, reject) =>
      pullTransfer
        .on('error', reject)
        .pipe(fs.createWriteStream(to))
        .on('error', reject)
        .once('finish', resolve)
    ).catch(eh)
  }

  async hash(file, algorithm) {
    return new Promise((resolve, reject) => {
      const hash = crypto.createHash(algorithm || 'sha256')
      fs.createReadStream(file)
        .on('data', d => hash.update(d))
        .on('error', reject)
        .once('end', () => resolve(hash.digest('hex')))
    }).catch(e => {
      console.error(`AdbShim.hash ${file}`)
      throw e
    })
  }

  async getPackageVersion(packageName) {
    const output = await this.shell(`dumpsys package ${packageName} | grep -e '^ *versionName='`)
      .catch(e => {console.error(`AdbShim.getPackageVersion ${this.name}`); throw e})

    const version = output.split('\n').reduce((accumulate, line) => {
      if (!accumulate) {
        const i = line.indexOf('=')
        return line.substring(i + 1).trim().replace(/[^\x20-\x7E]+/g, '')
      } else return accumulate
    }, '')
    if (!version) throw new Error(`AdbShim.getPackageVersion bad response: '${output}'`)

    return version
  }

  async getDeviceName(save) {
    const marker = 'hostname.'
    const pattern = `/sdcard/Safe/${marker}*`
    const errorMarker = 'ERROR'
    const cmd = `ls ${pattern} || echo ${errorMarker}`

    const output = await this.shell(cmd)
      .catch(e => {console.error(`AdbShim.getDeviceName ${this.name}`); throw e})
    const i = output.indexOf(marker)
    if (output.endsWith(errorMarker) || output.includes('\n') || !~i)
      throw new Error(`AdbShim.getDeviceName device ${this.name} has not been named in ${pattern}`)

    const deviceName = output.substring(i + 9)
    if (!deviceName) throw new Error(`AdbShim.getDeviceName No device name for serial ${this.name}`)
    if (save) this.name = this.deviceName = deviceName

    return deviceName
  }
}
