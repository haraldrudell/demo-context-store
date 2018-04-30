/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import {Socket} from 'dgram'

export default class UdpSocket extends Socket {
  static family = 'udp4'

  constructor(o) {
    super(UdpSocket.family)
    this.m = 'Udp4Server'
    const {port, host: address} = Object(o)
    this.bindArg = {port, address}
    this.promise = new Promise((resolve, reject) => (this._resolve = resolve) + (this._reject = reject))
    this.messageListener = (msg, rinfo) => this.message(msg, rinfo).catch(_reject)
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

  async message(msg, rinfo) {
    console.log('Udp4Server msg:', msg, 'rinfo:', rinfo)
  }

  async send(message) {
    await new Promise((resolve, reject) => super.send(message, this._getPort(), e => !e ? resolve() : reject(e)))
  }

  async shutdown() {
    const {isShutdown, _resolve, promise} = this
    if (!isShutdown) {
      this.isShutdown = true
      await new Promise((resolve, reject) => this.close(resolve))
      _resolve()
    }
    return promise
  }

  _getPort() {
    return this.bindArg && this.bindArg.port
  }
}
