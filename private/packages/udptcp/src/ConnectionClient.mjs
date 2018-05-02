/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import TcpClient from './TcpClient'
import {TcpStatus} from './ConnectionServer'
import {setMDebug, classLogger, Queue} from 'es2049lib'

export default class ConnectionClient {
  constructor(o) {
    const {id, onRejected, address, port, deleter} = setMDebug(o, this, 'ConnectionClient')
    Object.assign(this, {id, onRejected, deleter})
    this.connArg = {address, port}
    this.queue = new Queue()
    classLogger(this, ConnectionClient, {tcpClientConnectionId: id})
  }

  async fromServer(o) {
    return this.queue.submit(() => this._fromServer(o))
  }

  async _fromServer({msg, status}) {
    const {onRejected, connArg, debug, id, m} = this
    let {tcpClient} = this
    if (msg) {
      if (!tcpClient) {
        tcpClient = this.tcpClient = new TcpClient({debug, name: m})
        tcpClient.tcpWatch().catch(onRejected)
        await tcpClient.tcpConnect(connArg)
      }
      await tcpClient.tcpSend({msg})
    }
    if (status === TcpStatus.CLOSE) {
      debug && console.log(`${this.m} observed CLOSE id: ${id} ${!!tcpClient}`)
      this.isClose = true
      await tcpClient.tcpEnd()
      await this.shutdown()
    }
  }

  async shutdown() {
    const {tcpClient, id, connections, endListener, dataListener, debug, isClose, deleter} = this
    debug && !isClose && console.log(`${this.m} shutdown while OPEN ${id} ${!!tcpClient}`)
    deleter(id)
  }
}
