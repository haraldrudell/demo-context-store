/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import Result from './Result'

import Network from 'network-portable'

import fs from 'fs-extra'

import dns from 'dns'
import util from 'util'

export default class NetworkChecker {
  constructor(o) {
    this.m = 'NetworkChecker'
    const debug = Object(o).debug && (this.debug = true)
    this.network = new Network({debug})
  }

  async run() {
    const {network, m: name} = this
    const [defaultRoute, vpnOverride] = await Promise.all([network.getDefaultRoute(), network.getVpnOverride()])
    if (!defaultRoute) return new Result({name, isFailure: true, message: 'No default route present'})

    // Default route: enx000ec6fa54d2 192.168.1.12 near ip: 192.168.1.159/24
    let message = [`Default route: ${this.getRouteString(defaultRoute)}`]

    // is there a default gateway override?
    if (vpnOverride) message.push(`Vpn override: ${this.getRouteString(vpnOverride)}`)

    // dns provider: systemd
    message.push(`dns provider: ${await this.getDnsProvider()}`)

    message = message.join('\n')
    return new Result({name, isFailure: false, message, data: {defaultRoute, vpnOverride}})
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
    if (platform !== 'linux') return `platform ${platform}: getDnsProvider: NIMP`

    const resolvConf = '/etc/resolv.conf'
    const systemd = '/run/systemd'
    if ((await fs.lstat(resolvConf)).isSymbolicLink() && (await fs.realpath(resolvConf)).startsWith(systemd)) return 'systemd'

    const servers = dns.getServers()
    debug && console.log(`${this.m} dns.getServers: ${util.inspect(servers, {colors: true, depth: null})}`)
    if (servers.includes('127.0.2.1')) return 'dnscrypt'
    return 'networkmanager'
  }
}
