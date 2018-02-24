/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import CheckerBase from './CheckerBase'

import Network from 'network-portable'

import fs from 'fs-extra'

import dns from 'dns'
import util from 'util'

export default class NetworkChecker extends CheckerBase {
  static resolvConf = '/etc/resolv.conf'
  static systemd = '/run/systemd'

  constructor(o) {
    super({name: 'NetworkChecker', ...o})
    const {noNetwork, debug} = Object(o)
    if (!noNetwork) this.network = new Network({debug})
  }

  async run() {
    const {network} = this
    const [defaultRoute, vpnOverride] = await Promise.all([network.getDefaultRoute(), network.getVpnOverride()])
    if (!defaultRoute) return this.getFailure({message: 'No default route present'})

    // Default route: enx000ec6fa54d2 192.168.1.12 near ip: 192.168.1.159/24
    const m = [`Default route: ${this.getRouteString(defaultRoute)}`]

    // is there a default gateway override?
    if (vpnOverride) m.push(`Vpn override: ${this.getRouteString(vpnOverride)}`)

    // dns provider: systemd
    m.push(`dns provider: ${await this.getDnsProvider()}`)

    return this.getSuccess({message: m.join('\n'), data: {defaultRoute, vpnOverride}})
  }

  getRouteString(route) {
    const {iface, gw} = route
    const {network} = this
    const cidrs = network.getNearIp(iface)
    const cidrsPrint = Array.isArray(cidrs) ? cidrs.join(' ') : cidrs
    return `${iface} ${gw} near ip: ${cidrsPrint}`
  }

  async getDnsProvider() {
    const {platform} = process
    const {debug} = this
    const {resolvConf, systemd} = NetworkChecker
    if (platform !== 'linux') return `platform ${platform}: getDnsProvider: NIMP`

    if ((await fs.lstat(resolvConf)).isSymbolicLink() && (await fs.realpath(resolvConf)).startsWith(systemd)) return 'systemd'

    const servers = dns.getServers()
    debug && console.log(`${this.m} dns.getServers: ${util.inspect(servers, {colors: true, depth: null})}`)
    if (servers.includes('127.0.2.1')) return 'dnscrypt'
    return 'networkmanager'
  }
}
