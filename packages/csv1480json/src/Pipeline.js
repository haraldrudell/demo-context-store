/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import {Transform} from 'stream'

export default class PipeLine extends Transform {
  constructor({readStream, writeStream, errorHandler}) {
    super({decodeStrings: false, encoding: 'utf8'})
    const eh = typeof errorHandler
    if (eh !== 'function') throw new Error(`PipeLine: errorHandler not function: ${eh}`)
    readStream.on('error', errorHandler).setEncoding('utf8')
      .pipe(this.on('error', errorHandler))
      .pipe(writeStream.on('error', errorHandler))
  }

  _transform(chunk, encoding, callback) { // callback(err, chunk)
    if (chunk.length) this.addData(chunk)
    callback(null, this.getOutput())
  }

  _flush = callback => callback(null, this.getOutput(true))
}
