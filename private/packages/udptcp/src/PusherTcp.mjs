/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import TcpServer from './TcpServer'
import ConnectionServer from './ConnectionServer'

import {classLogger} from 'es2049lib'

import * as rxjs from 'rxjs'
const {Subject} = rxjs

export default class PusherTcp extends TcpServer {
  _tcpPusher = {
    subject: new Subject(),
    conns: {},
  }
  next = o => this._handleResponse(o).catch(this._tcpServer.connectOnRejected)

  constructor(o) {
    super(o)
    classLogger(this, PusherTcp, {_tcpPusher: this._tcpPusher, _tcpServer: this._tcpServer})
  }

  async subscribe(observer) { // a remote pusher requesting to receive packets from this pusher
    const {debug, listenProhibited, _tcpPusher: {subject}} = this
    subject.subscribe(observer)
    if (!listenProhibited) await this.listen()
  }

  async _handleConnect(socket) {
    const {debug, m, _tcpPusher: {subject, conns}} = this
    // const {msg, rinfo} = await super._handleConnect(socket) https://github.com/babel/babel/issues/3930
    const {id, onRejected} = await TcpServer.prototype._handleConnect.call(this, socket)
    return (conns[id] = new ConnectionServer({id, socket, onRejected, subject, deleter: this._deleteConnection, debug, name: m})).openTransport()
  }

  _deleteConnection = id => {
    delete this._tcpPusher.conns[id]
  }

  async _handleResponse({msg, id, status}) {
    const {conns} = this._tcpPusher
    const c = conns[id]
    if (!c) throw new Error(`${this.m} unknown connection id: ${id}`)
    c.handleResponse({msg, status})
  }

  error(e) {} // observable server had error
  complete() {} // shutdown client

  async shutdown() {
    const {debug, _tcpPusher: {conns}} = this
    debug && console.log(`${this.m} shutdown connections: ${Object.keys(conns).length}`)
    //await super.shutdown() https://github.com/babel/babel/issues/3930
    await TcpServer.prototype.shutdown.call(this)
    await Promise.all(Object.values(conns).map(c => c.shutdown()))
    if (Object.keys(conns).length) throw new Error(`${this.m} corrupt connections`)
  }
}
