/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import NetworkBase from './NetworkBase'

import {LineReader} from 'linesai'

import fs from 'fs-extra'

export default class LinuxInterfaces extends NetworkBase {
  static procNetDev = '/proc/net/dev'
  static sysDevicesVirtualNet = '/sys/devices/virtual/net'

  async getInterfaces(includeVirtual) { // cat --show-all /proc/net/dev
    const {procNetDev} = LinuxInterfaces
    let lineReader
    const [, result] = await Promise.all([
      (lineReader = new LineReader(fs.createReadStream(procNetDev))).promise,
      this._getInterfaces(lineReader, procNetDev, includeVirtual),
    ])
    return result
  }

  async _getInterfaces(lineReader, f, includeVirtual) {
    const result = new Set()
    for (let i = 0; ; i++) {
      const line = await lineReader.readLine()
      if (line === false) break
      if (i < 2) continue // skip 2 header lines
      const match = line.match(/ *([^:]+)/)
      if (!match) throw new Error(`Network.Linux.getInterfaces: failed to parse ${f}: '${line}'`)
      result.add(match[1])
    }
    if (includeVirtual) await this._addVirtualInterfaces(result)
    return Array.from(result).sort()
  }

  async _addVirtualInterfaces(result) {
    const {sysDevicesVirtualNet} = LinuxInterfaces
    for (let iface of await fs.readdir(sysDevicesVirtualNet)) result.add(iface)
  }
}
