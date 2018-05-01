/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import {setMDebug, classLogger} from 'es2049lib'

import http from 'http'
const {Server} = http

export default class HttpServer extends Server {
  static anyPort = 0
  _connectionListener = socket => this._handleConnect(socket).catch(this._HttpSocket._reject)

  static async getHttpSocket(o) {
    try {
      return new HttpServer(o)
    } catch (e) {
      throw Object.assign(e, {fn: 'HttpSocket.constructor', args: o})
    }
  }

  constructor(o) {
    super()
    const {port: port0, address: host} = setMDebug(o, this, 'HttpSocket')
    const {anyPort} = HttpServer
    const port = port0 != null ? port0 : anyPort
    const Http = this._HttpSocket = {_listenArg: {port, host}}
    this.promise = new Promise((resolve, reject) => Object.assign(Http, {_resolve: resolve, _reject: reject}))
    classLogger(this, HttpServer)
  }

  async sendMessage(o) {
    const {_socket} = this
    if (_socket) {
      //socket.
    }
  }

  async listen() {
    const {_listenArg, listenProhibited, _reject} = this._HttpSocket
    const fn = `${this.m}.listen`
    const assignProperties = e => Object.assign(e, {fn, ..._listenArg})
    if (listenProhibited) throw assignProperties(new Error(`${fn}: already listening or shutdown`))
    await new Promise((resolve, reject) => {
      const cleanup = e => this.removeListener('error', cleanup).on('error', _reject) + (!e ? resolve() : reject(assignProperties(e)))
      this.on('error', cleanup)
      super.listen(_listenArg, cleanup)
    })
    this.listenProhibited = true
    return this.address()
  }

  async _handleConnect(socket) {
    this._socket = socket

  }

  async shutdown() {
    const {_resolve} = this._HttpSocket
    this.listenProhibited = true
    await new Promise((resolve, reject) => this.close(resolve))
    _resolve()
  }
}
