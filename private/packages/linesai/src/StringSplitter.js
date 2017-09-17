/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
export default class StringSplitter {
  constructor(o) { // fetcher is a function that may be async returns string or false on end-of-file
    if (typeof o === 'function') o = {fetcher: o}
    const {fetcher, splitterList = ['\n', '\r\n', '\r'], regExp = /\r?\n|\r(?!\n)/} = o || false
    const ft = typeof fetcher
    if (ft !== 'function') throw new Error(`StringSplitter: constructor argument not function: ${ft}`)
    if (!Array.isArray(splitterList) || !splitterList.length || splitterList.some(v => !v || typeof v !== 'string')) throw new Error('StringSplitter: splitterList not non-empty array of non-empty string')
    if (!(regExp instanceof RegExp)) throw new Error('StringSplitter: regExp not instance of RegExp')
    const maxPatternLength = splitterList.reduce((accumulation, s) => Math.max(accumulation, s.length), 0)
    Object.assign(this, {fetcher, splitterList, regExp, maxPatternLength})
  }

  async readLine() { // string or false on EOF
    let resolveList = this.getLineList
    if (!resolveList) resolveList = this.getLineList = []
    else await new Promise(resolve => this.getLineList.push(resolve))

    let s = this.s

    // ensure we have data and not invoked after EOF
    if (typeof s !== 'string') {
      if (this.readableIsEnd) throw new Error('StringSplitter.getLine after EOF')
      s = ''
    }

    let result
    let readMore
    while (typeof result !== 'string' && result !== false) {

      // try to get at least maxPatternLength characters
      while (readMore || s.length < this.maxPatternLength && !this.readableIsEnd) {
        if (readMore) readMore = false
        const s1 = await this._invokeFetcher()
        if (s1) s += s1
        else break
      }

      // if we found a previous EOL, skip it
      if (this.skipMatch) {
        this.skipMatch = false
        const matchedString = this.splitterList.some(splitter => {
          if (s.startsWith(splitter)) {
            s = s.substring(splitter.length)
            return true
          }
        })
        if (!matchedString) throw new Error('StringSplitter: lost match corruption')
        if (!s && this.readableIsEnd) { // input ending with EOL
          result = this.s = false
          break
        }
      }

      // scan for EOL
      const match = s && this.regExp.exec(s)
      if (match) {
        const matchedIndex = match.index
        const matchedString = match[0]
        result = s.substring(0, matchedIndex)
        if (s.length >= matchedIndex + this.maxPatternLength) this.s = s.substring(matchedIndex + matchedString.length)
        else {
          this.skipMatch = true
          this.s = s.substring(matchedIndex)
        }
        break
      }

      // handle EOF
      if (this.readableIsEnd) { // ending without EOL
        this.finalEOL = false
        this.s = false
        result = s || false
        break
      }

      readMore = true
    }

    if (this.getLineList.length) {
      this.getLineList.shift()()
    } else this.getLineList = null

    return result
  }

  hadFinalEOL() {
    if (!this.readableIsEnd) throw new Error('hadFinalEOL before end of file')
    return this.finalEOL !== false
  }

  async _invokeFetcher() { // non-empty string or '' on EOF
    let result = ''
    while (!this.readableIsEnd) {
      const s = await this.fetcher()
      if (s === false) {
        this.readableIsEnd = true
        break
      }
      const st = typeof s
      if (st !== 'string') throw new Error(`StringSplitter: fetcher value not string or false: ${st}`)
      if (s) {
        result = s
        break
      }
    }
    return result
  }
}
