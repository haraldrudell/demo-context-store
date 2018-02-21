/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import {writeBs} from './stdout'

export default class WriteBs {
  length = 0

  writeBs(s) {
    const {length} = this
    s = String(s || '')
    const padAfter = length - (this.length = s.length)
    if (padAfter > 0) s += '\x20'.repeat(padAfter)
    s && writeBs(s)
  }

  reset() {
    this.length = 0
  }

  log(s) {
    this.writeBs()
    console.log(s)
  }
}
