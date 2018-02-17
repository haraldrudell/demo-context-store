/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import AdbShim from './AdbShim'
import fs from 'fs'
import crypto from 'crypto'

export default class AndroidLib extends AdbShim {
  shellSocket = this.adbShell

  constructor(o) {
    super(Object.assign({name: 'AndroidLib'}, o))
  }

  async shell(cmd) {
    const socket = await this.adbShell(cmd)
    let output = ''
    await new Promise((resolve, reject) => socket
      .on('data', s => output += s) // line terminators are \n
      .once('end', resolve)
      .on('error', reject)
      .setEncoding('utf8')
    ).catch(e => {
      console.error(`${this.m}.shell ${this.name} streaming '${cmd}'`)
      throw e
    })

    // remove final /r/n or /n or /r
    if (output.endsWith('\n')) output = output.slice(0, -1)
    if (output.endsWith('\r')) output = output.slice(0, -1)
    return output
  }

  async shellOneLine(cmd) {
    const output = await this.shell(cmd)
    if (output.includes('\n')) throw new Error(`${this.m}.shellOneLine ${this.name} Expected one-line result: ${cmd} '${output}`)
    return output
  }

  async getDeviceName(rememberName) {
    const marker = 'hostname.'
    const pattern = `/sdcard/Safe/${marker}*`
    const errorMarker = 'ERROR'
    const cmd = `ls ${pattern} || echo ${errorMarker}`

    const timer = setTimeout(() => {
      throw new Error(`${this.m} device ${this.name} adb.shell ls slower than 1 s`)
    }, 1e3)
    const output = await this.shell(cmd)
      .catch(e => {
        console.error(`${this.m}.getDeviceName ${this.name}`)
        throw e
      })
    clearTimeout(timer)
    const i = output.indexOf(marker)
    if (output.endsWith(errorMarker) || output.includes('\n') || !~i)
      throw new Error(`${this.m}.getDeviceName device ${this.name} has not been named in ${pattern}`)

    const deviceName = output.substring(i + 9)
    if (!deviceName) throw new Error(`${this.m}.getDeviceName No device name for serial ${this.name}`)
    if (rememberName) this.name = this.deviceName = deviceName

    return deviceName
  }

  async pull(from, to) {
    const [md5far] = await Promise.all([
      this.md5sumFar(from),
      this.adbPull(from, to),
    ])
    const md5near = await this.hash(to, 'md5')
    if (md5far !== md5near) throw new Error(`${this.m}.pull md5 mismatch:\n${md5far} android: ${from}\n${md5near} ${to}`)
  }

  async getPackageVersion(packageName) {
    const output = await this.shell(`dumpsys package ${packageName} | grep -e '^ *versionName='`)
      .catch(e => {
        console.error(`${this.m}.getPackageVersion ${this.name} package: '${packageName}'`)
        throw e
      })

    const version = output.split('\n').reduce((accumulate, line) => {
      if (!accumulate) {
        const i = line.indexOf('=')
        return line.substring(i + 1).trim().replace(/[^\x20-\x7E]+/g, '')
      } else return accumulate
    }, '')
    if (!version) throw new Error(`${this.m}.getPackageVersion bad response ${this.name} package ${packageName}: '${output}'`)

    return version
  }

  async ls(aPath, root) {
    const cmd = this.getLsCmd(aPath, root)
    const text = await this.shell(cmd)
    return this.getLsResult(text, cmd)
  }

  async stat(aPath, root, falseIfMissing) {
    const cmds = this.getStatCmds(aPath, root)
    const ms = cmds.map(cmd => `${this.m}: stat failed: '${cmd}'`)
    const texts = await Promise.all(cmds.map(c => this.shell(c)))
    return this.getStatResult(texts, ms, falseIfMissing)
  }

  async md5sumFar(remoteFile, root) {
    const md5cmd = this.md5sumCmd || await (this.md5sumPromise || (this.md5sumPromise = this.findMd5sum()))
    const cmd = this.prependRoot(`${md5cmd} ${remoteFile}`, root)
    const s = await this.shell(cmd)
    const md5 = s.substring(0, s.indexOf(' '))
    if (md5.length !== 32 || md5.replace(/[0-9a-f]/g, '').length) throw new Error(`AdbShim.md5sumFar failed: ${this.name} command: '${cmd}' output: '${s}' parsed md5: '${md5}'`)
    return md5
  }

  async sha1sumFar(remoteFile, root) {
    const cmd = this.prependRoot(`sha1sum -b ${remoteFile}`, root)
    const s = await this.shell(cmd)
    const sha1 = s.substring(0, 40)
    if (sha1.length !== 40 || sha1.replace(/[0-9a-f]/g, '').length) throw new Error(`AdbShim.sha1sumFar failed: ${this.name} command: '${cmd}' output: '${s}' parsed sha1: '${sha1}'`)
    return sha1
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
}
