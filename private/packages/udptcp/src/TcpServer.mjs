/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import {setMDebug, classLogger} from 'es2049lib'

import net from 'net'
const {Server} = net

export default class TcpServer extends Server {
  static anyPort = 0
  connectionId = 0

  static async getTcpServer(o) {
    try {
      return new TcpServer(o)
    } catch (e) {
      throw Object.assign(e, {fn: 'TcpServer.constructor', args: o})
    }
  }

  constructor(o) {
    super()
    const {port: port0, address: host, debug} = setMDebug(o, this, 'TcpServer')
    const {anyPort} = TcpServer
    const port = port0 != null ? port0 : anyPort
    const tcp = this._tcpServer = {_listenArg: {port, host}}
    this.promise = new Promise((resolve, reject) => Object.assign(tcp, {_resolve: resolve, _reject: reject}))
    this.setConnectOnRejected(tcp._reject)
    classLogger(this, TcpServer, {_tcpServer: tcp})
  }

  async listen() {
    const {_listenArg, listenProhibited, _reject} = this._tcpServer
    const fName = `${this.m}.listen`
    const assignProperties = e => Object.assign(e, {fName, ..._listenArg})
    if (listenProhibited) throw assignProperties(new Error(`${fName}: already listening or shutdown`))
    await new Promise((resolve, reject) => {
      const cleanup = e => this.removeListener('error', cleanup).on('error', _reject) + (!e ? resolve() : reject(assignProperties(e)))
      this.on('error', cleanup)
      //super.listen(_listenArg, cleanup) // https://github.com/babel/babel/issues/3930
      Server.prototype.listen.call(this, _listenArg, cleanup)
    })
    this.listenProhibited = true
    console.log(`${this.m} listening:`, _listenArg)
    return this.address()
  }

  setConnectOnRejected(onRejected, isShutdown) {
    const {_tcpServer} = this
    const {connectListener, connectOnRejected: onRejected0} = _tcpServer
    if (typeof onRejected !== 'function' && !isShutdown) throw new Error(`${this.m} connectOnRejected not function`)
    _tcpServer.connectOnRejected = onRejected
    if (connectListener) this.removeListener('connection', connectListener)
    if (onRejected) this.on('connection', _tcpServer.connectListener = socket => this._handleConnect(socket).catch(onRejected))
    else _tcpServer.connectListener = null
    return onRejected0
  }

  async _handleConnect(socket) {
    const {_tcpServer} = this
    const {connectOnRejected} = _tcpServer
    const address = socket.remoteAddress
    const port = socket.remotePort
    const id = this.connectionId++
    socket.on('error', e => this.connectOnRejected(Object.assign(e, {TcpServer: {address, port, id}})))

    const {host: a, port: p} = _tcpServer._listenArg
    console.log(`${this.m} connect from: ${address}:${port} to ${a}:${p}`)

    const result = {
      rinfo: {address, port},
      socket,
      server: this,
      id,
      onRejected: connectOnRejected,
    }
    this.emit('message', result)
    return result
  }

  async shutdown() {
    const {debug, _tcpServer: {_resolve}} = this
    debug && console.log(`${this.m} tcp server shutdown`)
    this._tcpServer.listenProhibited = true
    await new Promise((resolve, reject) => this.close(resolve))
    this.setConnectOnRejected(null, true)
    this.unref()
    _resolve()
    debug && console.log(`${this.m} tcp server shutdown DEBUG`)
  }
}
