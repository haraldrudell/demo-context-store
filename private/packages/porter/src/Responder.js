/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
export default class Responder {
  static state = {}
  static tim = setInterval(Responder.status, 1e3)
  static s0
  state = {}
  count = 0

  constructor({server, socket, errorHandler}) {
    Object.assign(this, {server, socket, errorHandler})
    this.update('constructed')
    server.once('shutdown', this.shutdownListener)
    socket.on('data', this.dataListener)
      .once('close', this.closeListener)
      .on('error', this.errorWrapper)
      .setEncoding('utf8')
    this.manageTimer(this.sendWrapper)
    process.nextTick(this.sendWrapper)
  }

  dataListener = d => 1

  async send() {
    const {socket} = this
    if (!socket._writableState.ended) socket.write(`${++this.count}\n`)
  }
  sendWrapper = () => this.send().catch(this.errorWrapper)

  async shutdown() {
    this.update('shutdown')
    this.manageTimer()
    const {socket} = this
    socket.end()
  }
  shutdownListener = () => this.shutdown().catch(this.errorWrapper)

  async close() {
    this.update('closed')
    this.manageTimer()
    const {server, socket, shutdownListener, dataListener} = this
    socket.removeListener('data', this.dataListener)
    server.removeListener('shutdown', shutdownListener)
  }
  closeListener = () => this.close().catch(this.errorWrapper)

  manageTimer(fn) {
    const {timer} = this
    if (timer) {
      this.timer = null
      clearInterval(timer)
    }
    if (fn) this.timer = setInterval(fn, 1e3)
  }

  async error(e) {
    const isError = e.code !== 'ECONNRESET'
    this.update(isError ? 'errored' : 'reset')
    if (isError) console.error('\nSocket.error:')
    const {socket, closeListener} = this
    socket.removeListener('close', closeListener)
    await this.close()
    socket.destroy()
    if (isError) throw e
  }
  errorWrapper = e => this.error(e).catch(this.errorHandler)

  update(event) {
    const v = this.state[event] === undefined ? this.state[event] = 1 : ++this.state[event]
    if (v === 1) {
      const s = Responder.state[event] === undefined ? Responder.state[event] = 1 : ++Responder.state[event]
      if (s === 1 && event === 'errored') Responder.status()
    }
  }

  static status() {
    let s = ''
    for (let e of Object.keys(Responder.state)) s += ` ${e}: ${Responder.state[e]}`
    if (s !== Responder.s0) console.log(Responder.s0 = s)
  }
}
