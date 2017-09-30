/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/

import {Socket} from 'net'

export default class TcpClient extends Socket {
  static number = 0
  static state = {}
  static tim = setInterval(TcpClient.status, 1e3)
  static pendingConnects = []
  state = {}
  static maxOpening = 50

  constructor(o) {
    super()
    this.update('constructed')
    this.no = TcpClient.number++
    const {emitter, errorHandler} = o || false
    const et = emitter && typeof emitter.emit
    if (et !== 'function') throw new Error(`TcpClient options.emitter.emit not function: ${et}`)
    const eh = typeof errorHandler
    if (eh !== 'function') throw new Error(`TcpClient options.errorHandler not function: ${eh}`)
    emitter.once('shutdown', this.shutdownListener)
    Object.assign(this, {emitter, errorHandler})
    const timeout = o.timeout > 0 ? Number(o.timeout) : 15000
    this.setTimeout(timeout)
      .on('data', this.dataListener)
      .once('timeout', this.timeoutListener)
      .once('close', this.closeListener)
      .on('error', this.errorListener)
      .setEncoding('utf8')
    if (this.canConnectMore()) this._innerConnect(o)
    else {
      this.o = o
      TcpClient.pendingConnects.push(this.connectWrapper)
    }
  }

  canConnectMore() {
    const pendingCount =
      (TcpClient.state.connecting || 0) -
      (TcpClient.state.data || 0)
    return pendingCount < TcpClient.maxOpening
  }

  connectMore() {
    const list = TcpClient.pendingConnects
    while (list.length) {
      const fn = list.shift()
      fn()
      if (!this.canConnectMore()) break
    }
  }

  async doConnect() {
    const o = this.o
    delete this.o
    this._innerConnect(o)
  }
  _innerConnect(o) {
    this.update('connecting')
    this.connect(o)
  }
  connectWrapper = () => this.doConnect().catch(this.errorListener)

  update(event) {
    if (this.state[event] === undefined) {
      this.state[event] = 1
      if (TcpClient.state[event] === undefined) {
        TcpClient.state[event] = 1
        if (event === 'errored') TcpClient.status()
      } else TcpClient.state[event]++
    } else this.state[event]++
  }

  instrument() {
    const emitx = this.emit
    this.emit = (...args) => {
      let aa = args[0]
      if (aa === 'data') {
        const s = args[1]
        console.log('s', typeof s, s)
        // skip newlines at end
        let i1 = s.length - 1
        while (i1 && s[i1] === '\n') i1--
        const s1 = s.substring(0, i1)

        let i0 = s1.lastIndexOf('\n') + 1
        aa += ` ${s1.substring(i0)}`
      } else aa = args.join(' ')
      console.log(`event client ${this.no}: ${aa}`)
      emitx.call(this, ...args)
    }
  }

  async data(d) {
    if (TcpClient.pendingConnects.length && this.canConnectMore()) this.connectMore()
    this.update('data')
    this.lastData = Date.now()
    //console.log(`TcpSocket.data: ${this.no}: ${d}`)
  }
  dataListener = d => this.data(d).catch(this.errorListener)

  async timeout() {
    this.update('timeout')
    let d
    if (!this.lastData) d = 'never'
    else d = (Date.now() - this.lastData) / 1e3 + 's'
    console.log(`client ${this.no} timeout: ${d}`)
    this.emitter.emit('shutdown')
  }
  timeoutListener = () => this.timeout().catch(this.errorListener)

  async shutdown() {
    this.update('shutdown')
    this.end()
  }
  shutdownListener = () => this.shutdown().catch(this.errorListener)

  async close() {
    this.update('closed')
    this.removeListener('data', this.dataListener)
      .removeListener('timeout', this.timeoutListener)
  }
  closeListener = () => this.close().catch(this.errorListener)

  async _errorHandler(e) {
    this.update('errored')
    console.error('\nTcpClient.errorHandler')
    this.removeListener('close', this.closeListener)
    await this.close()
    this.destroy()
    this.update('thrown')
    throw e
  }
  errorListener = e => this._errorHandler(e).catch(this.errorHandler)

  static status() {
    let s = ''
    for (let e of Object.keys(TcpClient.state)) s += ` ${e}: ${TcpClient.state[e]}`
    console.log(s)
  }
}
