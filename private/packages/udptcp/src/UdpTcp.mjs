/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import UdpSender from './UdpSender'
import UdpListener from './UdpListener'

import {setMDebug, classLogger} from 'es2049lib'

export default class UdpTcp {
  static address = '127.0.0.1'
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
    const ps = listeners.map(l => l.promise)
    listeners.forEach(l => ps.push(l.run()))
    console.log(`${this.m} listening on ports: ${listeners.length}`)
    return Promise.all(ps)
  }

  shutdown() {
    this.isRun = true
    const {listeners} = this
    this.listeners.length = 0
    return Promise.all(listeners.map(l => l.shutdown()))
  }

  _createListeners(ports, construct, name) {
    const {listeners} = this
    const {address} = UdpTcp
    if (ports == null) return
    if (!Array.isArray(ports)) ports = [ports]
    const portMap = {}
    let ix = 0
    for (let port0 of ports) {
      const port = this._isPortNumber(port0)
      if (!port) throw new Error(`${this.m} port type ${name} index #${ix}: not port number: '${port}'`)
      ix++
      if (portMap[port]) continue
      portMap[port] = true
      listeners.push(new construct({address, port}))
    }
  }

  _isPortNumber(v) {
    v = +v
    return v >= 1 && v <= 65535 && Number.isInteger(v) ? v : false
  }
}
