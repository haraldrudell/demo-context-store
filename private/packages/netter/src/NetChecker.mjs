/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import Network from 'network-portable'

import fs from 'fs-extra'

import dns from 'dns'
import util from 'util'
const {Resolver} = dns

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
      console.log(`Internet latency: ${ms / 1e3} s`)
    } else {
      console.log(`root nping with interface override NIMP`)
    }

    // does the vpn work?
    if (vpnOverride) {
      const vpnMs = await this.getTcpOpenLatency()
      console.log(vpnMs
        ? `Vpn latency: ${vpnMs} ms`
        : `Vpn is down`)
    }

    // what is providing dns?
    const {platform} = process
    if (platform === 'linux') {
      let dnsProvider
      const resolvConf = '/etc/resolv.conf'
      const systemd = '/run/systemd'
      if ((await fs.lstat(resolvConf)).isSymbolicLink() && (await fs.realpath(resolvConf)).startsWith(systemd)) dnsProvider = 'systemd'
      else if (dns.getServers().contains('127.0.2.1')) dnsProvider = 'dnscrypt'
      else dnsProvider = 'networkmanager'
      console.log(`dns provider: ${dnsProvider}`)
    } else console.log(`dns platform ${platform}: NIMP`)

    const {isTimeout, elapsed, e} = await this.doDns()
    console.log(`dns: ${elapsed.toFixed(3)} s${isTimeout ? ' time out' : ''}${e ? ` error: ${e.message}` : ''}`)
  }

  async doDns() {
    const resolver = new Resolver()
    const domain = `a${Date.now()}${String(Math.random()).substring(2, 5)}.blogspot.com`
    let timer
    const t0 = Date.now()
    const [e] = await new Promise((resolve, reject) => {
      resolver.resolve(domain, (ex, a) => resolve([ex, a]))
      timer = setTimeout(() => resolver.cancel(), 3e3)
    })
    const isTimeout = e && e.code === 'ECANCELLED'
    if (!isTimeout) clearTimeout(timer)
    const elapsed = (Date.now() - t0) / 1e3
    const result = {elapsed, isTimeout}
    if (!isTimeout && e) result.e = e
    return result
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
