/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import NetworkBase from './NetworkBase'

import {spawnCapture} from 'allspawn'
import {patchCommand} from 'es2049lib'
import {LineReader} from 'linesai'

import fs from 'fs-extra'

export default class Linux extends NetworkBase {
  static procNetDev = '/proc/net/dev'
  static sysDevicesVirtualNet = '/sys/devices/virtual/net'
  static procNetRoute = '/proc/net/route'
  static defaultRoute = '0.0.0.0'
  static defaultRouteMask = '0.0.0.0'
  static vpnOverrideMask = '128.0.0.0'
  static arpingCmd = ['arping', '-IINTERFACE', '-c1', 'IP']

  async getDefaultRoute() {
    return this.getLowestRoute({dest: Linux.defaultRoute, mask: Linux.defaultRouteMask})
  }

  async getVpnOverride() {
    return this.getLowestRoute({dest: Linux.defaultRoute, mask: Linux.vpnOverrideMask})
  }

  async getLowestRoute({dest: d, mask: m}) {
    let result
    for (let route of await this.getRoutes()) {
      const {dest, mask, metric} = route
      if (dest === d && mask === m && (!result || metric < result.metric)) result = route
    }
    return result
  }

  async getInterfaces(includeVirtual) { // cat --show-all /proc/net/dev
    const f = Linux.procNetDev
    const lineReader = new LineReader(fs.createReadStream(f))
    const [result] = await Promise.all([
      this.getInterfaces2(lineReader, f, includeVirtual),
      lineReader.promise,
    ])
    return result
  }

  async getInterfaces2(lineReader, f, includeVirtual) {
    const result = new Set()
    for (let i = 0; ; i++) {
      const line = await lineReader.readLine()
      if (line === false) break
      if (i < 2) continue // skip 2 header lines
      const match = line.match(/ *([^:]+)/)
      if (!match) throw new Error(`Network.Linux.getInterfaces: failed to parse ${f}: ${line}`)
      result.add(match[1])
    }
    if (includeVirtual) await this._addVirtualInterfaces(result)
    return Array.from(result).sort()
  }

  async arping({iface, ip}) {
    const {debug} = this
    const args = patchCommand(Linux.arpingCmd, /INTERFACE/g, iface, /IP/g, ip)
    const {stdout} = await spawnCapture({args, echo: debug})
    const match = stdout.match(/(\d+\.\d+)ms/m)
    if (!match || match.length !== 2) throw new Error(`${this.m}.arping parsing failed: '${stdout}'`)
    return Number(match[1])
  }

  async _addVirtualInterfaces(result) {
    for (let ifname of await fs.readdir(Linux.sysDevicesVirtualNet)) result.add(ifname)
  }

  async getRoutes() { // cat --show-all /proc/net/route
    const f = Linux.procNetRoute
    const lr = new LineReader({readable: fs.createReadStream(f)})
    const [result] = await Promise.all([
      this.getRoutes2(lr, f),
      lr.promise,
    ])
    this.debug && console.log(`${this.m} getRoutes: ${result}`)
    return result
  }

  async getRoutes2(lr, f) {
    const result = []
    for (let i = 0; ; i++) {
      const line = await lr.readLine()
      this.debug && console.log(`${this.m} getRoutes2: ${line}`)
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
    this.debug && console.log(`${this.m} getRoutes2result: ${result}`)
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
