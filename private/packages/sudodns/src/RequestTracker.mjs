/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import events from 'events'
const {EventEmitter} = events
import util from 'util'

export default class RequestTracker {
  static timeout = 3e3
  responseListener = this.responseListener.bind(this)

  constructor(o) {
    const {server, port, timeOfDay, emitter, timeout, timeval, name, debug} = o || false
    this.m = String(name || 'Request')
    const {timeout: timeout1} = RequestTracker
    const st = typeof server
    if (!server || st !== 'string') throw new Error(`${this.m} server not non-empty string`)
    if (!(port > 0) || !(port <= 65535)) throw new Error(`${this.m} port number bad`)
    if (!(timeOfDay >= 0)) throw new Error(`${this.m} timeOfDay bad`)
    if (!(emitter instanceof EventEmitter)) throw new Error(`${this.m} emitter not EventEmitter`)
    if (!(timeval > 0)) throw new Error(`${this.m} timeval bad`)
    Object.assign(this, {server, port, timeOfDay, timeval, emitter})
    emitter.on('event', this.responseListener)
    this.timeval0 = Date.now()
    const to = timeout >= 0 ? +timeout : timeout1
    to && (this.timer = setTimeout(this.handleTimeout.bind(this), to))
    debug && (this.debug = true) && console.log(`${this.m} constructor: ${util.inspect(this, {colors: true, depth: null})}`)
  }

  responseListener(o) {
    const {server: server0, port: port0, timeOfDay: timeOfDay0, timeval} = this
    const {server, port, timeOfDay} = o || false
    if (server0 !== server || port0 !== port) return // not a response to this request
    this.shutdown()
    const seconds = (timeOfDay - timeOfDay0)
    const duration = seconds >= 0 ? seconds : seconds + 24 * 60 * 60 // midnight
    this.emitResult('duration', {timeval, server, duration})
  }

  handleTimeout() {
    const {timeval0, timeval, server} = this
    this.shutdown()
    const now = Date.now()
    const duration = now - timeval0
    this.emitResult('timeout', {timeval, server, duration})
  }

  emitResult(event, data) {
    this.emitter.emit(event, data)
  }

  shutdown() {
    const {timer, emitter, responseListener} = this
    timer && clearTimeout(timer)
    emitter.removeListener('event', responseListener)
  }
}
