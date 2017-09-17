/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import NetworkShim from 'network-portable'
import DefaultRouteResult from './DefaultRouteResult'

export default class Network {
  static instance

  constructor() {
    const i = Network.instance
    if (!i) {
      Network.instance = this
      this.shim = new NetworkShim()
    } else return i
  }

  defaultRoute = async () => new DefaultRouteResult(await this.shim.getDefaultRoute())

  listInterfaces = async () => this.shim.getInterfaces()
}
