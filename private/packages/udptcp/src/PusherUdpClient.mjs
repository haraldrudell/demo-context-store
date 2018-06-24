/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import UdpSocket from './UdpSocket'

import {classLogger} from 'es2049lib'

import * as rxjs from 'rxjs'
const {Subject} = rxjs

export default class PusherUdpClient extends UdpSocket {
  _udpPusher = {
    messageListener: o => this._forwardPacket(o).catch(this._udpSocket._reject),
    subject: new Subject(),
  }
  next = buffer => this.sendMessage({message: buffer}).catch(this._udpSocket._reject)

  constructor(o) {
    super(o)
    this.on('message', this._udpPusher.messageListener)
    classLogger(this, PusherUdpClient, this._udpPusher)
  }

  async subscribe(observer) { // a client requests packets from this server
    const {debug, _udpPusher: {subject}} = this
    subject.subscribe(observer)
    const a = await this.listen()
    debug && console.log(`${this.m} listening udp-${a.address}:${a.port}`)
  }

  async _forwardPacket({msg, rinfo}) {
    this._udpPusher.subject.next(msg)
  }

  error(e) {} // observable server had error
  complete() {} // shutdown client

  async shutdown() {
    //await super.shutdown()
    await UdpSocket.prototype.shutdown.call(this)
    //this._subject.DO SOMETHING
  }
}
