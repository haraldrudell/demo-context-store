/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import net from 'net'
import os from 'os'

export default class NetworkBase {
  static tcpOpenTimeout = 1e3

  constructor(o) {
    const {debug, name} = o || false
    this.m = String(name || 'network-portable')
    Object.assign(this, {debug})
  }

  async tcpOpen({host, port, timeout: timeout0}) {
    const timeout = Number(timeout0 >= 0 ? timeout0 : NetworkBase.tcpOpenTimeout)
    const t0 = Date.now()

    let timer, socket
    const outcome = await Promise.race([
      new Promise((resolve, reject) => timer = setTimeout(resolve, timeout)), // resolve: undefined
      new Promise((resolve, reject) => socket = new net.Socket()
        .on('error', resolve) // resolve: instanceof Error
        .once('connect', function isPortOpenDisconnect() {
          this.end()
        }).once('finish', () => resolve(true)) // resolve: true
        .connect(port, host)),
    ])
    clearTimeout(timer)
    socket.destroy()

    const result = {elapsedMs: Date.now() - t0}
    outcome instanceof Error && (result.err = outcome)
    outcome === true && (result.isOpen = true)
    return result
  }

  getNearIp(iface) {
    /* {
      lo: [
        {address: '127.0.0.1', netmask: '255.0.0.0', family: 'IPv4', mac: '00:00:00:00:00:00', internal: true, cidr: '127.0.0.1/8' },
        { address: '::1', netmask: 'ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff', family: 'IPv6', mac: '00:00:00:00:00:00', scopeid: 0, internal: true, cidr: '::1/128' }
      ],} */
    const ifs = os.networkInterfaces()
    if (ifs) {
      const ifAddrs = ifs[iface]
      if (ifAddrs) {
        let cidrs
        for (let address of ifAddrs) {
          if (address.family === 'IPv4') {
            const {cidr} = address
            if (cidr) {
              if (!cidrs) cidrs = cidr
              else if (!Array.isArray(cidrs)) cidrs = [cidrs, cidr]
              else cidrs.push(cidr)
            }
          }
        }
        return cidrs
      }
    }
  }

  isConnectionRefused(e) {
    return e instanceof Error && e.code === 'ECONNREFUSED'
  }
}
