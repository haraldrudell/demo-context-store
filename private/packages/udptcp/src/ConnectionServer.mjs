/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import {setMDebug, classLogger, Queue} from 'es2049lib'

export const TcpStatus = {
  OPEN: 1,
  CLOSE: 2,
}

export default class ConnectionServer {
  constructor(o) {
    const {id, socket, onRejected, subject, deleter} = setMDebug(o, this, 'ConnectionServer')
    const dataListener = d => this._forwardDataFromClient(d).catch(onRejected)
    const endListener = () => this._sendClientClose().catch(onRejected)
    const shutdownListener = () => this.shutdown().catch(onRejected)
    Object.assign(this, {id, socket, subject, dataListener, endListener, shutdownListener, deleter})
    socket.on('data', dataListener).once('end', endListener).once('close', this.shutdownListener).once('error', shutdownListener)
    this.queue = new Queue()
    classLogger(this, ConnectionServer, {tcpServerConnectionId: id})
  }

  openTransport() { // to downstream transports
    const {subject, id, debug} = this
    this.openedTransp = true
    debug && console.log(`${this.m} relaying OPEN for id: ${id}`)
    subject.next({id, status: TcpStatus.OPEN})
  }

  async handleResponse(o) { // from downstream transports
    return this.queue.submit(() => this._handleResponse(o))
  }

  async _handleResponse({msg, status}) { // from downstream transports
    const {socket, debug, endedSocket} = this
    if (msg) {
      if (endedSocket) throw new Error(`${this.m} data from reansport after ending socket`)
      await new Promise((resolve, reject) => this.write(msg, resolve))
    }
    if (status === TcpStatus.CLOSE) {
      debug && console.log(`${this.m} observed CLOSE ${id}`)
      this._endSocket()
    }
  }

  async shutdown() {
    const {endListener, dataListener, shutdownListener, socket, openedTransp, closedTransp, debug, id, deleter} = this
    debug && console.log(`${this.m} shutdown ${id}`)
    if (openedTransp && !closedTransp) {
      debug && console.log(`${this.m} shutdown while OPEN ${id}`)
      this._closeTransport()
    }
    console.log(`${this.m} socket.destroy ${this.id} DEBUG`)
    socket.removeListener('data', dataListener).removeListener('end', endListener).removeListener('close', shutdownListener).removeListener('error', shutdownListener)
      .destroy()
    deleter(id)
    debug && console.log(`${this.m} destroyed: ${id}`)
  }

  async _forwardDataFromClient(msg) { // 'data' to downstream transports
    const {subject, id} = this
    subject.next({id, msg})
  }

  async _sendClientClose() { // 'end' to downstream transports
    const {openedTransp} = this
    openedTransp && this._closeTransport()
    this._endSocket()
  }

  _closeTransport() {
    const {subject, id, debug} = this
    this.closedTransp = true
    debug && console.log(`${this.m} relaying CLOSE ${id}`)
    subject.next({id, status: TcpStatus.CLOSE})
  }

  _endSocket() {
    this.endedSocket = true
    console.log(`${this.m} socket.end ${this.id} DEBUG`)
    this.socket.end()
  }
}
