/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import InternetChecker from './InternetChecker'

import {getNonEmptyString} from 'es2049lib'

export default class VpnChecker extends InternetChecker {
  constructor(o) {
    super({name: 'VpnChecker', ...o})
    const {iface, tcpHost} = Object(o)
    const s = {}
    if (getNonEmptyString({iface, s})) throw new Error(`${this.m} iface: ${s.text}`)
    this.hasHost = !!tcpHost
    Object.assign(this, s.properties)
  }

  async run(isOk, results) {
    const {debug, network, iface, hasHost} = this
    debug && console.log(`${this.m} isOk: ${isOk}`, results)
    if (!isOk) return this.getDependencyFailure(results)
    const m = []

    const ifaces = await network.getInterfaces(true)
    if (!ifaces.includes(iface)) return this.getFailure({message: `vpn interface ${iface} down`})

    if (hasHost) {
      const {text, message, data} = await this.getTcpOpenLatency(iface)
      if (message) return this.getFailure({message, data})
      m.push(`vpn ${text}`)
    } else m.push(`vpn interface ${iface} is up`)

    return this.getSuccess({message: m.join('\n')})
  }
}
