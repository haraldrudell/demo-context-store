/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import {setMDebug, classLogger} from 'es2049lib'

export default class UdpTcp {
  pushers = []

  constructor(o) {
    setMDebug(o, this, 'UdpTcp')
    classLogger(this, UdpTcp)
  }

  async run(options) {
    const {runBlocked, pushers: pushList, debug} = this
    if (runBlocked) throw new Error(`${this.m}.run is blocked`)
    this.runBlocked = true
    const {constrs, pushers} = Object(options)
    const cs = Object(constrs)
    if (!Array.isArray(pushers)) throw new Error(`${this.m} pushers not array`)
    const ps = []
    const serverClient = ['server', 'client']
    for (let pairs of pushers) {
      const pair = Object(pairs)
      const is = {}
      for (let key of serverClient) {
        const isClient = key === serverClient[1]
        const {id, proto, port, address} = Object(pair[key])
        const c = cs[proto]
        if (typeof c !== 'function') throw new Error(`${this.m} no constructor for proto: ${proto}`)
        const i = is[key] = new c({name: key + id, address, port, debug, isClient})
        ps.push(i.promise)
        pushList.push(i)
      }

      // establish two-way cross-transport
      is.server.subscribe(is.client) // client want packets from server
      is.client.subscribe(is.server)
    }
    return Promise.all(ps)
  }

  async shutdown() {
    this.runBlocked = true
    const {pushers, debug} = this
    debug && console.log(`${this.m} shutdown pushers: ${pushers.length}`)
    await Promise.all(pushers.map(l => l.shutdown()))
    pushers.length = 0
  }
}
