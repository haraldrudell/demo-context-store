/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import UdpSocket from './UdpSocket'

import {classLogger, Queue} from 'es2049lib'

import * as rxjs from 'rxjs'
const {Subject} = rxjs

export default class PusherUdp extends UdpSocket {
  _udpPusher = {
    messageListener: o => this._forwardPacket(o).catch(this._udpSocket._reject),
    subject: new Subject(),
  }
  next = m => this.handleResponse(m).catch(this._udpSocket._reject)

  constructor(o) {
    super(o)
    this.on('message', this._udpPusher.messageListener)
    this.queue = new Queue()
    classLogger(this, PusherUdp, this._udpPusher)
  }

  async subscribe(observer) { // a client requests packets from this server
    const {debug, _udpPusher: {subject}} = this
    subject.subscribe(observer)
    const a = await this.listen()
    debug && console.log(`${this.m} listening udp-${a.address}:${a.port}`)
  }

  async handleResponse(o) { // from downstream transports
    return this.queue.submit(() => this._handleResponse(o))
  }

  async _handleResponse({msg, rinfo}) { // from downstream transports
    if (msg) this.sendMessage({message: msg})
  }

  async _forwardPacket({msg, rinfo}) { // 'message' to subscribing transports
    this._udpPusher.subject.next({msg, port: rinfo.port})
  }

  error(e) {} // observable server had error
  complete() {} // shutdown client

  async shutdown() {
    //await super.shutdown()
    await UdpSocket.prototype.shutdown.call(this)
    //this._subject.DO SOMETHING
  }
}
