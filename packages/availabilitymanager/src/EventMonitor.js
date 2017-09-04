/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import DefaultRouteMonitor from './DefaultRouteMonitor'
import Pinger from './Pinger'
import CommandLiner from './CommandLiner'
import {options as syslogOptions, default as syslog} from './SysLog'
import ProcessStatus from './ProcessStatus'

import util from 'util'
import {EventEmitter} from 'events'

export default class EventMonitor {
  static constructorMap = {
    DefaultRouteMonitor: DefaultRouteMonitor,
    Pinger: Pinger,
    CommandLiner: CommandLiner,
  }

  constructor({monitor, profile, errorHandler, cmdName, constructorMap = EventMonitor.constructorMap}) {
    Object.assign(this, {errorHandler, profile, constructorMap})
    syslogOptions.appName = cmdName
    syslogOptions.errorHandler = errorHandler

    this.eventBus = new EventEmitter
    this.state = {}
    this.eventConsumer(new ProcessStatus())

    this.launchAllEntries(monitor)
  }

  launchAllEntries(list) {
    if (!Array.isArray(list)) throw new Error(`Profile ${this.profile}: monitor not list`)
    const entries = {}
    const {eventBus, errorHandler} = this
    const shared = {eventBus, errorHandler}
    for (let [index, entry] of list.entries()) entries[entry] = this.launchMonitorListEntry(index, entry, entries, shared)

  }

  launchMonitorListEntry(index, entry, entries, shared) {
    let m = `${this.profile} ${index}`

    // convert string entry to object
    if (typeof entry === 'string') entry = {[entry]: {fn: entry}}

    // get printable and parameter values
    const keys = Object.keys(entry || false)
    const klen = keys.length
    if (klen !== 1) throw new Error(`${m} not single key dictionary: ${klen}`)
    const printable = String(keys[0] || '')
    if (!printable) throw new Error(`${m} empty name`)
    m = `${this.profile} ${printable}`
    if (entries[printable]) throw new Error(`${m} duplicate name`)
    const values = {...(entry[printable] || false)}

    // instantiate
    const {fn} = values
    const construct = this.constructorMap[fn]
    if (typeof construct !== 'function') throw new Error(`${m} function not available: '${fn}'`)
    delete values.fn
    return new construct({...values, printable, ...shared})
      .on('data', this.eventConsumer)
  }

  eventConsumer = status => (async () => {
    try {
      console.log(status.toString())
    } catch (e) {
      console.error('EventMonitor.eventConsumer: Status.toString failed:', status) // toString failed, so do inspect
      throw e
    }
    syslog(status.toLog())

    this.state[status.printable] = status
    this.eventBus.emit('change', status)
  })().catch(this.errorHandler)
}
