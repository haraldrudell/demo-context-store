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
    let timer
    const result = await new Promise((resolve, reject) => new net.Socket()
      .on('error', e => this.isConnectionRefused(e) ? resolve(false) : reject(e))
      .once('connect', function isPortOpenDisconnect() {
        this.end()
      })
      .once('finish', () => resolve(true))
      .connect(port, host) +
      (timer = setTimeout(() => reject(Object.assign(new Error(`${this.m} tcpOpen timeout: ${host}:${port}`), {host, port, timeout})), timeout))
    )
    clearTimeout(timer)
    if (result === false) return // undefined: port is not open
    const elapsedMs = Date.now() - t0
    return elapsedMs
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
