/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
// yarn test src/UdpTransport.test.mjs
import UdpTcp from './UdpTcp'
import PusherUdp from './PusherUdp'
import PusherUdpClient from './PusherUdpClient'
import PusherTcp1 from './PusherTcp1'
import PusherTcpClient1 from './PusherTcpClient1'

import dgram from 'dgram'
const {Socket} = dgram

const debug = true

let listeningSocket, boundSocket
let udpTcp0
async function shutdownSocket() {
  listeningSocket && await listeningSocket.shutdown()
  boundSocket && await new Promise((resolve, reject) => socket.close(resolve))
  udpTcp0 && await udpTcp0.shutdown()
}
afterAll(shutdownSocket)

test('Tcp should transfer succesfully', async () => {
  const messageFixture = 'abc'
  // camera udp port is random: source port for packets, responses go there
  const inPort = 1101 // inport is 1024..1025
  const middlePort = 1102
  const outPort = 1103
  const protoUdp = 'udp'
  const protoUdpc = 'udpc'
  const protoTcp1 = 'tcp1'
  const protoTcpc1 = 'tcpc1'
  const address = '127.0.0.1'
  const c87 = 'c87'
  const c87b = 'c87b'
  const cam = 'cam'
  const camb = 'camb'
  const pushers = [{
    server: {id: cam, proto: protoUdp, address, port: inPort}, // server listening for c87 to initiate rtsp
    client: {id: camb, proto: protoTcpc1, address, port: middlePort}, // client sending requests from c87
  }, {
    server: {id: c87b, proto: protoTcp1, address, port: middlePort}, // server listening for requests from c87b
    client: {id: c87, proto: protoUdpc, address, port: outPort}, // client sending requests to cam
  }]
  const constrs = {
    [protoUdp]: PusherUdp,
    [protoUdpc]: PusherUdpClient,
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
    const type ='udp4'
    const message = new Buffer(messageFixture)
    const sendFn = (socketAddress) => sendUdpPacket({type, message, address, port: inPort})
    const {msg} = await get1UdpPacket({address, port: outPort, type, sendFn})
    const result = String(msg)

    // check if packet received
    expect(result).toBe(messageFixture)
  }
})

async function sendUdpPacket({port, address, type, message}) {
  const socket = new Socket(type)
  const buffer = new Buffer(message)
  const bytes = await new Promise((resolve, reject) => socket.send(buffer, port, address, (e, b) => !e ? resolve(b) : reject(e)))
  await new Promise((resolve, reject) => socket.close(resolve))
  return {bytes, bufferBytes: buffer.length}
}

async function get1UdpPacket({port, address, type, sendFn = () => 1}) {
  const socket = new Socket(type)
  await new Promise((resolve, reject) => socket.bind({port, address}, resolve)) // socket may emit 'error', bind() returns this
  const [{msg, rinfo}] = await Promise.all([
    new Promise((resolve, reject) => socket.once('message', (msg, rinfo) => resolve({msg, rinfo}))),
    sendFn(socket.address()),
  ])
  await new Promise((resolve, reject) => socket.close(resolve))
  return {msg, rinfo}
}

/*
test('UdpSocket can receive udp4 packet', async () => {
  const messageFixture = 'abc'

  // start socket server
  const udpSocket = await UdpSocket.getUdpSocket()
  const {port, address} = await udpSocket.listen()
  listeningSocket = udpSocket

  // set up package reception and send packet
  let e, timer, subscription
  const result = await Promise.race([
    new Promise((resolve, reject) => {
      const receivePacket = list => {
        const [msg, rinfo] = list
        resolve({msg, rinfo})
      }
      subscription = udpSocket.subscribe(receivePacket)
      sendThePacket({port, address}).catch(reject)
    }),
    new Promise((resolve, reject) => timer = setTimeout(resolve, 1e3)),
  ]).catch(ee => e = ee)
  timer && clearTimeout(timer)
  subscription && subscription.unsubscribe()
  if (e) throw e

  if (!result) throw new Error('package timeout')
  const {msg, rinfo} = result
  const text = String(msg)
  expect(text).toBe(messageFixture)

  async function sendThePacket({port, address}) {
    const type = udpSocket.getType()
    const message = messageFixture
    const {bytes, bufferBytes} = await sendPacket({port, address, type, message})
    expect(bytes).toEqual(bufferBytes)
  }

  async function sendPacket({port, address, type, message}) {
    const socket = new Socket(type)
    const buffer = new Buffer(message)
    const bytes = await new Promise((resolve, reject) => socket.send(buffer, port, address, (e, b) => !e ? resolve(b) : reject(e)))
    await new Promise((resolve, reject) => socket.close(resolve))
    return {bytes, bufferBytes: buffer.length}
  }
})

test('UdpSocket can send udp4 packet', async () => {
  const messageFixture = 'abc'
  const type = 'udp4'
  const bindArg = {port: 0, address: '127.0.0.1'}

  // set up package reception and timer
  const socket = new Socket(type)
  let e, timer, messageListener
  const racePromise = Promise.race([
    new Promise((resolve, reject) => {
      const messageListener = (msg, rinfo) => resolve({msg, rinfo})
      socket.once('message', messageListener)
    }),
    new Promise((resolve, reject) => timer = setTimeout(resolve, 1e3)),
  ]).catch(ee => e = ee)

  // start socket server
  await new Promise((resolve, reject) => socket.bind(bindArg, resolve)) // socket may emit 'error', bind() returns this
  boundSocket = socket

  // send packet
  const {port, address} = socket.address()
  const message = messageFixture
  const udpSocket = new UdpSocket({type})
  /*const sendAddress = await udpSocket.sendMessage({address, port, message})
  await udpSocket.shutdown()

  // wait for packet
  const result = await racePromise
  clearTimeout(timer)
  messageListener && socket.removeListener(messageListener)
  if (e) throw e

  // stop socket server
  await new Promise((resolve, reject) => socket.close(resolve))

  // check result
  expect(result).toBeTruthy()
  const {msg} = result
  const text = String(msg)
  expect(text).toBe(messageFixture)
})
*/