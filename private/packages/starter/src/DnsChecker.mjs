/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import DnsTester from './DnsTester'
import CheckerBase from './CheckerBase'

import {getNonEmptyStringOrUndefined, getNonEmptyString} from 'es2049lib'

import dns from 'dns'

export default class DnsChecker extends CheckerBase {
  static defaults = {hqDomain: 'v.u45.biz', hqIp: '192.168.1.14', globalIp: '108.59.87.251'}

  constructor(o) {
    super({name: 'DnsChecker', ...o})
    const {server, hq} = Object(o)
    const {defaults} = DnsChecker
    const s = {}
    if (getNonEmptyStringOrUndefined({server, s})) throw new Error(`${this.m} server: ${s.text}`)
    hq && (this.hq = true)
    for (let [optionName, defaultValue] of Object.entries(defaults)) if (getNonEmptyString({[optionName]: Object(o)[optionName], s}, defaultValue)) throw new Error(`${this.m} ${optionName}: ${s.text}`)
    Object.assign(this, s.properties)
  }

  async run(isOk, results) {
    const {server, hq, debug} = this
    debug && console.log(`${this.m} isOk: ${isOk}`, results)
    if (!isOk) return this.getDependencyFailure(results)

    const {err, isTimeout, servers, elapsed} = await new DnsTester({servers: server}).test()
    const sText = `${servers.join('\x20')}`
    if (err) return this.getFailure({message: `${err} ${sText}`, data: {err, servers}})
    if (isTimeout) return this.getFailure({message: `dns timeout: ${elapsed.toFixed(3)} s`, data: {elapsed, servers}})
    let message = `dns: ${elapsed.toFixed(3)}${server ? ` ${sText}` : ''}`

    if (hq) {
      const {message: m, data, isFailure} = await this.checkHqDns()
      if (isFailure) return this.getFailure({message: m, data})
      else message += ` ${m}`
    }

    return this.getSuccess({message})
  }

  async checkHqDns() {
    const {hqDomain, hqIp, globalIp} = this
    const [err, address, family] = await new Promise((resolve, reject) => dns.lookup(hqDomain, (e, a, f) => resolve([e, a, f])))
    const data = {address, family}
    let message, isFailure
    if (!err) {
      if (address === hqIp) message = 'hq'
      else {
        isFailure = true
        data.hqIp = hqIp
        if (address === globalIp) message = `Domain ${hqDomain} resolves to global ${globalIp} expected: ${hqIp}`
        else {
          data.globalIp = globalIp
          message = `Domain ${hqDomain} resolves to incorect value: ${address}`
        }
      }
    } else {
      message = `dns error: ${err}`
      data.error = err
      isFailure = true
    }
    return {message, data, isFailure}
  }
}
