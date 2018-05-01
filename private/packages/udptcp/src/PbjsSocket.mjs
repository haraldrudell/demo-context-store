/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import {setMDebug, classLogger} from 'es2049lib'

import {Root} from 'protobufjs' // 180430 6.8.6 is CommonJS

import net from 'net'
const {Server} = net

export default class PbjsSocket extends Socket {
  static async getPbjsSocket(o) {
    try {
      return new PbjsSocket(o)
    } catch (e) {
      throw Object.assign(e, {fn: 'PbjsSocket.constructor', args: o})
    }
  }

  constructor(o) {
    const {port: port0, address: address0, type: type0} = setMDebug(o, this, 'UdpSocket')
    const {udp4, family, lo_ipv4, lo_ipv6, anyPort} = UdpSocket
    const type = type0 || family
    const port = port0 != null ? port0 : anyPort
    const address = address0 || (type === udp4 ? lo_ipv4 : lo_ipv6)
    let _reject, _resolve
    this.promise = new Promise((resolve, reject) => (_resolve = resolve) + (_reject = reject))
    this._udpSocket = {port, address, type, _resolve, _reject}
    classLogger(this, UdpSocket)
  }

  async shutdown() {
    const {_resolve} = this._udpSocket
    this.listenProhibited = true
    await new Promise((resolve, reject) => this.close(resolve))
    _resolve()
  }
}
