/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import InternetChecker from './InternetChecker'

export default class OvpnChecker extends InternetChecker {
  constructor(o) {
    super({name: 'OvpnChecker', ...o})
  }

  async run(isOk, results) {
    const {debug} = this
    debug && console.log(`${this.m} isOk: ${isOk}`, results)
    if (!isOk) return this.getDependencyFailure(results)
    const {vpnOverride} = results[0].data

    if (!vpnOverride) return this.getSuccess({message: 'No overriding vpn', quiet: true})

    // Vpn latency: 400 ms
    const {iface} = vpnOverride
    const {text, message, data} = await this.getTcpOpenLatency(iface)
    if (message) return this.getFailure({message, data})
    return this.getSuccess({message: `vpn ${text}`})
  }
}
