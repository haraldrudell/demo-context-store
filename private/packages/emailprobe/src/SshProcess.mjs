/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import {SpawnAsync} from 'allspawn'
import {getTimeval, getPortNumber} from 'es2049lib'
import Network from 'network-portable'

export default class SshProcess extends SpawnAsync {
  static timeout0 = 3e3 // 3 s
  static retryTime0 = 1e2 // 100 ms
  static host = '127.0.0.1'

  constructor(o) {
    super({...o, timeout: undefined})
    const {checkPort, timeout: sshTimeout, retryTime} = Object(o)
    const {timeout0, retryTime0} = SshProcess
    const s = {}
    if (getTimeval({sshTimeout, s}, timeout0)) throw new Error(`${this.m} timeout ${s.text}`)
    if (getTimeval({retryTime, s}, retryTime0)) throw new Error(`${this.m} retryTime ${s.text}`)
    if (getPortNumber({checkPort, s})) throw new Error(`${this.m} port: ${s.text}`)
    Object.assign(this, s.properties)
    this.network = new Network()
  }

  launchSsh() {
    const {debug, args} = this
    // like: 'ssh -NL 127.0.0.1:9002:1.2.3.4:25 -o ControlPath=none -o ExitOnForwardFailure=yes sshHost'
    debug && console.log(`${this.m} spawn: ${args.join(' ')}`)
    const promise = this.startSpawn().catch(this.ignoreTerminated.bind(this))
    const isError = !this.cp // if cp was not set, thr promise has already rejected
    return {promise, isError}
  }

  ignoreTerminated(e) {
    const {didDisconnect} = this
    if (didDisconnect && e.signal === 'SIGTERM') return
    throw e
  }

  async waitOnSocket(port) {
    // if TCP connect to host:port succeeds, the tunnel is up
    // ie. a listening TCP socket that exists at the other end of the tunnel
    const t0 = Date.now()
    const {debug, sshTimeout, retryTime} = this
    debug && console.log(`${this.m} waitOnSocket: port: :${port} timeout: ${sshTimeout / 1e3} retry: ${retryTime / 1e3} s`)
    let laps = 0
    for (;;) {
      if (await this.isPortOpen()) break
      const elapsed = Date.now() - t0
      if (elapsed >= sshTimeout) throw new Error(`${this.m} ready timeout: ${elapsed.toFixed(1)}`)
      await new Promise((resolve, reject) => setTimeout(resolve, retryTime))
      const t = String(++laps)
      process.stdout.write(`${t}${'\b'.repeat(t.length)}`)
    }
    debug && console.log(`${this.m} socket open after ${((Date.now() - t0) / 1e3).toFixed(3)} s`)
  }

  async isPortOpen() {
    const {checkPort: port, sshTimeout: timeout, network} = this
    const {host} = SshProcess
    const {isOpen, err, isConnectionRefused} = await network.tcpOpen({host, port, timeout})
    if (err && !isConnectionRefused) throw err
    return !!isOpen
  }

  async disconnect() {
    this.didDisconnect = true
    return this.abortProcess()
  }
}
