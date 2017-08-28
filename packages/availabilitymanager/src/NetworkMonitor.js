/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import Network from './Network'
import Status from './Status'

import {EventEmitter} from 'events'
import readline from 'readline'
import {spawn} from 'child_process'

export default class NetworkMonitor extends EventEmitter {
  constructor(o) {
    super()
    const {errorHandler, status} = o
    Object.assign(this, {errorHandler, status})

    this.nw = new Network()
    this.updateStatus().catch(errorHandler)

    const cmd = 'ip'
    const args = ['monitor', 'route']
    new Promise((resolve, reject) => {
      const cp = spawn(cmd, args, {stdio: ['ignore', 'pipe', 'inherit']}) // inherit is default acc. to api, but it isn't
        .once('close', (status, signal) => {
          if (status === 0 && !signal) resolve(status)
          else {
            let msg = `status code: ${status}`
            if (signal) msg += ` signal: ${signal}`
            msg += ` '${cmd} ${args.join(' ')}`
            reject(new Error(msg))
          }
        }).on('error', reject)

      readline.createInterface({input: cp.stdout})
        .on('line', this.ipLine)
        .on('error', reject)
    }).then(this.ipExit).catch(this.errorHandler)
  }

  async updateStatus() {
    const result = await this.nw.defaultRoute()
    const isUp = !result.isFailure
    if (this.isUp !== isUp) {
      this.isUp = isUp
      const last = this.last
      const now = Date.now()
      this.last = now
      this.emit('data', new NetworkStatus({result, last, now}))
    }
  }

  ipExit = status => {
    console.error('NetworkMonitor.ipExit')
    this.errorHandler(new Error('Unexpected ip exit'))
  }

  // default via 192.168.1.12 dev enx000ec6fa54d2 proto static metric 100
  // Deleted local 192.168.1.159 dev enx000ec6fa54d2 table local proto kernel scope host src 192.168.1.159
  ipLine = line => (async () => (line.startsWith('Deleted local') || line.startsWith('default via'))
    && this.updateStatus()
  )().catch(this.errorHandler)
}

class NetworkStatus extends Status {
  constructor(o) {
    super(o)
    const {result, last, now} = o || false
    Object.assign(this, {result, last, now})
  }
  toLog() {
    return `Network: ${!this.result.isFailure ? 'up' : 'down'} ` +
      `previous change: ${this.last ? this.getISOTime(this.last) : 'none'}` +
      `${!this.result.isFailure ? ' ' + this.result.toString() : ''}`
  }
  toString() {
    return `${this.getISOTime(this.now)} ${this.toLog()}`
  }
}
