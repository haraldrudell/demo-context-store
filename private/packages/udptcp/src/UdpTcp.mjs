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
        const {proto, port, address} = Object(pair[key])
        const c = cs[proto]
        if (typeof c !== 'function') throw new Error(`${this.m} no constructor for proto: ${proto}`)
        const i = is[key] = new c({address, port, debug})
        ps.push(i.promise)
        pushList.push(i)
      }
      is.server.subscribe(is.client)
    }
    return Promise.all(ps)
  }

  shutdown() {
    this.runBlocked = true
    const {pushers} = this
    this.pushers.length = 0
    return Promise.all(pushers.map(l => l.shutdown()))
  }
}
