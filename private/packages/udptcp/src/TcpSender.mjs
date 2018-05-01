/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import net from 'net'
const {Socket} = net

export default class TcpSender extends Socket {
  constructor(o) {
    super()
    this._onRejecteds = []
    this._onResolves = []
  }

  async send(o) {
    return Promise.all([
      this.tcpWatch(),
      this._sendEnd(o),
    ])
  }

  async _sendEnd(o) {
    await this.tcpConnect(o)
    return this.tcpEnd(o)
  }

  async tcpConnect(o) {
    const {port, address} = Object(o)
    return new Promise((resolve, reject) => this.connect(port, address, resolve))
  }

  async tcpSend(o) {
    const {message} = Object(o)
    return new Promise((resolve, reject) => this.write(message, resolve))
  }

  async tcpEnd(o) {
    const {message} = Object(o)
    this.end(message)
  }

  async tcpWatch() {
    const {_onRejecteds, _onResolves, _isResolved} = this
    if (_isResolved) return
    return Promise.all([
      new Promise((resolve, reject) => _onRejecteds.push(reject) + _onResolves.push(resolve)),
      this._ensureErrorListener(),
    ])
  }

  _tcpEnsureErrorListener() {
    const {_hasErrorListener, _onRejecteds, _onResolves} = this
    if (_hasErrorListener) return
    this._hasErrorListener = true
    const e = new Promise((resolve, reject) => this.once('close', () => resolve()).on('error', resolve(e)))
    this._isResolved = true
    if (!e) for (let resolve of _onResolves) resolve()
    else for (let reject of _onRejecteds) reject(e)
    this._onRejecteds.length = 0
    this._onResolves.length = 0
  }
}
