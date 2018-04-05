/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import LinuxFindNode from './LinuxFindNode'

export default class Linux extends LinuxFindNode {
  static defaultRoute = '0.0.0.0'
  static defaultRouteMask = '0.0.0.0'
  static vpnOverrideMask = '128.0.0.0'

  async getDefaultRoute() {
    const {defaultRoute: dest, defaultRouteMask: mask} = Linux
    return this._getLowestRoute({dest, mask})
  }

  async getVpnOverride() {
    const {defaultRoute: dest, vpnOverrideMask: mask} = Linux
    return this._getLowestRoute({dest, mask})
  }

  async _getLowestRoute({dest: d, mask: m}) {
    let result
    for (let route of await this.getRoutes()) {
      const {dest, mask, metric} = route
      if (dest === d && mask === m && (!result || metric < result.metric)) result = route
    }
    return result
  }
}
