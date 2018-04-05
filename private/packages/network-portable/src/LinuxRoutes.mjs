/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import LinuxInterfaces from './LinuxInterfaces'

import {LineReader} from 'linesai'

import fs from 'fs-extra'

export default class LinuxRoutes extends LinuxInterfaces {
  static procNetRoute = '/proc/net/route'
  static defaultRoute = '0.0.0.0'
  static defaultRouteMask = '0.0.0.0'
  static vpnOverrideMask = '128.0.0.0'

  async getRoutes() { // cat --show-all /proc/net/route
    const {procNetRoute} = LinuxRoutes
    let lineReader
    const [, result] = await Promise.all([
      (lineReader = new LineReader({readable: fs.createReadStream(procNetRoute)})).promise,
      this._getRoutes(lineReader, procNetRoute),
    ])
    this.debug && console.log(`${this.m} getRoutes: ${result}`)
    return result
  }

  async _getRoutes(lineReader, f) {
    const result = []
    for (let i = 0; ; i++) {
      const line = await lineReader.readLine()
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
    return r1.dest < r2.dest || r1.metric < r2.metrics ? -1 : 1
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
