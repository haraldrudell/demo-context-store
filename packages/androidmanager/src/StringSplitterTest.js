import StringSplitter from './StringSplitter'

;(async () => {
  class ValueGenerator {
    constructor(a) {
      this.a = a
    }

    fetcher = () => {
      if (this.end) throw new Error('afterEnd')
      if (this.a.length) return this.a.shift()
      this.end = true
      return false
    }
  }

  async function doTest(input, expected, hadEOL) {
    console.log('test -- ', input)
    const s = new StringSplitter(new ValueGenerator(input).fetcher)
    let index = 0
    while (true) {
      const actual = await s.getLine()
      if (actual === false) {
        if (index !== expected.length) throw new Error('early end at' + index)
        break
      }
      index++
    }
    const actual = s.hadFinalEOL()
    if (actual !== hadEOL) throw new Error('e2' + !!actual)
  }

  await doTest([], [], false)
  await doTest(['a\n'], ['a'], true)
  await doTest(['a\r', '\nb\n'], ['a', 'b'], true)
})().catch(e => console.error('test error', e))
