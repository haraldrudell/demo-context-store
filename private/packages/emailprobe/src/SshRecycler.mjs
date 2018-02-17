/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import SshProcess from './SshProcess'

import {ensureListOfString, ensurePortNumber} from 'es2049lib'
import Network from 'network-portable'

export default class SshRecycler {
  onRejected = this.onRejected.bind(this)

  constructor(o) {
    this.m = 'SshRecycler'
    const {cmd, nearPort: nearPort0, debug} = o || false
    ensureListOfString(cmd, `${this.m} cmd`)
    const nearPort = ensurePortNumber(nearPort0, `${this.m} nearPort`)
    const promise = new Promise((resolve, reject) => (this._resolve = resolve) && (this._reject = reject))
    Object.assign(this, {cmd, debug, promise, nearPort})
    this.network = new Network({debug})
    debug && console.log(`${this.m} constructor:`, this)
  }

  async connect({host}) {
    while (this.sshProcess) await this.disconnect()
    const {debug, nearPort, onRejected} = this
    const cmd = this.patchSsh(host)
    this.sshProcess = new SshProcess({cmd, host, port: nearPort, debug, onRejected}).launchSsh()
  }

  async isPortOpen({host, port}) {
    const {network, debug} = this
    const msOrUndefined = await network.tcpOpen({host, port})
    const result = msOrUndefined != null
    debug && console.log(`${this.m} isPortOpen: ${host}:${port} result: ${result} response: ${msOrUndefined}`)
    return result
  }

  async waitOnSocket() {
    const {sshProcess} = this
    if (!sshProcess) throw new Error(`${this.m} waitForPort: connect not invoked`)
    sshProcess.waitOnSocket()
  }

  async disconnect() {
    const {sshProcess} = this
    if (sshProcess) {
      this.sshProcess = null
      await sshProcess.disconnect()
    }
  }

  patchSsh(ip) {
    return this.cmd.map(str => str.replace(/DOMAIN/g, ip))
  }

  async shutdown() {
    await this.disconnect()
    this._resolve()
  }

  onRejected(e) {
    this._reject(e)
  }
}
