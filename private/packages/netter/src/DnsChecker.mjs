/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import DnsTester from './DnsTester'
import CheckerBase from './CheckerBase'

import {getNonEmptyStringOrUndefined} from 'es2049lib'

export default class DnsChecker extends CheckerBase {
  constructor(o) {
    super({name: 'DnsChecker', ...o})
    const {server} = Object(o)
    const s = {}
    if (getNonEmptyStringOrUndefined({server, s})) throw new Error(`${this.m} server: ${s.text}`)
    Object.assign(this, s.properties)
  }

  async run(isOk, results) {
    const {server, debug} = this
    debug && console.log(`${this.m} isOk: ${isOk}`, results)
    if (!isOk) return this.getDependencyFailure(results)

    const {err, isTimeout, servers, elapsed} = await new DnsTester({servers: server}).test()
    const sText = `${servers.join('\x20')}`
    if (err) return this.getFailure({message: `${err} ${sText}`, data: {err, servers}})
    if (isTimeout) return this.getFailure({message: `dns timeout: ${elapsed.toFixed(3)} s`, data: {elapsed, servers}})
    return this.getSuccess({message: `dns: ${elapsed.toFixed(3)} ${server ? sText : ''}`})
  }
}
