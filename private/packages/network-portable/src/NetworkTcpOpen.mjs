/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import net from 'net'

export default class NetworkTcpOpen {
  static tcpOpenTimeout = 1e3 // 1 second

  constructor(o) {
    const {debug, name} = Object(o)
    this.m = String(name || 'network-portable')
    debug && (this.debug = true)
  }

  async tcpOpen({host, port, timeout: timeout0}) { //  {elapsedMs, isOpen, err, isConnectionRefused}
    const {tcpOpenTimeout} = NetworkTcpOpen
    // closed port throws ECONNREFUSED -> result.isConnectionRefused
    const timeout = timeout0 >= 0 ? +timeout0 : tcpOpenTimeout
    const t0 = Date.now()

    let timer, socket
    const outcome = await Promise.race([
      new Promise((resolve, reject) => timer = timeout && setTimeout(resolve, timeout)), // timeout resolve: undefined
      new Promise((resolve, reject) => socket = new net.Socket()
        .on('error', resolve) // socket error resolve: instanceof Error
        .once('connect', function isPortOpenDisconnect() {
          this.end()
        }).once('finish', () => resolve(true)) // socket is open resolve: true
        .connect(port, host)),
    ])
    timer && clearTimeout(timer)
    socket && socket.destroy()

    const result = {elapsedMs: Date.now() - t0}
    if (outcome === true) result.isOpen = true
    else if (outcome instanceof Error) result.isConnectionRefused = this._isConnectionRefused(result.err = outcome)
    return result
  }

  _isConnectionRefused(e) {
    return e instanceof Error && e.code === 'ECONNREFUSED'
  }
}
