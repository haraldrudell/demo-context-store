/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import {setMDebug, classLogger} from 'es2049lib'

import dgram from 'dgram'
const {Socket} = dgram

export default class UdpSocket extends Socket {
  static udp4 = 'udp4'
  static family = UdpSocket.udp4 // default socket ip family
  static lo_ipv4 = '127.0.0.1'
  static lo_ipv6 = '::1'
  static anyPort = 0

  static async getUdpSocket(o) {
    try {
      return new UdpSocket(o)
    } catch (e) {
      throw Object.assign(e, {fn: 'UdpSocket.constructor', args: o})
    }
  }

  constructor(o) {
    super(Object(o).type || UdpSocket.udp4)
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

  async sendMessage(o) { // {bytes, address: '127.0.0.1', family: 'IPv4', port: 50752}
    const {address, port, message} = o
    const bytes = await new Promise((resolve, reject) => this.send(message, port, address, (e, b) => !e ? resolve(b) : reject(e))).catch(e => {
      throw Object.assign(e, {fn: `${this.m}.sendMessage`, args: o})
    })
    return Object.assign({bytes}, this.address())
  }

  async listen() { // {address: '127.0.0.1', family: 'IPv4', port: 50752}
    const {port, address, listenProhibited, _reject} = this._udpSocket
    const fn = `${this.m}.listen`
    const assignProperties = e => Object.assign(e, {fn, port, address})
    if (listenProhibited) throw assignProperties(new Error(`${fn}: already listening or shutdown`))
    await new Promise((resolve, reject) => {
      const onError = e => reject(assignProperties(e))
      this.on('error', onError)
      this.bind({port, address}, resolve)
      this.removeListener('error', onError).on('error', _reject)
    })
    this.listenProhibited = true
    return this.address()
  }

  async shutdown() {
    const {_resolve} = this._udpSocket
    this.listenProhibited = true
    await new Promise((resolve, reject) => this.close(resolve))
    _resolve()
  }

  getType() {
    return this._udpSocket.type
  }
}
