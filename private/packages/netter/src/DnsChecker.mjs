/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import DnsTester from './DnsTester'
import CheckerBase from './CheckerBase'

export default class DnsChecker extends CheckerBase {
  constructor(o) {
    super({name: 'DnsChecker', ...o})
  }

  async run(isOk, results) {
    const {debug} = this
    debug && console.log(`${this.m} isOk: ${isOk}`, results)
    if (!isOk) return this.getDependencyFailure(results)

    const {err, isTimeout, elapsed} = await new DnsTester().test()
    if (err) return this.getFailure({message: err.message, data:err})
    if (isTimeout) return this.getFailure({message: `dns timeout: ${elapsed.toFixed(3)} s`, data: {elapsed}})
    return this.getSuccess({message: `dns: ${elapsed.toFixed(3)} s`})
  }
}
