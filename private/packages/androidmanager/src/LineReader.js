/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import {EventEmitter} from 'events'
import StringSplitter from './StringSplitter'

export default class LineReader extends EventEmitter {
  constructor(readable) {
    super()
    this.readable = readable
      .once('end', this._end)
      .on('error', this._error)
      .setEncoding('utf8')
    this.stringSplitter = new StringSplitter(this._getData)
  }

  async getLine() {
    return this.stringSplitter.getLine()
  }

  _getData = async () => {
    let result
    while (true) {
      result = this.readable.read()
      const resultType = typeof result
      if (resultType === 'string') break
      if (result !== null) throw new Error(`stream bad data type: ${resultType}`)
      if (this.isEnd) {
        result = false
        break
      }
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

  _end = () => this.isEnd = true

  _error = e => {
    this.isError = true
    this.readable.removeListener('end', this._end)
    this.emit('error', e)
  }
}
