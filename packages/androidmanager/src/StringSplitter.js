export default class StringSplitter {
  constructor(o) { // function or {fetcher, splitterList, regExp}, fetcher returns false, string or such promise
    if (!o) o = false
    else if (typeof o === 'function') o = {fetcher: o}

    const fetcher = o.fetcher
    const fetcherType = typeof fetcher
    if (fetcherType !== 'function') throw new Error(`StringSplitter: constructor argument not function: ${fetcherType}`)
    this.fetcher = fetcher

    const splitterList = o.splitterList || ['\n', '\r\n', '\r']
    if (!Array.isArray(splitterList) || !splitterList.length || splitterList.some(v => !v || typeof v !== 'string')) throw new Error('StringSplitter: splitterList not non-empty array of non-empty string')
    this.splitterList = splitterList

    this.maxPatternLength = splitterList.reduce((accumulation, s) => Math.max(accumulation, s.length), 0)

    const regExp = o.regExp || /\r?\n|\r(?!\n)/
    if (!(regExp instanceof RegExp)) throw new Error('StringSplitter: regExp not instance of RegExp')
    this.regExp = regExp
    console.log('StringSplitter constructor fetcher:', this.fetcher, 'splitterList:', this.splitterList, 'regExp:', this.regExp, 'maxPatternLength:', this.maxPatternLength)
  }

  async getLine() { // string or false on EOF
    let resolveList = this.getLineList
    if (!resolveList) resolveList = this.getLineList = []
    else {
      console.log('StringSplitter.getLineWait')
      await new Promise(resolve => this.getLineList.push(resolve))
      console.log('StringSplitter.getLineWaitEnd')
    }
    console.log('StringSplitter.getLine')
    let s = this.s

    // ensure we have data and not invoked after EOF
    if (typeof s !== 'string') {
      if (this.isEnd) throw new Error('StringSplitter.getLine after EOF')
      s = ''
    }

    let result
    let readMore
    while (typeof result !== 'string' && result !== false) {

      // try to get at least maxPatternLength characters
      while (readMore || s.length < this.maxPatternLength && !this.isEnd) {
        if (readMore) readMore = false
        const s1 = await this._invokeFetcher()
        if (s1) s += s1
        else break
      }
      console.log(`characters: ${s.length} isEnd: ${!!this.isEnd}`)

      // if we found a previous EOL, skip it
      if (this.skipMatch) {
        this.skipMatch = false
        console.log('skipM', s.length, s.charCodeAt(0))
        const matchedString = this.splitterList.some(splitter => {
          if (s.startsWith(splitter)) {
            s = s.substring(splitter.length)
            return true
          }
        })
        if (!matchedString) throw new Error('StringSplitter: lost match corruption')
        if (!s && this.isEnd) { // input ending with EOL
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
      if (this.isEnd) { // ending without EOL
        this.finalEOL = false
        this.s = false
        result = s || false
        break
      }

      readMore = true
    }

    console.log('getLine result:', result, result.length, this.isEnd)

    if (this.getLineList.length) {
      this.getLineList.shift()()
    } else this.getLineList = null

    return result
  }

  hadFinalEOL() {
    if (!this.isEnd) throw new Error('hadFinalEOL before end of file')
    return this.finalEOL !== false
  }

  async _invokeFetcher() { // non-empty string or '' on EOF
    let result = ''

    while (!this.isEnd) {
      const s = this.fetcher()
      const s1 = s !== false && typeof s !== 'string' ? await Promise.resolve(s) : s
      if (s1 === false) this.isEnd = true
      else {
        const s1type = typeof s1
        if (s1type !== 'string') throw new Error(`StringSplitter: fetcher value not string or false: ${s1type}`)
        if (!s1) continue
        result = s1
        break
      }
    }

    console.log(`StringSplitter._invokeFetcher '${result}' isEnd: ${!!this.isEnd}`)
    return result
  }
}
