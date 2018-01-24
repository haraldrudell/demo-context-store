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
    const ct = typeof cmd
    if (!cmd || ct !== 'string') throw new Error(`SshTunnel: command not non-empty string: ${ct} '${cmd}'`)
    Object.assign(this, {cmd, debug, m: 'SshTunnel'})
  }

  setupSsh() {
    const {cmd: cmd0, debug} = this
    // like: 'ssh -NL 127.0.0.1:9002:1.2.3.4:25 -o ControlPath=none -o ExitOnForwardFailure=yes sshHost'
    debug && console.log(`${this.m} spawn: ${cmd0}`)
    const args = cmd0.split('\x20')
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
    if (!(timeout > 0)) throw new Error(`${this.m} timeout not positive number: ${timeout}`)
    if (!(retryTime > 0)) throw new Error(`${this.m} retryTime not positive number: ${retryTime}`)
    // if TCP connect to host:port succeeds, the tunnel is up
    // ie. a listening TCP socket that exists at the other end of the tunnel
    const end = Date.now() + timeout
    const {debug} = this
    debug && console.log(`${this.m} ready: ${host}:${port} ${timeout / 1e3}, ${retryTime / 1e3} s`)
    for (;;) {
      let s
      const result = await new Promise((resolve, reject) => s = new net.Socket()
        .on('error', resolve)
        .on('connect', resolve)
        .connect(port, host)
      )
      if (!(result instanceof Error)) {
        s.end()
        break
      }
      if (Date.now() >= end) throw result
      await new Promise((resolve, reject) => setTimeout(resolve, retryTime))
    }
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
