/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import SshProcess from './SshProcess'

import {setMDebug, getArrayOfString, getPortNumber} from 'es2049lib'
import Network from 'network-portable'

import util from 'util'
import net from 'net'
const {Server} = net

export default class SshRecycler {
  constructor(o) {
    const {args, port, checkPort, debug} = setMDebug(o, this, 'SshRecycler')
    const s = {}
    if (getArrayOfString({args, s})) throw new Error(`${this.m} args ${s.text}`)
    if (getPortNumber({port, s})) throw new Error(`${this.m} port: ${s.text}`)
    if (getPortNumber({checkPort, s})) throw new Error(`${this.m} port: ${s.text}`)
    this.promise = new Promise((resolve, reject) => (this._resolve = resolve) && (this._reject = reject))
    Object.assign(this, s.properties)
    this.network = new Network({debug})
    debug && this.constructor === SshRecycler && console.log(`${this.m} constructor: ${util.inspect(this, {colors: true, depth: null})}`)
  }

  async connect({host}) {
    while (this.sshProcess) await this.disconnect()
    const {checkPort, debug} = this
    const args = this._patchSsh(host)
    const sshProcess = new SshProcess({args, checkPort, debug})
    const {promise, isError} = sshProcess.launchSsh()
    promise.catch(e => this._reject(e))
    console.log('SSHREC', isError)
    isError && await promise // this will reject
    this.sshProcess = sshProcess
  }

  async arePortsAvailable() {
    if (!await this.isCheckPortAvailable()) return false
    const {port, debug} = this

    const [e, inListen] = await new Promise((resolve, reject) => {
      const server = new Server()
        .on('error', er => resolve([er, false]))
        .listen(port, er => !er
          ? server.close(() => resolve([]))
          : resolve([er, true]))
    })
    const isBadError = (e && !inListen) || this.errorOtherThanPortAccess(e)

    debug && console.log(`${this.m} isCheckPortAvailable result: ${!isBadError} data port: ${port}${isBadError ? ` ${e}` : ''}`)
    if (isBadError) throw e
    return true
  }

  async isCheckPortAvailable() {
    const {checkPort, network, debug} = this
    const {host} = SshProcess
    const {isOpen, err, isConnectionRefused} = await network.tcpOpen({host, port: checkPort})
    debug && console.log(`${this.m} isCheckPortAvailable result: ${!isOpen} ${host}:${checkPort}${err && !isConnectionRefused ? ` err: ${err}` : ''}`)
    if (err && !isConnectionRefused) throw err
    return !isOpen
  }

  waitOnCheckPort() {
    const {checkPort} = this
    return this.waitOnSocket(checkPort)
  }

  waitOnDataPort() {
    const {port} = this
    return this.waitOnSocket(port)
  }

  async waitOnSocket(port) {
    const {sshProcess} = this
    if (!sshProcess) throw new Error(`${this.m} waitForPort: connect not invoked`)
    return sshProcess.waitOnSocket(port)
  }

  getHostPort() {
    const {host} = SshProcess
    const {port} = this
    return {host, port}
  }

  async disconnect() {
    const {sshProcess} = this
    if (sshProcess) {
      this.sshProcess = null
      return sshProcess.disconnect()
    }
  }

  _patchSsh(ip) {
    return this.args.map(str => str.replace(/DOMAIN/g, ip))
  }

  async shutdown() {
    await this.disconnect()
    this._resolve()
  }

  errorOtherThanPortAccess = e => e instanceof Error && e.code !== 'EACCESS'
}
