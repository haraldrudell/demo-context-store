/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import StringSplitter from './StringSplitter'

import stream from 'stream'
import util from 'util'
const {Readable} = stream

export default class LineReader extends StringSplitter {
  _end = this._end.bind(this)
  _error = this._error.bind(this)

  constructor(o) {
    super({name: 'LineReader', ...o})
    if (o instanceof Readable) o = {readable: o}
    const {readable} = o || false
    if (!((this.readable = readable) instanceof Readable)) throw new Error(`${this.m}: argument not a Readable: ${typeof readable}`)
    this.promise = new Promise((resolve, reject) => (this._resolve = resolve) + (this._reject = reject))
    readable.once('end', this._end)
      .on('error', this._error)
      .setEncoding('utf8')
    this.debug && console.log(`${this.m} constructor: ${util.inspect(this, {colors: true, depth: 3})}`)
  }

  async* asyncLineIterator() {
    const {debug} = this
    for (;;) {
      const s = await this.readLine()
      debug && console.log(`${this.m} asyncLineIterator: readLine: ${s}`)
      if (s === false) break
      yield s
    }
    debug && console.log(`${this.m} asyncLineIterator: return`)
  }

  close() {
    this._shutdown()
    this._resolve()
  }

  async fetcher() {
    const {readable, debug} = this
    debug && console.log(`${this.m} fetcher`)
    for (;;) {
      const result = readable.read()
      const rt = typeof result
      if (rt === 'string') return result
      if (result !== null) throw new Error(`${this.m}: stream.read bad data type: ${rt}`)
      if (this.readableIsEnd) return false

      // wait for more data before next read
      await new Promise((resolve, reject) => {
        const removeListeners = () => readable.removeListener('readable', retry)
          .removeListener('end', retry)
          .removeListener('error', cancel)
        const retry = () => removeListeners() + resolve()
        const cancel = e => removeListeners() + reject(e)
        readable.once('readable', retry)
          .once('end', retry)
          .once('error', cancel)
      })
    }
  }

  _end() {
    this.debug && console.log(`${this.m} _end`)
    this.readableIsEnd = true
    this._resolve()
  }

  _error(e) {
    this.debug && console.log(`${this.m} _error: ${e}`)
    this._shutdown()
    this._reject(e)
  }

  _shutdown(e) {
    const {readable} = this
    readable.destroy()
    readable.removeListener('end', this._end)
  }
}
