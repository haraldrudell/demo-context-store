/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import Network from 'network-portable'

import util from 'util'

export default class NetChecker {
  static tcpHost = '8.8.8.8'
  static tcpPort = 443

  constructor(o) {
    this.m = 'NetChecker'
    const {debug} = o || false
    Object.assign(this, {debug})
    debug && console.log(`${this.m} constructor: ${util.inspect(o, {colors: true, depth: null})}`)

    this.network = new Network({debug})
  }

  async check() {
    const {network} = this

    // is there a default gateway?
    const defaultRoute = await network.getDefaultRoute() // TODO 180213 hr ipv6
    if (!defaultRoute) return console.log('No default route present')
    console.log(`Default route: ${this.getRouteString(defaultRoute)}`)

    // is there a default gateway override?
    const vpnOverride = await network.getVpnOverride()
    if (vpnOverride) {
      console.log(`Vpn override: ${this.getRouteString(vpnOverride)}`)
    }

    // is the default gateway available?
    const arpMs = await this.getArpLatency(defaultRoute)
    console.log(arpMs
      ? `Gateway latency: ${arpMs} ms`
      : 'Default gateway unavailable')
    if (!arpMs) return

    // does the default gateway connect to the Internet?
    if (!vpnOverride) { // regular tcpOpen
      const ms = await this.getTcpOpenLatency()
      console.log(`Internet latency: ${ms} ms`)
    } else {
      console.log(`nping NIMP`)
    }

    // does the vpn work?
    if (vpnOverride) {
      const vpnMs = await this.getTcpOpenLatency()
      console.log(vpnMs
        ? `Vpn latency: ${vpnMs} ms`
        : `Vpn is down`)
    }
  }

  async getTcpOpenLatency() {
    const {tcpHost: host, tcpPort: port} = NetChecker
    const {network} = this
    return network.tcpOpen({host, port})
  }

  async getArpLatency(route) {
    const {iface, gw} = route
    const {network} = this
    return network.arping({iface, ip: gw})
  }

  getRouteString(route) {
    const {iface, gw} = route
    const {network} = this
    const cidrs = network.getNearIp(iface)
    const cidrsPrint = Array.isArray(cidrs) ? cidrs.join(' ') : cidrs
    return `${iface} ${gw} near ip: ${cidrsPrint}`
  }
}
