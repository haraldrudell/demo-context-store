/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import {Transport, default as SyslogClient} from './SyslogClient'

import util from 'util'

class Syslog {
  static client
  static outputCompletePromise = Promise.resolve()
  static optionsList = ['syslogHostname', 'port', 'tcpTimeout', 'facility', 'severity', 'rfc3164', 'appName', 'dateFormatter']
  static options = {
    fixDate: true,
    transport: Transport.Tcp,
    rfc3164: false,
    tcpTimeout: 0, // otherwise timeout errors are emitted
  }

  static log(...args) { // returns a promise that will not reject
    const t = `${util.format.apply(null, args)}`
    const client = Syslog._getClient()

    // get a resolve function for when this logging complete
    let resolveEndPromise
    const p = new Promise(resolve => resolveEndPromise = resolve)

    // queue this promise in the pre-close promise-chain
    Syslog.outputCompletePromise.then(v => p)

    // adjust to the timezone used by this host
    const d = Syslog.options.fixDate
      ? {timestamp: new Date(Date.now() - new Date().getTimezoneOffset() * 6e4)}
      : undefined

    return new Promise((resolve, reject) => client.log(t, d, e => {
      resolveEndPromise() // resolve from pre-close chain
      !e ? resolve() : reject(e)
    })).catch(e => {SyslogClient.errorListener(e); return e})
  }

  static setOptions(o) {
    if (o) {
      const {options} = Syslog
      for (p of Syslog.optionsList) {
        const v = o[p]
        if (v === null) delete options[p]
        else if (v !== undefined) options[p] = v
      }
      const {fixDate, errorHandler} = o
      if (fixDate !== undefined) options.fixdate = !!fixdate
      if (errorHandler === null) delete options.errorHandler
      else if (errorHandler !== undefined) {
        const te = typeof errorHandler
        if (te !== 'function') throw new Error(`Syslog.setOptions errorHandler not function: ${te}`)
        options.errorHandler = errorHandler
      }
    }
  }

  static async close(permanent) {
    const c = SyslogClient.client
    if (c) {
      Syslog.client = permanent ? false : null
      await Syslog.outputCompletePromise
      c.close()
    }
  }

  static async connect() { // only relevant for tcp
    const c = Syslog._getClient()
    return new Promise((resolve, reject) => c.getTransport((e, t) => !e ? resolve() : reject()))
  }

  static _getClient() {
    const client = Syslog.client
    if (client) return client
    if (client === false) throw new Error('syslog client permanently closed')
    return Syslog.client = Syslog._openClient()
  }

  static _openClient = () => new SyslogClient(Syslog.options).on('error', Syslog.errorListener)

  static errorListener = e => (async () => {
    const {errorHandler} = Syslog.options
    if (errorHandler) errorHandler(e)
    else {
      if (e.message.match(/connection closed/)) return // socket disconnect
      Syslog.errorHandler(e)
    }
  })().catch(Syslog.errorHandler)

  static errorHandler = e => console.error('Syslog:') + console.error(e)
}

export default Syslog.log
export const close = Syslog.close
export const setOptions = Syslog.setOptions
export const testConnect = Syslog.connect
