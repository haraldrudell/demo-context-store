/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
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
    const md5cmd = this.md5sumCmd || await (this.md5sumPromise || (this.md5sumPromise = this.findMd5sum()))
    const cmd = `${md5cmd} ${remoteFile}`
    const s = await this.shell(cmd)
    const md5 = s.substring(0, s.indexOf(' '))
    if (md5.length !== 32 || md5.replace(/[0-9a-f]/g, '').length) throw new Error(`AdbShim.md5sumFar failed: ${this.name} command: '${cmd}' output: '${s}' parsed md5: '${md5}'`)
    return md5
  }

  static md5empty = 'd41d8cd98f00b204e9800998ecf8427e'
  static md5cmds = ['md5sum', '/data/hq/bin/md5sum']
  async findMd5sum() {
    let success
    let cmd
    let message
    for (let aCmd of AdbShim.md5cmds) {
      const shellCmd = `${aCmd}  </dev/null`
      const md5 = await this.shell(shellCmd) // is md5sum or error message
      if ((success = md5.startsWith(AdbShim.md5empty))) {
        cmd = aCmd
        break
      }
      if (!cmd) {
        cmd = aCmd
        message = md5
      }
    }
    if (!success) throw new Error(`AdbShim.findMd5sum ${this.name} failed: ${cmd} output: ${message}`)
    return (this.md5sumCmd = cmd)
  }

  async pull(from, to) {
    const results = await Promise.all([
      this.md5sumFar(from),
      this._pull(from, to)
    ])
    const md5far = results[0]
    const md5near = await this.hash(to, 'md5')
    if (md5far !== md5near)
      throw new Error(`AdbShim.pull md5 mismatch:\n${md5far} android: ${from}\n${md5near} ${to}`)
  }

  async _pull(from, to) {
    const eh = this.getErrorHandler(`AdbShim.pull failed: ${this.name} ${from}`)
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
      .catch(e => {console.error(`AdbShim.getPackageVersion ${this.name} package: '${packageName}'`); throw e})

    const version = output.split('\n').reduce((accumulate, line) => {
      if (!accumulate) {
        const i = line.indexOf('=')
        return line.substring(i + 1).trim().replace(/[^\x20-\x7E]+/g, '')
      } else return accumulate
    }, '')
    if (!version) throw new Error(`AdbShim.getPackageVersion bad response ${this.name} package ${packageName}: '${output}'`)

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
