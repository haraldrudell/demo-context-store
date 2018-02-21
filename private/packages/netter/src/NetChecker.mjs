/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import DnsTester from './DnsTester'

import Network from 'network-portable'
import {doSudo} from 'es2049lib'

import fs from 'fs-extra'

import dns from 'dns'
import util from 'util'

export default class NetChecker {
  static tcpHost = '8.8.8.8'
  static tcpPort = 443

  constructor(o) {
    this.m = 'NetChecker'
    const {debug} = o || false
    Object.assign(this, {debug})
    this.network = new Network({debug})
    debug && console.log(`${this.m} constructor: ${util.inspect(o, {colors: true, depth: null})}`)
  }

  async check() {
    const {network, debug} = this

    // is there a default gateway?
    const defaultRoute = await network.getDefaultRoute() // TODO 180213 hr ipv6
    debug && console.log(`${this.m} getDefaultRoute: ${util.inspect(defaultRoute, {colors: true, depth: null})}`)
    if (!defaultRoute) throw new Error('No default route present')
    console.log(`Default route: ${this.getRouteString(defaultRoute)}`)

    // is there a default gateway override?
    const vpnOverride = await network.getVpnOverride()
    debug && console.log(`${this.m} getVpnOverride: ${util.inspect(vpnOverride, {colors: true, depth: null})}`)
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
    } else await doSudo({args: 'sudonping'})

    // does the vpn work?
    if (vpnOverride) {
      const vpnMs = await this.getTcpOpenLatency()
      console.log(vpnMs
        ? `Vpn latency: ${vpnMs} ms`
        : `Vpn is down`)
    }

    // what is providing dns?
    console.log(`dns provider: ${await this.getDnsProvider()}`)

    const {err, isTimeout, elapsed} = await new DnsTester().test()
    console.log(`dns: ${elapsed.toFixed(3)} s${isTimeout ? ' time out' : ''}${err ? ` error: ${err.message}` : ''}`)
  }

  async getDnsProvider() {
    const {platform} = process
    const {debug} = this
    if (platform !== 'linux') return `platform ${platform}: getDnsProvider: NIMP`

    const resolvConf = '/etc/resolv.conf'
    const systemd = '/run/systemd'
    if ((await fs.lstat(resolvConf)).isSymbolicLink() && (await fs.realpath(resolvConf)).startsWith(systemd)) return 'systemd'

    const servers = dns.getServers()
    debug && console.log(`${this.m} dns.getServers: ${util.inspect(servers, {colors: true, depth: null})}`)
    if (servers.includes('127.0.2.1')) return 'dnscrypt'
    return 'networkmanager'
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
