/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import UdpSender from './UdpSender'
import UdpListener from './UdpListener'

import {setMDebug, classLogger} from 'es2049lib'

import util from 'util'

export default class UdpTcp {
  static host = '127.0.0.1'
  listeners = []

  constructor(options) {
    const {tcp, udp} = setMDebug(options, this, 'UdpTcp')
    this._createListeners(tcp, UdpSender, 'tcp')
    this._createListeners(udp, UdpListener, 'udp')
    classLogger(this, UdpTcp)
  }

  async run() {
    const {listeners} = this
    if (this.isRun) throw new Error(`${this.m}.run: run or shutdown already invoked`)
    this.isRun = true
    return Promise.all(listeners.map(l => l.run()))
  }

  shutdown() {
    this.isRun = true
    const {listeners} = this
    this.listeners.length = 0
    return Promise.all(listeners.map(l => l.shutdown()))
  }

  _createListeners(ports, construct, name) {
    const {listeners} = this
    const {host} = UdpTcp
    const portMap = {}
    if (!Array.isArray(ports)) ports = [ports]
    for (let ix = 0, port0 of ports) {
      const port = this._isPortNumber(port0)
      if (!port) throw new Error(`${this.m} port type ${name} index #${ix}: not port number: '${port}'`)
      ix++
      if (portMap[port]) continue
      portMap[port] = true
      listeners.push(new construct({host, port}))
    }
  }

  _isPortNumber(v) {
    v = +v
    return v >= 1 && v <= 65535 && Number.isInteger(v) ? v : false
  }
}
