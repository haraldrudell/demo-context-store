/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import LinuxRoutes from './LinuxRoutes'

export default class LinuxFindNode extends LinuxRoutes {
  async findNetworkSegmentNode(o) { // 1.2 [ms] or false
    const {iface, ip} = Object(o)
    return this.arping({iface, ip})
  }
}
