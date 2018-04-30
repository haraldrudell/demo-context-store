/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import dgram from 'dgram'
const {Socket} = dgram

export default class UdpSocket extends Socket {
  static async getUdpSocket(o) {
    try {
      return new UdpSocket(o)
    } catch(e) {
      throw Object.assign(e, {fn: 'UdpSocket.constructor', args: o})
    }
  }

  constructor(o) {
    super(Object(o).type || 'udp4') // Node.js v9.10.1 does not have class properties
    this.m = 'UdpSocket'
    const {port: port0, address: address0, type: type0} = Object(o)

    // Node.js v9.10.1 does not have static class properties
    const prototype = UdpSocket.prototype
    if (!prototype.udp4) {
      prototype.udp4 = 'udp4'
      prototype.lo4 = '127.0.0.1'
      prototype.lo6 = '::1'
      prototype.anyPort = 0
    }
    const {udp4, lo4, lo6, anyPort} = UdpSocket.prototype

    const type = type0 || udp4
    const port = port0 != null ? port0 : anyPort
    const address = address0 || (type === udp4 ? lo4 : lo6)
    let _reject, _resolve
    this.promise = new Promise((resolve, reject) => (_resolve = resolve) + (_reject = reject))
    this._udpSocket = {port, address, type, _resolve, _reject}
  }

  async sendMessage(o) { // {bytes, address: '127.0.0.1', family: 'IPv4', port: 50752}
    const {type: type0, address, port, message} = o
    const {type: type1} = this._udpSocket
    const type = type0 || type1
    const bytes = await new Promise((resolve, reject) => this.send(message, port, address, (e, b) => !e ? resolve(b) : reject(e))).catch(e => {
      throw Object.assign(e, {fn: `${this.m}.sendMessage`, args: o})
    })
    return Object.assign({bytes}, this.address())
  }

  async shutdown() {
    const {_resolve} = this._udpSocket
    this.isListen = true
    await new Promise((resolve, reject) => this.close(resolve))
    _resolve()
  }

  async listen() { // {address: '127.0.0.1', family: 'IPv4', port: 50752}
    const {port, address, isListen, _reject} = this._udpSocket
    const fn = `${this.m}.listen`
    const assignProperties = e => Object.assign(e, {fn, port, address})
    if (isListen) throw assignProperties(new Error(`${fn}: already listening or shutdown`))
    await new Promise((resolve, reject) => {
      const onError = e => reject(assignProperties(e))
      this.on('error', onError)
      this.bind({port, address}, resolve)
      this.removeListener('error', onError).on('error', _reject)
    })
    this.isListen = true
    return this.address()
  }
}
