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
  }

  static log(t) {
    let client = SysLog.client
    if (client === false) throw new Error('syslog client permanently closed')
    if (!client) SysLog.client = client = SysLog._openClient()
    let resolve2
    SysLog.promise.then(v => new Promise(resolve => resolve2 = resolve))
    const d = SysLog.options.fixDate
      ? {timestamp: new Date(Date.now() - new Date().getTimezoneOffset() * 6e4)}
      : undefined
    console.log(d)
    return new Promise((resolve, reject) => client.log(t, d, e => {
      resolve2()
      !e ? resolve() : reject(e)
    })).catch(e => {SysLog.errorLog(e); return e})
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

  static errorLog = e => console.error('SysLog:') + console.error(e)
}

export default SysLog.log
export const close = SysLog.close
export const wait = SysLog.wait
export const options = SysLog.options
