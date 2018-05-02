/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
// yarn test src/TcpTransport.test.mjs
import UdpTcp from './UdpTcp'
import PusherTcp from './PusherTcp'
import PusherTcpClient from './PusherTcpClient'
import PusherTcp1 from './PusherTcp1'
import PusherTcpClient1 from './PusherTcpClient1'

import net from 'net'
const {Socket, Server} = net

const debug = true

let udpTcp0
async function shutdown() {
  udpTcp0 && await udpTcp0.shutdown()
}
afterAll(shutdown)


test('Tcp should transfer succesfully', async () => {
  const messageFixture = 'abc'
  const inPort = 1101
  const middlePort = 1102
  const outPort = 1103
  const protoTcp = 'tcp'
  const protoTcpc = 'tcpc'
  const protoTcp1 = 'tcp1'
  const protoTcpc1 = 'tcpc1'
  const address = '127.0.0.1'
  const c87 = 'c87'
  const c87b = 'c87b'
  const cam = 'cam'
  const camb = 'camb'
  const pushers = [{
    server: {id: c87, proto: protoTcp, address, port: inPort}, // server listening for c87 to initiate rtsp
    client: {id: c87b, proto: protoTcpc1, address, port: middlePort}, // client sending requests from c87
  }, {
    server: {id: camb, proto: protoTcp1, address, port: middlePort}, // server listening for requests from c87b
    client: {id: cam, proto: protoTcpc, address, port: outPort}, // client sending requests to cam
  }]
  const constrs = {
    [protoTcp]: PusherTcp,
    [protoTcpc]: PusherTcpClient,
    [protoTcp1]: PusherTcp1,
    [protoTcpc1]: PusherTcpClient1,
  }

  const udpTcp = udpTcp0 = new UdpTcp({debug})
  await Promise.all([
    udpTcp.run({pushers, constrs}), // does not finish until .shutdown invoked
    testSend().then(() => shutdownUdpTcp()),
  ])

  async function shutdownUdpTcp() {
    await udpTcp.shutdown()
    //console.log('handles:', process._getActiveHandles(), 'requests:', process._getActiveRequests())
  }

  async function testSend() {
    const timer = new Timer(1e3)
    const tcpTransport = new TcpTransport({server: {address, port:outPort}, client: {address, port: inPort}, message: messageFixture})
    await Promise.race([timer.promise, tcpTransport.promise])
    timer.shutdown()
    tcpTransport.shutdown()

    // check if packet received
    const {result} = tcpTransport
    const receivedDataNullOnTimeout = result
    expect(receivedDataNullOnTimeout).toBeTruthy()
    expect(result).toBe(messageFixture)
  }
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

    // send packet and wait for incoming connection
    const [socket] = await Promise.all([
      new Promise((resolve, reject) => server.on('connection', resolve)),
      sendTcpPacket({address: this.ca, port: this.cp, message: this.message}),
    ])
    console.log('rxconnecting')
    if (this.isShutdown) return

    // receive packet and close socket
    this.result = await new Promise((resolve, reject) => {
      let s = ''
      const dataListener = d => s += d
      const endListener = () => socket.end()
      const closeListener = () => cleanup()
      socket.setEncoding('utf8')
        .on('data', dataListener)
        .once('end', endListener)
        .once('close', closeListener)
        .once('error', cleanup)

      function cleanup(e) {
        socket.removeListener('data', dataListener).removeListener('end', endListener).removeListener('close', closeListener).removeListener('error', cleanup)
          .destroy()
        !e ? resolve(s) : reject(e)
      }
    })

    await this.close()
    console.log('rxendofdata resolve')
    this.resolve()
  }

  async shutdown() {
    console.log('rxShutdown')
    this.isShutdown = true
    return this.close()
  }

  async close() {
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
    const closeListener = () => cleanup()
    socket.once('close', closeListener).once('error', cleanup)
    socket.end(new Buffer(message))

    function cleanup(e) {
      !e && console.log(`sendTcpPacket: sent to: ${address}:${port}`)
      socket.removeListener('close', closeListener).removeListener('error', cleanup)
      console.log('sendTcpPacket.destroy DEBUG')
      socket.destroy()
      !e ? resolve() : reject(e)
    }
  })
}
