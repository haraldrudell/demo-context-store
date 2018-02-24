/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import {Queue} from 'es2049lib'

import dns from 'dns'
const {Resolver} = dns
import util from 'util'

export default class DnsTester {
  static domain = `%s.blogspot.com`
  static timeout = 3e3 // 3 seconds

  constructor(o) {
    const {timeout, domain, servers, debug, name} = o || false
    this.m = String(name || 'DnsTester')
    debug && (this.debug = true)
    timeout >= 0 && (this.timeout = +timeout)
    domain && (this.domain = String(domain))
    servers && (this.servers = Array.isArray(servers) ? servers : [servers])
    this.queue = new Queue()
  }

  async test(o) {
    const {domain, servers: s0, timeout} = o || false
    const {queue} = this
    const {err, records, elapsed, isTimeout, servers} = await queue.submit(() => this.resolve({domain, servers: s0, timeout}))
    return {err, records, elapsed, isTimeout, servers, domain}
  }

  async resolve({domain, servers, timeout}) {
    const resolver = new Resolver()
    if (!servers) servers = this.servers
    else if (!Array.isArray(servers)) servers = [servers]
    if (servers) {
      resolver.setServers(servers)
      servers = resolver.getServers()
    } else servers = dns.getServers()
    if (!domain) domain = this.domain || this.getDomain()
    timeout = timeout >= 0 ? +timeout : this.timeout >= 0 ? this.timeout : DnsTester.timeout

    const t0 = Date.now()
    const [err, records] = await new Promise((resolve, reject) => {
      let timer = timeout && setTimeout(() => (timer = null) + resolver.cancel(), timeout)
      resolver.resolve(domain, (err0, records0) => (timer && clearTimeout(timer)) + resolve([err0, records0]))
    })
    const isTimeout = err && err.code === 'ECANCELLED'
    const elapsed = (Date.now() - t0) / 1e3
    return {err: !isTimeout && err, records, elapsed, isTimeout, servers, domain}
  }

  getDomain() {
    return util.format(DnsTester.domain, `a${Date.now()}${String(Math.random()).substring(2, 5)}`)
  }
}
