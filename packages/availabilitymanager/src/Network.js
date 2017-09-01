/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import network from 'network'
import DefaultRouteResult from './DefaultRouteResult'

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
    const iface = await new Promise((resolve, reject) =>
      network.get_active_interface((e, aif) => {
        if (e && e.message.startsWith('No active')) e = null
        if (!e) resolve(aif)
        else reject(e)
      }))
      return new DefaultRouteResult(iface)
  }

  async listInterfaces() {
    return new Promise(resolve => network.get_interfaces_list((error, list) => resolve({error, list})))
  }
}
