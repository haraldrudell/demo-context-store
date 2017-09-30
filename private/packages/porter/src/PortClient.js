/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import TcpClient from './TcpClient'

import {EventEmitter} from 'events'

export default class PortClient {
  static number = 0
  static connectionsToUse = 2000

  constructor(o) {
    const emitter = new EventEmitter().setMaxListeners(0)
    this.o = {...o, emitter, errorHandler: this.errorWrapper}
    this.promise = new Promise((resolve, reject) => Object.assign(this, {resolve, reject}))
    emitter.once('shutdown', this.shutdownListener)
    process.nextTick(this.runWrapper)
  }

  async run() {
    while (PortClient.number < PortClient.connectionsToUse) {
      new TcpClient(this.o)
      PortClient.number++
    }
  }
  runWrapper = () => this.run().catch(this.errorWrapper)

  async shutdown() {
    console.log('PortClient.shutdown')
    clearInterval(this.interval)
    this.o = null
    if (!this.isError) this.resolve()
  }
  shutdownListener = () => this.shutdown().catch(this.errorWrapper)

  async errorHandler(e) {
    this.isError = true
    console.error('\nPortClient.errorHandler:')
    console.error(e)
    console.error(new Error('PortClient.errorHandler'))
    const {o} = this
    if (o) o.emitter.emit('shutdown')
    throw e
  }
  errorWrapper = e => this.errorHandler(e).catch(this.reject)
}
