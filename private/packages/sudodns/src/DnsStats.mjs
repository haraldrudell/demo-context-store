/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import {getISOLocal} from 'es2049lib'

import util from 'util'

export default class DnsStats {
  static serverData0 = {responseCount: 0, seconds: 0, timeoutCount: 0}
  serverMap = {}
  created = Date.now()

  constructor(o) {
    const {name, debug} = o || false
    this.m = String(name || 'DnsStats')
    debug && (this.debug = true) && console.log(`${this.m} constructor: ${util.inspect(this, {colors: true, depth: null})}`)
  }

  addValue({server, duration, isTimeout}) {
    const {serverMap} = this
    const {serverData0} = DnsStats
    const serverData = serverMap[server] || (serverMap[server] = {...serverData0})
    if (!isTimeout) {
      serverData.responseCount++
      serverData.seconds += duration
    } else serverData.timeoutCount++
  }

  mergeDnsStats(stats1) {
    const {serverMap} = this
    if (!(stats1 instanceof DnsStats)) throw new Error(`${this.m} stats1 not DnsStats`)
    for (let [server1, serverData1] of Object.entries(stats1.serverMap)) {
      const serverData = serverMap[server1]
      if (!serverData) serverMap[server1] = {...serverData1}
      else {
        const {responseCount, seconds, timeoutCount} = serverData1
        serverData.responseCount += responseCount
        serverData.seconds += seconds
        serverData.timeoutCount += timeoutCount
      }
    }
  }

  toString() {
    const {serverMap, created} = this
    const serverDataList = Object.entries(serverMap)
    let s = serverDataList.length ? '' : 'no requests'
    for (let [server, {responseCount, seconds, timeoutCount}] of serverDataList) {
      s += `${s ? ' ' : ''}${server}:`
      if (responseCount) s += ` requests: ${responseCount} avg: ${(seconds / responseCount).toFixed(3)}`
      if (timeoutCount) s += ` timeouts: ${timeoutCount}`
    }
    s += ` since: ${getISOLocal({timeval: created})}`
    return s
  }
}
