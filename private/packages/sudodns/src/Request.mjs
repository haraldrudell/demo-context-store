/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import events from 'events'
const {EventEmitter} = events

export default class Request {
  static timeout = 3e3
  handleTimeout = this.handleTimeout.bind(this)
  event = this.event.bind(this)

  constructor(o) {
    const {server, port, t, emitter} = o || false
    this.m = 'Request'
    const {timeout} = Request
    if (typeof t !== 'number') throw new Error(`${this.m} t not number`)
    const st = typeof server
    if (!server || st !== 'string') throw new Error(`${this.m} server not string`)
    if (!(emitter instanceof EventEmitter)) throw new Error(`${this.m} emitter not EventEmitter`)
    Object.assign(this, {server, port, t, emitter})
    emitter.on('event', this.event)
    this.tt0 = Date.now()
    this.timer = setTimeout(this.handleTimeout, timeout)
  }

  event(isRequest, s, p, t) {
    const {server, port, t: t0} = this
    //console.log('Requestevent', {isRequest, s, p, t, server, port, t0})
    if (s !== server || p !== port) return // not the same local port or remote server
    this.shutdown()
    if (isRequest) return

    const dt = (t - t0)
    const duration = dt >= 0 ? dt : dt + 24 * 60 * 60 // midnight
    const durt = duration.toFixed(6)
    console.log(`Request duration: ${durt} s ${server}`)
  }

  handleTimeout() {
    const {tt0} = this
    this.shutdown()
    const duration = (Date.now() - tt0) / 1e3
    console.log(`Request timeout after: ${duration} s`)
  }

  shutdown() {
    const {timer, emitter} = this
    clearTimeout(timer)
    emitter.removeListener('event', this.event)
  }
}
