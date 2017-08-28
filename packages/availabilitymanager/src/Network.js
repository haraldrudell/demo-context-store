/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import network from 'network'
import Result from './Result'

export default class Network {
  static instance
  allowedEntries = {defaultRoute: this, gateway: this}

  constructor() {
    const i = Network.instance
    if (!i) Network.instance = this
    else return i
  }

  async gateway() {
    const ip = await new Promise((resolve, reject) =>
      network.get_gateway_ip((e, ip) => !e ? resolve(ip) : reject(e)))
    return new Result({message: `TODO: arping ${ip}`})
  }

  async defaultRoute(x) {
    if (x) return new Result({isFailure: true, message: 'FAIL'})
    const iface = await new Promise((resolve, reject) =>
      network.get_active_interface((e, aif) => !e ? resolve(aif) : reject(e)))
      return new DefaultRouteResult(iface)
  }
}

class DefaultRouteResult extends Result {
  constructor(iface) {
    super(iface)
    this.iface = iface
  }
  toString() {
    const {iface} = this
    return !this.isFailure
      ? `${iface.name} ${iface.ip_address} ${iface.type} gw ${iface.gateway_ip}`
      : 'Default route missing'
  }
}
