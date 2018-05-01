/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
// yarn test src/TcpTransport.test.mjs
import UdpTcp from './UdpTcp'
import TcpPusher from './TcpPusher'

import net from 'net'
const {Socket, Server} = net

let udpTcp
async function shutdown() {
  udpTcp && await udpTcp.shutdown()
}
afterAll(shutdown)


test('Tcp should transfer succesfully', async () => {
  const messageFixture = 'abc'
  const inPort = 1101
  const middlePort = 1102
  const outPort = 1103
  const proto = 'tcp'
  const address = '127.0.0.1'
  const pushers = [{
    server: {proto, address, port: inPort},
    client: {proto, address, port: middlePort},
  }, {
    server: {proto, address, port: middlePort},
    client: {proto, address, port: outPort},
  }]
  const constrs = {
    tcp: TcpPusher
  }

  // instantiate pushers
  udpTcp = new UdpTcp().run({pushers, constrs})

  const timer = new Timer(1e3)
  const tcpTransport = new TcpTransport({server: {address, port:outPort}, client: {address, port: inPort}, message: messageFixture})
  await Promise.race([timer.promise, tcpTransport.promise])
  timer.shutdown()
  tcpTransport.shutdown()

  // check if packet received
  const {result} = tcpTransport
  const receivedDataNullOnTimeout = result
  expect(receivedDataNullOnTimeout).toBeTruthy()
  const {msg} = result
  expect(msg).toBe(messageFixture)
})

class Timer {
  constructor(t) {
    this.promise = new Promise((resolve, reject) => this.timer = setTimeout(resolve, t)).then(this.timeout)
      .then(v => console.log('Timer: expired'))
  }
  shutdown() {
    clearTimeout(this.timer)
  }
}

class TcpTransport {
  constructor({server: {address: sa, port: sp}, client: {address: ca, port: cp}, message}) {
    Object.assign(this, {sa, sp, ca, cp, message})
    this.promise = new Promise((resolve, reject) => Object.assign(this, {resolve, reject}))
    process.nextTick(() => this.start().catch(this.onRejected).catch(this.reject))
  }
  async start() {
    // start listening server
    const server = this.server = new Server()
    const {sa: address, sp: port} = this
    await new Promise((resolve, reject) => server.listen(port, address, e => !e ? resolve() : reject(e)))
    if (this.isShutdown) return

    // send packet and get incoming connection
    const [socket] = await Promise.all([
      new Promise((resolve, reject) => server.on('connect', resolve)),
      sendTcpPacket({address: this.ca, port: this.cp, message: this.message}),
    ])
    if (this.isShutdown) return

    // receive packet
    let s = ''
    await new Promise((resolve, reject) => socket.on('data', d => s += d).once('end', resolve).setEncoding(utf8))
    this.result = s
    socket.end()

    await this.shutdown()
    this.resolve()
  }
  async shutdown() {
    this.isShutdown = true
    this.server && await new Promise((resolve, reject) => this.server.close(resolve))
  }
  onRejected = async (e) => {
    await this.shutdown().catch(this.extraError)
    throw e
  }
  extraError = e => console.error(e)
}

async function sendTcpPacket({port, address, message}) {
  const socket = new Socket()
  await new Promise((resolve, reject) => socket.connect(port, address, resolve))
  await new Promise((resolve, reject) => {
    socket.once('close', () => cleanup()).once('error', cleanup)
    socket.end(new Buffer(message))

    function cleanup(e) {
      console.log(`sendTcpPacket: sent to: ${address}:${port}`)
      socket.removeListener('close', cleanup).removeListener('error', cleanup)
      !e ? resolve() : reject(e)
    }
  })
}
