/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import ConnectionClient from './ConnectionClient'
import {TcpStatus} from './ConnectionServer'

import {setMDebug, classLogger} from 'es2049lib'

import * as rxjs from 'rxjs'
const {Subject} = rxjs

export default class PusherTcpClient {
  subject = new Subject()
  conns = {}

  constructor(o) {
    setMDebug(o, this, 'PusherTcpClient')
    const {address, port} = Object(o)
    Object.assign(this, {address, port})
    this.promise = new Promise((resolve, reject) => Object.assign(this, {resolve, reject}))
    this.next = o => this._fromServer(o).catch(this.reject)
    classLogger(this, PusherTcpClient)
  }

  async subscribe(observer) {
    const {subject} = this
    subject.subscribe(observer)
  }

  async _fromServer({msg, id, status}) {
    const {subject, reject, address, port, conns, debug, m} = this
    let c
    if (status === TcpStatus.OPEN) c = conns[id] = new ConnectionClient({id, subject, onRejected: reject, address, port, deleter: this._deleter, debug, name: m})
    else if (!(c = conns[id])) throw new Error(`${this.m} unknown connection id: ${id} status: ${status} msg: ${msg && msg.length}`)
    return c.fromServer({msg, status})
  }

  _deleter = id => {
    delete this.conns[id]
  }

  error(e) {} // observable server had error
  complete() {} // shutdown client

  async shutdown() {
    const {conns, debug, resolve} = this
    debug && console.log(`${this.m} shutdown connections: ${Object.keys(conns).length}`)
    await Promise.all(Object.values(conns).map(c => c.shutdown()))
    if (Object.keys(conns).length) throw new Error(`${this.m} connections remain after shutdown`)
    resolve()
  }
}
