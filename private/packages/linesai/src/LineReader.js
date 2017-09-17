/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import StringSplitter from './StringSplitter'

import {Readable} from 'stream'

export default class LineReader extends StringSplitter {
  constructor(readable) {
    super(() => 0)
    this.fetcher = this._getData
    if (!(readable instanceof Readable)) throw new Error('LineReader: argument not a Readable')
    this.readable = readable
      .once('end', this._end)
      .on('error', this._error)
      .setEncoding('utf8')
  }

  async * asyncLineIterator() {
    for (;;) {
      const s = await this.readLine()
      console.log('goit:', s)
      if (s === false) break
      console.log('yield', s)
      yield s
    }
    console.log('asyncLineIterator return')
  }

  async close() {
    this.readable.destroy()
    const e = this.isError
    if (e) throw e
  }

  _getData = async () => {
    let result
    while (true) {
      const rt = typeof (result = this.readable.read())
      if (rt === 'string') break
      if (result !== null) throw new Error(`LineReader: stream.read bad data type: ${rt}`)
      if (this.readableIsEnd) {
        result = false
        break
      }

      // wait for more data before next read
      let retry, cancel
      await new Promise((resolve, reject) => {
        retry = resolve
        cancel = reject
        this.readable
          .once('readable', retry)
          .once('end', retry)
          .once('error', cancel)
      })
      this.readable
        .removeListener('readable', retry)
        .removeListener('end', retry)
        .removeListener('error', cancel)
    }
    return result
  }

  _end = () => this.readableIsEnd = true

  _error = e => {
    const ee = this.isError
    if (!ee) this.isError = e
    else {
      const es = ee.errors
      if (!es) ee.errors = e
      else if (!Array.isArray(es)) ee.errors = [es, e]
      else es.push(e)
    }
    this.readable.removeListener('end', this._end)
  }
}
