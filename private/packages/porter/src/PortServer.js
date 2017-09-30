/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import Responder from './Responder'

import {Server} from 'net'

export default class PortServer extends Server {
  constructor(o) {
    super(o)
    const {listener, listen} = o || false
    this.promise = new Promise((resolve, reject) => this.ps = {resolve, reject, listener})
    this.on('connection', this.connectionListener)
      .once('listening', this.listeningListener)
      .once('close', this.closeListener)
      .on('error', this.failureWrapper)
      .setMaxListeners(0)
      .listen({port: 0, host: '127.0.0.1', ...listen})
  }

  async _listening() {
    const {address, port} = this.address()
    this._send('listening', `${address}:${port}`)
  }
  listeningListener = () => this._listening().catch(this.failureWrapper)

  _send(event, ...args) {
    const {ps: {listener}} = this
    if (listener) listener.invoke(event, ...args)
  }

  async _createConnection(socket) {
    return new Responder({socket, server: this, errorHandler: this.failureWrapper})
  }
  connectionListener = socket => this._createConnection(socket).catch(this.failureWrapper)

  async shutdown() {
    this.emit('shutdown') // closes all connections from near side
    return new Promise((resolve, reject) => this.close(e => !e ? resolve() : reject(e)))
  }

  async _close() {
    this.removeListener('connection', this.connectionListener)
      .removeListener('listening', this.listeningListener)
    this._send('close', 'PortServer')
  }
  closeListener = (...args) => this._close(...args).catch(this.failureWrapper)

  async _failure(e) {
    console.error('PortServer.failure:')
    console.error(e)
    console.error(new Error('PortServer.failure'))
    await this.shutdown()
    throw e
  }
  failureWrapper = e => this._failure(e).catch(this.reject)

  _defaultListener(event, ...args) {
    const {listener} = this
    if (listener && listener.isSet()) listener.invoke(event, ...args)
    else {
      const s = `PortServer.listener event: ${event}` + (args.length
        ? ` args: ${args.length}: ${args.join(' ')}`
        : '')
      console.log(s)
    }
  }
}
