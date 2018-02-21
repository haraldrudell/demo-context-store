/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import {getFn, getArrayOfNonEmptyString, getRegExp, Failure} from 'es2049lib'

export default class StringSplitter {
  static split0 = ['\n', '\r\n', '\r']
  static regExp0 = /\r?\n|\r(?!\n)/

  constructor(o) {
    if (typeof o === 'function') o = {fetcher: o} // fetcher: (async) function returning string or false on end-of-file
    const {fetcher, splitterList, regExp, name, debug} = o || false
    this.m = String(name || 'StringSplitter')
    const {split0, regExp0} = StringSplitter
    let s
    if ((this.fetcherFn = s = getFn(fetcher, (this.fetcher || this._fetcher).bind(this))) instanceof Failure) throw new Error(`${this.m} fetcher: ${s.text}`)
    if ((this.splitterList = s = getArrayOfNonEmptyString(splitterList, split0)) instanceof Failure) throw new Error(`${this.m} splitterList: ${s.text}`)
    this.maxPatternLength = s.reduce((accumulation, sx) => Math.max(accumulation, sx.length), 0)
    if ((this.regExp = s = getRegExp(regExp, regExp0)) instanceof Failure) throw new Error(`${this.m} regExp: ${s.text}`)
    debug && (this.debug = true)
  }

  async readLine() { // return value: string or false on EOF
    if (this.queue) await new Promise(resolve => this.queue.push(resolve))
    else this.queue = []

    let {buffer} = this

    // ensure we have data and not invoked after EOF
    if (typeof buffer !== 'string') {
      if (this.readableIsEnd) throw new Error(`${this.m} readLine after EOF`)
      buffer = ''
    }

    let result
    let readMore
    while (typeof result !== 'string' && result !== false) {

      // try to get at least maxPatternLength characters
      while (readMore || buffer.length < this.maxPatternLength && !this.readableIsEnd) {
        if (readMore) readMore = false
        const data = await this._invokeFetcher()
        if (data) buffer += data
        else break
      }

      // if we found a previous EOL, skip it
      if (this.skipMatch) {
        this.skipMatch = false
        const matchedString = this.splitterList.some(splitter => {
          if (buffer.startsWith(splitter)) {
            buffer = buffer.substring(splitter.length)
            return true
          }
        })
        if (!matchedString) throw new Error(`${this.m}: lost match corruption`)
        if (!buffer && this.readableIsEnd) { // input ending with EOL
          result = this.buffer = false
          break
        }
      }

      // scan for EOL
      const match = buffer && this.regExp.exec(buffer)
      if (match) {
        const matchedIndex = match.index
        const matchedString = match[0]
        result = buffer.substring(0, matchedIndex)
        if (buffer.length >= matchedIndex + this.maxPatternLength) this.buffer = buffer.substring(matchedIndex + matchedString.length)
        else {
          this.skipMatch = true
          this.buffer = buffer.substring(matchedIndex)
        }
        break
      }

      // handle EOF
      if (this.readableIsEnd) { // ending without EOL
        this.finalEOL = false
        this.buffer = false
        result = buffer || false
        break
      }

      readMore = true
    }

    if (this.queue.length) this.queue.shift()()
    else this.queue = null

    return result
  }

  hadFinalEOL() {
    const {readableIsEnd, finalEOL} = this
    if (!readableIsEnd) throw new Error(`${this.m} hadFinalEOL before end of file`)
    return finalEOL !== false
  }

  async _invokeFetcher() { // result: non-empty string or '' on EOF
    let result = ''
    while (!this.readableIsEnd) {
      const data = await this.fetcherFn() // string or false
      if (data === false) {
        this.readableIsEnd = true
        break
      }
      const st = typeof data
      if (st !== 'string') throw new Error(`${this.m}: fetcher value not string or false: ${st}`)
      if (data) {
        result = data
        break
      }
    }
    return result
  }

  _fetcher() {
    throw new Error(`${this.m} no fetcher function" either provide fetcher argument or override fetcher`)
  }
}
