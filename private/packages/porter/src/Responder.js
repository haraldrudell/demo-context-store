/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
export default class Responder {
  constructor({server, socket, errorHandler}) {
    Object.assign(this, {server, socket, errorHandler})
    server.once('shutdown', () => this.shutdown().catch(this.errorWrapper))
    socket.on('data', this.dataListener) // TODO remove
      .once('close', this.closeListener)
      .on('error', e => this.error(e).catch(this.errorWrapper))
      .setEncoding('utf8')
    this.count = 0
    this.timer = setInterval(this.sendWrapper, 1e3)
    process.nextTick(this.sendWrapper)
  }

  async send() {
    const {socket} = this
    socket.write(`${++this.count}\n`)
  }
  sendWrapper = () => this.send().catch(this.errorWrapper)

  async data(d) {
    console.log(`data: ${d}`)
  }
  dataListener = d => this.data(d).catch(this.errorWrapper)

  async shutdown() {
    const {socket} = this
    socket.end()
  }
  shutdownListener = () => this.shutdown().catch(this.errorWrapper)

  async close() {
    const {server, socket, shutdownListener, dataListener, timer} = this
    clearInterval(timer)
    server.removeListener('shutdown', shutdownListener)
    socket.removeListener('data', dataListener)
  }
  closeListener = () => this.close().catch(this.errorWrapper)

  async error(e) {
    console.error('Socket.error:', e, new Error('Socket.error'))
    const {socket, closeListener} = this
    socket.removeListener('close', closeListener)
    await this.close()
    socket.destroy()
    this.errorHandler(e)
  }
  errorWrapper = e => this.error(e)
}
