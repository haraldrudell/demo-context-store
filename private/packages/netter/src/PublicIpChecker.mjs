/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import CheckerBase from './CheckerBase'

import fetch from 'node-fetch'

import dns from 'dns'

export default class PublicIpChecker extends CheckerBase {
  static service = 'https://ipleak.net/json/'
  static dnsService = 'resolver.dnscrypt.org'
  static fetchTimeout = 3e3 // 3 s

  constructor(o) {
    super({name: 'PublicIpChecker', ...o})
  }

  async run(isOk, results) {
    const {debug} = this
    debug && console.log(`${this.m} isOk: ${isOk}`, results)
    if (!isOk) return this.getDependencyFailure(results)
    let message

    let e = []
    const result = await Promise.all([
      this.getIpInfo(),
      this.getDnsServer(),
    ].map(p => p.catch(ee => e.push(ee))))
    if (e.length) return this.getFailure({message: `public ip check: ${e.map(ee => ee.message).join('\x20')}`, data: {error: e.length > 1 ? e : e[0]}})

    message = `public ip: ${result[0]} dns: ${result[1]}`
    return this.getSuccess({message})
  }

  async getDnsServer() {
    const {dnsService} = PublicIpChecker
    const [err, address/*, family*/] = await new Promise((resolve, reject) => dns.lookup(dnsService, (e, a, f) => resolve([e, a, f])))
    if (err) throw (err)
    return this.getIpInfo(address)
  }

  async getIpInfo(ip0) {
    const {debug} = this
    const {service, fetchTimeout} = PublicIpChecker
    debug && console.log(`${this.m} getIpInfo: '${ip0 | ''}'`)
    const url = ip0 && service + ip0 || service
    const resp = await new Promise((resolve, reject) => {
      const start = Date.now()
      const timer = setTimeout(timeout, fetchTimeout)
      const r = fetch(url) // TODO abort fetch on timeout
      clearTimeout(timer)
      resolve(r)

      function timeout() {
        const elapsed = (Date.now() - start) / 1e3
        reject(new Error(`fetch timeout: ${elapsed} s: ${url}`))
      }
    })
    const o = await resp.json()
    const {country_code, region_code, ip, reverse} = o
    return `${ip} location: ${country_code}${country_code === 'US' ? `-${region_code}` : ''}${reverse ? ` reverse: ${reverse}` : ''}`
  }
}
