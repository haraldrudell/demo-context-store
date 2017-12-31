/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import spawn from 'spawn-async'

import net from 'net'

export default class SshTunnel {
  constructor(cmd) {
    if (!cmd || typeof cmd !== 'string') throw new Error(`SshTunnel: command not non-empty string`)
    this.cmd = cmd
  }

  setupSsh() {
    // like: 'ssh -NL 127.0.0.1:9002:1.2.3.4:25 -o ControlPath=none -o ExitOnForwardFailure=yes sshHost'
    const args = this.cmd.split(' ')
    this.debug && console.log(args.join(' '))
    const cmd = args.shift()
    const cpStore = this.cpStore = {}
    const sshPromise = spawn({cmd, args, cp: cpStore})
      .catch(e => {
        if (cpStore.didKill && e.signal === 'SIGTERM') return
        throw e
      })
    this.cp = cpStore.cp
    return sshPromise
  }

  async ready({host, port, timeout, retryTime}) {
    // if TCP connect to host:port succeeds, the tunnel is up
    // ie. a listening TCP socket that exists at the other end of the tunnel
    const end = Date.now() + timeout
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
    const {cpStore} = this
    if (!cpStore.didKill) {
      cpStore.didKill = true
      const {cp} = cpStore
      return cp.kill()
    }
  }
}
