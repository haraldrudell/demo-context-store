/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import Result from './Result'
import CheckerBase from './CheckerBase'

import Network from 'network-portable'
import {doSudo} from 'es2049lib'

export default class InternetChecker extends CheckerBase {
  static tcpHost = '8.8.8.8'
  static tcpPort = 443

  constructor(o) {
    super(o)
    this.m = 'InternetChecker'
    if (!o || !o.noNetwork) this.network = new Network({debug: this.debug})
  }

  async run(isOk, results) {
    const {debug} = this
    debug && console.log(`${this.m} isOk: ${isOk}`, results)
    if (!isOk) return this.failure(results)
    const {defaultRoute, vpnOverride} = results[0].data
    let message = []

    // Gateway latency: 0.806 ms
    const arpMs = await this.getArpLatency(defaultRoute)
    if (!arpMs) return new Result({name: this.m, isFailure: true, message: 'Default gateway unavailable'})
    message.push(`Gateway latency: ${arpMs} ms`)

    // does the default gateway connect to the Internet?
    if (!vpnOverride) { // regular tcpOpen
      const ms = await this.getTcpOpenLatency()
      message.push(`Internet latency: ${(ms / 1e3).toFixed(3)} s`)
    } else await doSudo({args: 'sudonping'})

    message = message.join('\n')
    const data = {defaultRoute, vpnOverride}
    return new Result({name: this.m, isFailure: false, message, data})
  }

  async getTcpOpenLatency() {
    const {tcpHost: host, tcpPort: port} = InternetChecker
    const {network} = this
    return network.tcpOpen({host, port})
  }

  async getArpLatency(route) {
    const {iface, gw} = route
    const {network} = this
    return network.arping({iface, ip: gw})
  }
}
