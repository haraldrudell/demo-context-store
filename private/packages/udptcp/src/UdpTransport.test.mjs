/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import UdpSocket from './UdpSocket'

import dgram from 'dgram'
const {Socket} = dgram

test('UdpSocket can instantiate udp4', () => {
  const udpSocket = new UdpSocket()
})

let listeningSocket, boundSocket
async function shutdownSocket() {
  listeningSocket && await listeningSocket.shutdown()
  boundSocket && await new Promise((resolve, reject) => socket.close(resolve))
}
afterAll(shutdownSocket)

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
  /*const sendAddress =*/ await udpSocket.sendMessage({address, port, message})
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
