/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import UdpSocket from './UdpSocket'

import util from 'util'
import dgram from 'dgram'

/*
a direct {Socket} import: SyntaxError: The requested module does not provide an export named 'Socket'
this is because dgram is CommonJS
*/
const {Socket} = dgram

export default class Tester {
  constructor() {
    this.m = 'Tester'
    this.onRejected = this.onRejected.bind(this) // Node.js v9.10.1 does not have @bound annotation
    this.onSocketResolved = this.onSocketResolved.bind(this)
    this.onSocketError = this.onSocketError.bind(this)
    this.udp4 = 'udp4' // use ip4 for testing
    this.message = 'abc' // sample message for testing
  }

  async test(o) {
    const {message} = this
    console.log(`${this.m}.test invoked`)

    // display socket instance
    // TODO remove comment this.displayInstance()

    // instantiate async socket
    const udpSocket = this.udpSocket = this.logEvents(await UdpSocket.getUdpSocket())
    udpSocket.promise.then(this.onSocketResolved).catch(this.onSocketError).catch(this.onRejected) // ensure handling of socket error events

    // start socket server
    const {port, address} = await udpSocket.listen()
    console.log(`${this.m}.test: Listening on: ${address}:${port}`)

    // send message to socket server
    console.log(`${this.m}.test: Sending '${message}' to: ${address}:${port}`)
    const r = await this.sendMessage({port, address, message: new Buffer(message)})
    console.log(`${this.m}.test: sent ${r.bytes} bytes from: ${r.address}:${r.port}`)

    console.log(`${this.m}.test: waiting 1 s…`)
    await new Promise((resolve, reject) => setTimeout(resolve, 1e3))

    await udpSocket.shutdown()
    console.log(`${this.m}.test: completed`)
  }

  logEvents(eventEmitter) {
    if (typeof Object(eventEmitter).emit === 'function') {
      const {emit} = eventEmitter
      const invokeEmit = emit.bind(eventEmitter)
      eventEmitter.emit = (...args) => {
        console.log(`${this.m}.logEvents: ${args[0]} argument count: ${args.length - 1}`)
        invokeEmit(...args)
      }
    }
    return eventEmitter
  }

  async sendMessage({port, address, message}) {
    const socket = new UdpSocket()
    const result = await socket.sendMessage({port, address, message})
    await socket.shutdown()
    return result
  }

  displayInstance() {
    const {udp4} = this
    console.log(`${this.m}.displayInstance:`)
    const socket = new Socket(udp4)
    console.log(`dgram.Socket instance: ${util.inspect(socket, {colors: true})}`)
    console.log(`instance methods: ${util.inspect(socket.constructor.prototype, {colors: true})}`)
  }

  onSocketResolved() {
    console.log(`${this.m}.onSocketResolved`)
  }

  onSocketError(e) { // socket emitted error event
    this.abortSocket()
    throw Object.assign(e, {[`${this.m}`]: 'onSocketError'})
  }

  onRejected(e) { // unexpected error event
    const fn = `${this.m}.onRejected`
    console.error(`${fn}: Unexpected error during testing:`)
    console.error(util.inspect(e, {colors: true}))
  }

  abortSocket() {
    const {udpSocket} = this
    udpSocket && udpSocket.shutdown().catch(e => 1) // swallow possible error
  }
}
