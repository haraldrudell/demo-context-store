/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import NetworkArping from './NetworkArping'

import os from 'os'

export default class NetworkNearIp extends NetworkArping {
  getNearIp(iface) { // array of string '1.2.3.4/24', may be empty
    const results = []
    /* {
      lo: [
        {address: '127.0.0.1', netmask: '255.0.0.0', family: 'IPv4', mac: '00:00:00:00:00:00', internal: true, cidr: '127.0.0.1/8' },
        { address: '::1', netmask: 'ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff', family: 'IPv6', mac: '00:00:00:00:00:00', scopeid: 0, internal: true, cidr: '::1/128' }
      ],} */
    const ifs = os.networkInterfaces()
    const ifAddrs = ifs && ifs[iface]
    if (!ifAddrs) return results
    for (let address of ifAddrs) {
      if (address.family === 'IPv4') {
        const {cidr} = address
        if (cidr) results.push(cidr)
      }
    }
    return results
  }
}
