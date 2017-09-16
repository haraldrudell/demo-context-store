/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import {UP, DOWN, getISOTime} from './Status'
import {PingTimeoutError, default as sendPing} from './sendPing'
import Monitor from './Monitor'

const oneSecond = 1e3
const onefiveSeconds = 1.5e3
const tenSeconds = 1e4

export default class Pinger extends Monitor {
  constructor(o) {
    super(o || false)
    const {target, interval, timeout, retries, packetSize, errorHandler} = o || false
    this.target = String(target || '')
    const interval2 = interval > onefiveSeconds ? Number(interval) : tenSeconds
    this.timeout = timeout >= oneSecond ? timeout : oneSecond
    this.retries = retries >= 0 ? Math.round(retries) : 0
    this.packetSize = packetSize >= 0 ? Math.round(packetSize) : 0
    const eh = typeof (this.errorHandler = errorHandler)
    if (eh !== 'function') throw new Error(`Pinger: errorHandler not function: ${eh}`)

    setInterval(this.sendPing, interval2)
    this.sendPing()
  }

  sendPing = () => (async () => {
    const {target, retries, timeout, packetSize} = this
    const o = await sendPing({target, retries, timeout, packetSize})
    if (!o.e) {
      // eslint-disable-next-line no-shadow
      const {stdout, retries, first, last} = o
      if (retries) console.log(`${getISOTime(last)} ${this.printable} retries: ${retries} first failure: ${getISOTime(first, true, true)} ms: ${last % 1e3}`)
      this.handlePingResponse({upSince: first, stdout})
    } else {
      const {e} = o
      if (e instanceof PingTimeoutError) {
        const {message, first, last} = e
        this.handlePingTimeout({firstFailure: first, lastFailure: last, stdout: message})
      } else {
        const {stderr} = e
        console.error(`Pinger.sendPing${stderr ? ' stderr:\'' + stderr + '\'' : ''}:`)
        throw e
      }
    }
  })().catch(this.errorHandler)

  handlePingResponse({upSince, stdout}) {
    this.lastFunctional = upSince
    if (!this.isSelfUp()) this.updateStatus({isUp: UP, upSince})
  }

  handlePingTimeout({firstFailure, lastFailure, stdout}) {
    const {lastFunctional} = this
    if (this.hadNoUpDownEvents() || this.isSelfUp()) this.updateStatus({isUp: DOWN, firstFailure, lastFailure, lastFunctional})
  }
}
