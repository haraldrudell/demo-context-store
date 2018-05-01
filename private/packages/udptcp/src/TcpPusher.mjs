/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import TcpServer from './TcpServer'

import {classLogger} from 'es2049lib'

import * as rxjs from 'rxjs'
const {Subject} = rxjs

export default class TcpPusher extends TcpServer {
  _messageListener = o => this._forwardPacket(o).catch(this._tcpServer._reject)
  _subject = new Subject()
  next = buffer => this.sendMessage({message: buffer}).catch(this._tcpServer._reject)

  constructor(o) {
    super(o)
    this.on('message', this._messageListener)
    classLogger(this, TcpPusher)
  }

  async subscribe(observer) { // a client requests packets from this server
    const {debug} = this
    this._subject.subscribe(observer)
    const a = await this.listen()
    debug && console.log(`${this.m} listening tcp-${a.address}:${a.port}`)
  }

  async _forwardPacket({msg, rinfo}) {
    this._subject.next(msg)
  }

  error(e) {} // observable server had error
  complete() {} // shutdown client

  async shutdown() {
    //await super.shutdown() https://github.com/babel/babel/issues/3930
    await TcpServer.prototype.shutdown.call(this)
    this.removeListener('message', this._messageListener)
    //this._subject.DO SOMETHING to shutdown subject
  }
}
