/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import {setMDebug, classLogger} from 'es2049lib'

import net from 'net'
const {Socket} = net

export default class TcpClient extends Socket {
  constructor(o) {
    super()
    setMDebug(o, this, 'TcpClient')
    this._onRejecteds = []
    this._onResolves = []
    classLogger(this, TcpClient, {class: 'TcpClient'})
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
    const {msg} = Object(o)
    return new Promise((resolve, reject) => this.write(msg, resolve)).catch(e => {
      throw this._addProps(e, {method: 'tcpSend', api: 'net.Socket.write'})
    })
  }

  async tcpEnd(o) {
    const {msg} = Object(o)
    this.end(msg)
  }

  tcpDestroy() {
    this.destroy()
  }

  async tcpWatch() {
    const {_onRejecteds, _onResolves, _isResolved} = this
    if (_isResolved) return
    return Promise.all([
      new Promise((resolve, reject) => _onRejecteds.push(reject) + _onResolves.push(resolve)),
      this._ensureErrorListener(),
    ])
  }

  async _ensureErrorListener() {
    if (this._hasErrorListener) return
    this._hasErrorListener = true
    const e = await new Promise((resolve, reject) => this.once('close', () => resolve()).on('error', resolve))
    this._isResolved = true
    const {_onRejecteds, _onResolves, m, debug} = this
    if (!e) for (let resolve of _onResolves) resolve()
    else {
      Object.assign(e, {TcpClient: {api: 'Socket.emit', name: m}})
      debug && console.log(`${this.m}._ensureErrorListener`, e)
      for (let reject of _onRejecteds) reject(e)
    }
    this._onRejecteds.length = 0
    this._onResolves.length = 0
  }

  _addProps(e, props) {
    Object.assign(e, {TcpClient: {props, name: this.m}})
    this.debug && console.log(`${this.m}._addProps`, e)
    return e
  }
}
