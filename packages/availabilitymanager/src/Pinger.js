/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import PingSession from './PingSession'
import Monitor from './Monitor'

const oneSecond = 1e3
const tenSeconds = 1e4

export default class Pinger extends Monitor {
  constructor(o) {
    super(o || false)
    const {networkProtocol, target, interval, timeout, retry, errrorHandler} = o || false
    this.networkProtocol = networkProtocol ? PingSession.NetworkProtocol[networkProtocol] : PingSession.NetworkProtocol.IPv4
    if (!this.networkProtocol) throw new Error(`Pinger: bad network protocol: ${networkProtocol}`)
    this.target = target
    const interval2 = interval >= oneSecond ? Number(interval) : tenSeconds
    this.timeout = timeout >= 2 * interval2 ? Number(timeout) : 2 * interval2
    this.retries = retries >= 0 ? Number(retries) : 0
    this.everWorked = false
    this.timerStart = Date.now()
    const eh = typeof (this.errrorHandler = errrorHandler)
    if (eh !== 'function') throw new Error(`Pinger: errorHandler bot function: ${eh}`)

    this.startSocket(this)
    setInterval(this.sendPing, interval2)
  }

  startSocket = e => (async () => {
    if (e !== this) {
      if (!(e instanceof Error)) e = new Error(`Pinger: Unexpected socket close: ${e}`)
      console.error(e)
    }
    this.instantiateSocket().then(this.startSocket, this.startSocket)
  })().catch(e => console.error('Pinger.handleSocketEnd failed:') + this.errrorHandler(e))

  async instantiateSocket() {
    const {networkProtocol} = this
    return new Promise((resolve, reject) => this.pingSession = new PingSession({networkProtocol})
      .once('close', resolve)
      .on('error', reject)
    )
  }

  sendPing = () => (async () => {
    const {target, retries, timeout, packetSize} = this
    this.handlePingResponse(
      await this.pingSession.pingHost({target, retries, timeout, packetSize})
        .catch(this.pingFailureHandler)
    )
  })().catch(this.errorHandler)

  pingFailureHandler = e => {
    if (e instanceof PingSessionPingError) {
      if (e instanceof RequestTimedOutError) this.handlePingTimeout(e)
      else console.error(e)
    } else throw e
  }

  handlePingResponse(v) {
    const now = Date.now()
    if (!this.everWorked) this.everWorked = true
    !this.isSelfUp() && this.updateStatus(true, now, this.timerStart, this.everWorked)
    this.timerStart = now
  }

  handlePingTimeout(e) {
    if (this.hadNoSelfEvents() || this.isSelfUp()) this.updateStatus(false, Date.now(), this.timerStart, this.everWorked)
  }
}
