/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import {setMDebug, classLogger} from 'es2049lib'

import net from 'net'
const {Server, Socket} = net

export default class TcpServer extends Server {
  static anyPort = 0

  static async getTcpSocket(o) {
    try {
      return new TcpServer(o)
    } catch (e) {
      throw Object.assign(e, {fn: 'TcpSocket.constructor', args: o})
    }
  }

  constructor(o) {
    super()
    const {port: port0, address: host, debug} = setMDebug(o, this, 'TcpSocket')
    const {anyPort} = TcpServer
    const port = port0 != null ? port0 : anyPort
    const tcp = this._tcpServer = {_listenArg: {port, host}}
    this.promise = new Promise((resolve, reject) => Object.assign(tcp, {_resolve: resolve, _reject: reject}))
    this.setConnectOnRejected(tcp._reject)
    debug && this.constructor === TcpServer && console.log('TcpServer', tcp)

    this.emit0 = this.emit
    this.emit = (...args) => console.log(`EVENT ${args[0]}`, this._tcpServer._listenArg) + this.emit0(...args)
  }

  async sendMessage(o) {
    const {rinfo, _listenArg: {host: a, port: p}} = this._tcpServer
    const {message, port: op, address: oa} = Object(o)
    const {port: rp, address: ra} = Object(rinfo)
    const useO = op && oa
    const port = useO ? op : rp
    const address = useO ? oa : ra
    const marker = `${address}:${port} listener ${a}:${p}`
    const fName = `${this.m}.sendMessage`
    if (!message) throw new Error(`${fName} message missing ${marker}`)
    if (!port || !address) throw new Error(`${fName} no port or address ${marker}`)
    console.log(`${fName} ${marker}`)

    const socket = new Socket()
    await new Promise((resolve, reject) => socket.connect(port, address, resolve))
    await new Promise((resolve, reject) => {
      socket.once('close', cleanup).once('error', cleanup)
      socket.end(message)

      function cleanup(e) {
        socket.removeListener('close', cleanup).removeListener('error', cleanup)
        !e ? resolve() : reject(e)
      }
    })
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
    if (onRejected) {
      this.on('connection', _tcpServer.connectListener = socket => this._handleConnect(socket).catch(onRejected))
      console.log(`${this.m} onConnect:`, _tcpServer._listenArg)
    }
    else _tcpServer.connectListener = null
    return onRejected0
  }

  async _handleConnect(socket) {
    const {_tcpServer} = this
    const {connectOnRejected} = _tcpServer
    const address = socket.remoteAddress
    const port = socket.remotePort
    socket.on('error', e => this.connectOnRejected(Object.assign(e, {TcpServer: {address, port}})))

    const rinfo = _tcpServer.rinfo = {address, port}

    const {host: a, port: p} = _tcpServer._listenArg
    console.log(`${this.m} connect from: ${address}:${port} to ${a}:${p}`)

    const buffers = []
    await new Promise((resolve, reject) => socket.on('data', d => buffers.push(d)).once('end', resolve))
    const msg = !buffers.length ? new Buffer() : buffers.length === 1 ? buffers[0] : Buffer.concat(...buffers)
    this.emit('message', {msg, rinfo, socket, this})
  }

  async shutdown() {
    const {_resolve} = this._tcpServer
    this._tcpServer.listenProhibited = true
    await new Promise((resolve, reject) => this.close(resolve))
    this.setConnectOnRejected(null, true)
    _resolve()
  }
}
