/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import Result from './Result'
import InternetChecker from './InternetChecker'

export default class OvpnChecker extends InternetChecker {
  constructor(o) {
    super({noNetwork: true, ...o})
    this.m = 'OvpnChecker'
  }

  async run(isOk, results) {
    const {debug, m: name} = this
    debug && console.log(`${this.m} isOk: ${isOk}`, results)
    if (!isOk) return this.failure(results)

    const {vpnOverride} = results[0].data
    if (!vpnOverride) return new Result({name, isFailure: false, message: 'No overriding vpn', quiet: true})

    // Vpn latency: 400 ms
    const vpnMs = await this.getTcpOpenLatency()
    const isFailure = !!vpnMs
    const message = !isFailure
      ? `Vpn latency: ${vpnMs} ms`
      : `Vpn is down`

    return new Result({name, isFailure, message})
  }
}
