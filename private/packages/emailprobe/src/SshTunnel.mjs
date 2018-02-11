/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import {spawnAsync} from 'allspawn'

import net from 'net'

export default class SshTunnel {
  ignoreTerminated = this.ignoreTerminated.bind(this)

  constructor(o) {
    const {cmd, debug} = o || false
    Object.assign(this, {cmd, debug, m: 'SshTunnel'})
  }

  setupSsh() {
    const {cmd: args, debug} = this
    // like: 'ssh -NL 127.0.0.1:9002:1.2.3.4:25 -o ControlPath=none -o ExitOnForwardFailure=yes sshHost'
    debug && console.log(`${this.m} spawn: ${args.join(' ')}`)
    const cmd = args.shift()
    const cpReceiver = {}
    const sshPromise = this.sshPromise = spawnAsync(cmd, args, null, cpReceiver)
      .catch(this.ignoreTerminated)
    this.cp = cpReceiver.cp
    return sshPromise
  }

  ignoreTerminated(e) {
    const {didKill} = this
    if (didKill && e.signal === 'SIGTERM') return
    throw e
  }

  async ready({host, port, timeout, retryTime}) {
    timeout = this.checkTimeval(timeout, 'ready: timeout')
    retryTime = this.checkTimeval(retryTime, 'ready: retryTime')

    // if TCP connect to host:port succeeds, the tunnel is up
    // ie. a listening TCP socket that exists at the other end of the tunnel
    const t0 = Date.now()
    const {debug} = this
    debug && console.log(`${this.m} ready begin: ${host}:${port} timeout: ${timeout / 1e3} retry: ${retryTime / 1e3} s`)
    let laps = 0
    for (;;) {
      if (await this.isPortOpen({host, port, timeout})) break
      const elapsed = Date.now() - t0
      if (elapsed >= timeout) throw new Error(`${this.m} ready timeout: ${elapsed.toFixed(1)}`)
      await new Promise((resolve, reject) => setTimeout(resolve, retryTime))
      const t = String(++laps)
      process.stdout.write(`${t}${'\b'.repeat(t.length)}`)
    }
  }

  async isPortOpen({host, port, timeout}) {
    let timer
    const result = await new Promise((resolve, reject) => /*this.logEvents*/(/*'isPortOpen',*/ new net.Socket())
      .on('error', e => this.isConnectionRefused(e) ? resolve(false) : reject(e))
      .once('connect', function isPortOpenDisconnect() {
        this.end()
      })
      .once('finish', () => resolve(true))
      .connect(port, host) +
      (timer = setTimeout(() => reject(new Error(`SshTunnel isPortOpen timeout: ${host}:${port}`)), timeout))
    )
    clearTimeout(timer)

    if (result === true || result === false) return result

    console.error('tcpConnect awaited', {result})
    throw new Error(`${this.m} isPortOpen unexpected response`)
  }

  checkTimeval(timeval, msg) {
    const number = +timeval
    if (!(number > 0)) throw new Error(`${this.m} bad timeval: ${msg} ${typeof timeval}`)
    return number
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

  isConnectionRefused = e => e instanceof Error && e.code === 'ECONNREFUSED'
}
