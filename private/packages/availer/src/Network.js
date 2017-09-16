/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import Linux from './Linux'
import MacOS from './MacOS'
import Windows from './Windows'
import DefaultRouteResult from './DefaultRouteResult'

export default class Network {
  constructor() {

  }
  static instance
  allowedEntries = {defaultRoute: this, gateway: this}

  constructor() {
    const i = Network.instance
    if (!i) Network.instance = this
    else return i
  }

  async gateway() {
    const ip = await new Promise((resolve, reject) =>
      network.get_gateway_ip((e, ipr) => !e ? resolve(ipr) : reject(e)))
    return new DefaultRouteResult({message: `TODO: arping ${ip}`})
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
