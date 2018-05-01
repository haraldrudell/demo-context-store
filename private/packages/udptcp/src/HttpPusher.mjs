/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import HttpServer from './HttpServer'

import {classLogger} from 'es2049lib'

import * as rxjs from 'rxjs'
const {Subject} = rxjs

export default class HttpPusher extends HttpServer {
  _messageListener = o => this._forwardPacket(o).catch(this._HttpSocket._reject)
  _subject = new Subject()
  next = buffer => this.sendMessage({message: buffer}).catch(this._HttpSocket._reject)

  constructor(o) {
    super(o)
    this.on('message', this._messageListener)
    classLogger(this, HttpPusher)
  }

  async subscribe(observer) { // a client requests packets from this server
    const {debug} = this
    this._subject.subscribe(observer)
    const a = await this.listen()
    debug && console.log(`${this.m} listening Http-${a.address}:${a.port}`)
  }

  async _forwardPacket({msg, rinfo}) {
    this._subject.next(msg)
  }

  error(e) {} // observable server had error
  complete() {} // shutdown client

  async shutdown() {
    await super.shutdown()
    this.removeListener('message', this._messageListener)
    //this._subject.DO SOMETHING
  }
}
