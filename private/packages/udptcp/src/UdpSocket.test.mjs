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

test('UdpSocket can receive udp4 packet', async () => {
  const message = 'abc'
  const udpSocket = await UdpSocket.getUdpSocket()

  // wrapper that shuts down socket on error
  let e, eShutdown
  await listenWrapper().catch(ee => e = ee)
  udpSocket && udpSocket.shutdown().catch(ee => eShutdown = ee)

  if (!e) {
    if (eShutdown) throw eShutdown
  } else {
    eShutdown && console.error(`shutdown failed: ${eShutdown}`)
    throw e
  }

  async function listenWrapper() {
    const {port, address} = await udpSocket.listen()

    const socket = new Socket('udp4')
    const buffer = new Buffer(message)
    const bytes = await new Promise((resolve, reject) => socket.send(buffer, port, address, (e, b) => !e ? resolve(b) : reject(e)))
    expect(bytes).toEqual(buffer.length)
    await new Promise((resolve, reject) => socket.close(resolve))
    await new Promise((resolve, reject) => setTimeout(resolve, 1e3))
  }
})
