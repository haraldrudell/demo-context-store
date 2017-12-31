/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import Queue from './Queue'

import tls from 'tls'
import url from 'url'

export default class TlsConnector {
  https = 'https://'
  defaultPort = 443

  constructor(o) {
    const {debug, ssh, name: m = 'TlsConnector', port} = o || false
    Object.assign(this, {debug, m, ssh, port})
    this.queue = new Queue()
  }

  async verify(sockets) { // can only be invoked one at a time
    if (!Array.isArray(sockets)) sockets = [sockets]
    sockets = sockets.map((...args) => this.parse(...args))
    await this.queue.submit(() => this._process(sockets))
    this.debug && console.log('TlsConnector.verify completed successfully.')
  }

  async _process(sockets) { // one invocation at a time
    const {debug} = this
    const socket = sockets.shift()
    if (socket) {
      const {hostname, port} = socket

      await new Promise((resolve, reject) => {
        let tlsSocket
        const tlsReject = e => tlsSocket.end() + reject(e)
        const checkServerIdentity = (...args) => {
          try {
            return this.checkServerIdentity(...args)
          } catch (e) {
            tlsReject(e)
          }
        }

        const options = {checkServerIdentity, rejectUnauthorized: false}
        debug && console.log(`Connecting to: ${hostname}:${port}`, options)
        tlsSocket = this.tlsSocket = tls.connect(port, hostname, options)
          .once('lookup', (...args) => this.f(...args).catch(tlsReject))
          .once('secureConnect', () => this.connect(tlsSocket).catch(tlsReject))
          .once('close', resolve)
          .on('error', reject)
        debug && this.wrapLogger(tlsSocket, reject)
      })
    }
  }

  async f(err, ip, addressType, host) {
    console.log(`${host} resolves to ip ${ip}`)
  }

  checkServerIdentity(servername, cert) {
    console.log('Certificate for dns name:', servername)
    console.log('Canonical name:', cert.subject.CN)
    console.log('Valid from:', cert.valid_from)
    console.log('Valid to:', cert.valid_to)
    console.log('Issuer Canonical:', cert.issuer.CN)
    console.log('Serial number:', cert.serialNumber)
    console.log('Fingerprint:', cert.fingerprint)
    console.log('Alt names:', cert.subjectaltname)
    return tls.checkServerIdentity(servername, cert)
  }

  async connect(tlsSocket) {
    console.log('connect: trusted certificate:', tlsSocket.authorized)
    tlsSocket.end()
  }

  wrapLogger(emitter, reject) {
    const t0 = Date.now()
    const emit = emitter.emit.bind(emitter)
    emitter.emit = (...args) => (async () => {
      const t = (Date.now() - t0) / 1e3
      const p = this.logEvents(t, ...args)
      emit(...args)
      return p
    })().catch(reject)
  }

  async logEvents(t, ...args) {
    let s = t.toFixed(1)
    const m = 5 - s.length
    if (m > 0) s = '\x20'.repeat(m) + s
    const print = args.slice(0, 1)
    for (let x of args.slice(1)) {
      if (x instanceof Object) print.push(`Object ${x.constructor.name}`)
      else print.push(x)
    }
    console.log(s, ...print)
  }

  parse(socket, ix) {
    const {https, defaultPort} = this
    if (!socket || typeof socket !== 'string') throw new Error(`${this.m} dns hostname argument #${ix + 1} not non-empty string`)
    let hostString = socket.startsWith(https) ? socket : https + socket
    let aUrl = url.parse(hostString)
    if (!aUrl.port) {
      hostString += `:${defaultPort}`
      aUrl = url.parse(hostString) //url.parse(aUrl.toString())
    }
    const {host, hostname, port} = aUrl // hostname is without port
    if (!host) throw new Error(`${this.m} dns hostname argument #${ix + 1} failed parsing`)
    if (!(port > 0) || !(port < 65536)) throw new Error(`${this.m} bad port number argument #${ix + 1}: '${port}'`)
    return {host, hostname, port}
  }
}
