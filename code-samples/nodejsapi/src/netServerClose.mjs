/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
// node --experimental-modules src/netServerClose.mjs
import net from 'net'
const {Server, Socket} = net

Promise.resolve().then(() => new Test().run().catch(e => console.log('onRejected:', e)))

class Test {
  async run() {
    console.log('Test.run')
    this.connectionListener = c => this.connection(c).catch(e => console.log('cinnection reject:', e))
    this.messageFixture = 'abc'
    const msg = new Buffer(this.messageFixture)
    this.server = await this.listen(this.connectionListener)
    const {address, port} = this.server.address()
    await sendTcpPacket({port, address, message: msg})
    return this.shutdown()
  }

  async listen(cons) {
    const server = new Server()
    await new Promise((resolve, reject) => server.listen(resolve))
    server.on('connection', cons)
    return server
  }

  async shutdown() {
    const {server} = this
    await new Promise((resolve, reject) => server.close())
    server.removeListener(this.connectionListener)
  }

  async connection(socket) {
    socket.end()
  }
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
