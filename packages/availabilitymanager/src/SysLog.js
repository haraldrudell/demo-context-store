/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import {Client, default as syslog} from 'syslog-client'
import os from 'os'

class SysLog {
  static client
  static promise = Promise.resolve()
  static options = {
    ip: '127.0.0.1',
    syslogHostname: os.hostname(),
    transport: syslog.Transport.Tcp,
    port: 514,
    rfc3164: false,
    fixDate: true,
    errorLog: console.error,
  }

  static log(t) {
    const client = SysLog._getClient()

    // get a resolve function for when this logging complete
    let resolve2
    const p = new Promise(resolve => resolve2 = resolve)

    // queue this promise in the pre-close promise-chain
    SysLog.promise.then(v => p)

    SysLog.options.tcpTimeout = 0 // does not work

    // adjust to the timezone used by this host
    const d = SysLog.options.fixDate
      ? {timestamp: new Date(Date.now() - new Date().getTimezoneOffset() * 6e4)}
      : undefined

    return new Promise((resolve, reject) => client.log(t, d, e => {
      resolve2() // resolve from pre-close chain
      !e ? resolve() : reject(e)
    })).catch(e => {SysLog.errorLog(e); return e})
  }

  static _getClient() {
    const client = SysLog.client
    if (client) return client
    if (client === false) throw new Error('syslog client permanently closed')
    return SysLog.client = SysLog._openClient()
  }

  static _openClient() {
    return new Client(SysLog.options.ip, SysLog.options).on('error', SysLog.errorLog)
  }

  static async close(permanent) {
    const c = SysLog.client
    if (c) {
      SysLog.client = permanent ? false : null
      await SysLog.promise
      c.close()
    }
  }

  static errorLog = e => console.error('SysLog:') + SysLog.options.errorHandler(e)
}

export default SysLog.log
export const close = SysLog.close
export const wait = SysLog.wait
export const options = SysLog.options
