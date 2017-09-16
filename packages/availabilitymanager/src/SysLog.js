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
    tcpTimeout: 0, // 0 does not work
  }

  static log(t) {
    const client = SysLog._getClient()

    // for tcp the buggy thing emits timeout errors
    // we have to use tcp, b/c udp logs whether logging is functional or not
    // options parsing does not distinguish between timeout value missing or 0
    // we can fix that now!
    client.tcpTimeout = SysLog.options.tcpTimeout

    // get a resolve function for when this logging complete
    let resolve2
    const p = new Promise(resolve => resolve2 = resolve)

    // queue this promise in the pre-close promise-chain
    SysLog.promise.then(v => p)

    // adjust to the timezone used by this host
    const d = SysLog.options.fixDate
      ? {timestamp: new Date(Date.now() - new Date().getTimezoneOffset() * 6e4)}
      : undefined

    return new Promise((resolve, reject) => client.log(t, d, e => {
      resolve2() // resolve from pre-close chain
      return !e ? resolve() : reject(e)
    })).catch(e => {
      SysLog.errorLog(e)
      return e
    })
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
export const options = SysLog.options
