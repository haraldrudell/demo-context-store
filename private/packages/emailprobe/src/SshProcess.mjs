/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import {spawnAsync} from 'allspawn'
import {checkTimeval} from 'es2049lib'
import Network from 'network-portable'

export default class SshProcess {
  static timeout = 3e3 // 3 s
  static retryTime = 1e2 // 100 ms
  ignoreTerminated = this.ignoreTerminated.bind(this)

  constructor(o) {
    this.m = 'SshProcess'
    !o && (o = false)
    const {cmd, debug, port, onRejected} = o
    this.timeout = checkTimeval(o.timeout, 'SshProcess timeout', SshProcess.timeout)
    this.retryTime = checkTimeval(o.retryTime, 'SshProcess retryTime', SshProcess.retryTime)
    const to = typeof onRejected
    if (to !== 'function') throw new Error(`${this.m} onRejected not function: ${to}`)
    const host = '127.0.0.1'
    Object.assign(this, {cmd, debug, host, port, onRejected})
    this.network = new Network()
  }

  launchSsh() {
    const {cmd: args, debug, onRejected} = this
    // like: 'ssh -NL 127.0.0.1:9002:1.2.3.4:25 -o ControlPath=none -o ExitOnForwardFailure=yes sshHost'
    debug && console.log(`${this.m} spawn: ${args.join(' ')}`)
    const cpReceiver = {}
    this.promise = this.sshPromise = spawnAsync({args, cpReceiver})
      .catch(this.ignoreTerminated).catch(onRejected)
    this.cp = cpReceiver.cp
    return this
  }

  ignoreTerminated(e) {
    const {didKill} = this
    if (didKill && e.signal === 'SIGTERM') return
    throw e
  }

  async waitOnSocket() {
    // if TCP connect to host:port succeeds, the tunnel is up
    // ie. a listening TCP socket that exists at the other end of the tunnel
    const t0 = Date.now()
    const {debug, timeout, retryTime} = this
    debug && console.log(`${this.m} ready begin: port: :${this.port} timeout: ${this.timeout / 1e3} retry: ${retryTime / 1e3} s`)
    let laps = 0
    for (;;) {
      if (await this.isPortOpen()) break
      const elapsed = Date.now() - t0
      if (elapsed >= timeout) throw new Error(`${this.m} ready timeout: ${elapsed.toFixed(1)}`)
      await new Promise((resolve, reject) => setTimeout(resolve, retryTime))
      const t = String(++laps)
      process.stdout.write(`${t}${'\b'.repeat(t.length)}`)
    }
  }

  async isPortOpen() {
    const {host, port, timeout, network} = this
    return await network.tcpOpen({host, port, timeout}) != null
  }

  async disconnect() {
    const {cp, didKill, debug, sshPromise} = this
    if (!didKill) {
      this.didKill = true
      debug && console.log(`${this.m} cp.kill`)
      cp.kill()
    }
    return sshPromise
  }
}
