/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import dgram from 'dgram'
const {Socket} = dgram

export default class UdpSocket extends Socket {
  static udp4 = 'udp4'
  static family = UdpSocket.udp4 // default socket ip family
  static lo4 = '127.0.0.1'
  static lo6 = '::1'
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
    const {port: port0, address: address0, type: type0} = Object(o)
    const {udp4, family, lo4, lo6, anyPort} = UdpSocket
    this.m = 'UdpSocket'
    const type = type0 || family
    const port = port0 != null ? port0 : anyPort
    const address = address0 || (type === udp4 ? lo4 : lo6)
    let _reject, _resolve
    this.promise = new Promise((resolve, reject) => (_resolve = resolve) + (_reject = reject))
    this._udpSocket = {port, address, type, _resolve, _reject}
    const messageListener = this.messageListener = (msg, rinfo) => this.receivePacket(msg, rinfo).catch(_reject)
    this.on('message', messageListener)
  }

  async sendMessage(o) { // {bytes, address: '127.0.0.1', family: 'IPv4', port: 50752}
    const {address, port, message} = o
    const bytes = await new Promise((resolve, reject) => this.send(message, port, address, (e, b) => !e ? resolve(b) : reject(e))).catch(e => {
      throw Object.assign(e, {fn: `${this.m}.sendMessage`, args: o})
    })
    return Object.assign({bytes}, this.address())
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

  async receivePacket(msg, rinfo) {
    /* {
      msg: <Buffer 61 62 63>,
      rinfo: { address: '127.0.0.1', family: 'IPv4', port: 60457, size: 3 } }
    */
    // TODO implement Observables
    console.log('UdpSocket.receivePacket:', {msg, rinfo})
  }

  async shutdown() {
    const {_resolve} = this._udpSocket
    this.isListen = true
    await new Promise((resolve, reject) => this.close(resolve))
    _resolve()
  }
}

/*
old junk:

  _getPort() {
    return this.bindArg && this.bindArg.port
  }  async send(message) {
    await new Promise((resolve, reject) => super.send(message, this._getPort(), e => !e ? resolve() : reject(e)))
  }

  async bind() {
    const {bindArg, _reject, isShutdown, messageListener} = this
    if (isShutdown) throw new Error(`${this.m} bind after shutdown`)
    await new Promise((resolve, reject) => {
      onError = e => removeListeners(this, e)
      onListening = () => removeListeners(this)
      this.once('error', onError)
      super.bind(bindArg, onListening)

      function removeListeners(socket, e) {
        socket.removeListener('error', onError)
          .removeListener('listening', onListening)
        !e ? resolve() : reject(e)
      }
    })
    this.on('error', _reject)
    this.on('message', messageListener)
  }
*/
