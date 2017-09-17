/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import NetworkBase from './NetworkBase'
import LineReader from 'linesai'

import fs from 'fs-extra'

export default class Linux extends NetworkBase {
  static procNetDev = '/proc/net/dev'
  static sysDevicesVirtualNet = '/sys/devices/virtual/net'
  static procNetRoute = '/proc/net/route'
  static defaultRoute = '0.0.0.0'

  async getDefaultRoute() {
    let result
    for (let route of await this.getRoutes())
      if (route.dest === Linux.defaultRoute)
        if (!result || route.metric < result.metric) result = route
    return result
  }

  async getInterfaces(includeVirtual) { // cat --show-all /proc/net/dev
    const result = new Set()
    const f = Linux.procNetDev
    const lr = new LineReader(fs.createReadStream(f))
    for (let i = 0; ; i++) {
      const line = await lr.readLine()
      if (line === false) break
      if (i < 2) continue // skip 2 header lines
      const match = line.match(/ *([^:]+)/)
      if (!match) throw new Error(`Network.Linux.getInterfaces: failed to parse ${f}: ${line}`)
      result.add(match[1])
    }
    if (includeVirtual) await this._addVirtualInterfaces(result)
    return Array.from(result).sort()
  }

  async _addVirtualInterfaces(result) {
    for (let ifname of await fs.readdir(Linux.sysDevicesVirtualNet)) result.add(ifname)
  }

  async getRoutes() { // cat --show-all /proc/net/route
    const result = []
    const f = Linux.procNetRoute
    const lr = new LineReader(fs.createReadStream(f))
    for (let i = 0; ; i++) {
      const line = await lr.readLine()
      if (line === false) break
      if (i < 1) continue // skip header line
      const match = line.match(/([^\t]+)\t([^\t]+)\t([^\t]+)\t(([^\t]+)\t){3}([^\t]+)\t([^\t]+)/)
      if (!match) throw new Error(`Network.Linux.getRoutes: failed to parse ${f}: ${line}`)
      result.push({
        dest: this._getIpv4(match[2]),
        gw:  this._getIpv4(match[3]),
        iface: match[1],
        metric: Number(match[6]),
        mask: this._getIpv4(match[7]),
        suffix: this._getSuffix(match[7]),
      })
    }
    return result.sort(this._routeSort)
  }

  _routeSort(r1, r2) {
    return r1.dest < r2.dest || r1.metric < r2.metrics
      ? -1
      : 1
  }

  _getIpv4(s) { // 8 characters
    let result = []
    for (let i = 6; i >= 0; i -= 2) result.push(parseInt(s.substr(i, 2), 16))
    return result.join('.')
  }

  _getSuffix(s) {
    const n = parseInt(s, 16)
    return n === 0 ? n : n.toString(2).length
  }
}
