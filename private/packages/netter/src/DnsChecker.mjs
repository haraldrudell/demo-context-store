/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import Result from './Result'
import DnsTester from './DnsTester'
import InternetChecker from './InternetChecker'

export default class DnsChecker extends InternetChecker {
  constructor(o) {
    super(o)
    this.m = 'DnsChecker'
  }

  async run(isOk, results) {
    const {debug, m: name} = this
    debug && console.log(`${this.m} isOk: ${isOk}`, results)
    if (!isOk) return this.failure(results)

    const {err, isTimeout, elapsed} = await new DnsTester().test()
    const message = `dns: ${elapsed.toFixed(3)} s${isTimeout ? ' time out' : ''}${err ? ` error: ${err.message}` : ''}`

    return new Result({name, isFailure: false, message})
  }
}
