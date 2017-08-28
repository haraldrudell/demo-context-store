/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import NetworkMonitor from './NetworkMonitor'
import Pingc3 from './Pingc3'
import {options as syslogOptions, default as syslog} from './SysLog'
import ProcessStatus from './ProcessStatus'

import util from 'util'

export default class Monitor {
  constructorMap = {
    NetworkMonitor: NetworkMonitor,
    Pingc3: Pingc3,
  }

  constructor(o) {
    const {monitor, profile, errorHandler} = (o || false)
    Object.assign(this, {errorHandler, profile})
    syslogOptions.appName = o.cmdName
    syslogOptions.errorHandler = errorHandler

    if (!Array.isArray(monitor)) throw new Error(`Profile ${profile}: monitor not list`)

    this.status = {}
    this.eventConsumer(new ProcessStatus())
    for (let [index, entry] of monitor.entries()) this.launchMonitorListEntry({index, entry})
  }

  launchMonitorListEntry({index, entry}) {
    const o = {}
    let fn
    switch (typeof entry) {
      case 'string': fn = o.printable = entry; break
      case 'object':
        const keys = Object.keys(entry)
        if (keys.length !== 1) throw new Error(`${this.profile} ${index} dictionary not single key: ${keys.length}`)
        const printable = String(keys[0])
        Object.assign(o, entry[printable], {printable})
        fn = o.fn || printable
        delete o.fn
        break
      default: throw new Error(`${this.profile} monitor ${index} not string or dictionary: ${typeof entry}`)
    }
    if (!o.printable) throw new Error(`${this.profile} ${index} printable name empty`)
    const construct = this.constructorMap[fn]
    if (typeof construct !== 'function') throw new Error(`${this.profile} ${o.printable} function not available: '${fn}'`)
    o.errorHandler = this.errorHandler
    o.status = this.status
    return new construct(o).on('data', this.eventConsumer)
  }

  log(...args) {
    const s = util.format(...args)
    console.log(s)
    syslog(s) // will terminate on error
  }

  eventConsumer = o => (async () => {
    this.status[o.id] = o
    console.log(o.toString())
    syslog(o.toLog())
  })().catch(this.errorHandler)
}
