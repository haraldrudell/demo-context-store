/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
export default class Pacer {
  constructor(max) {
    this.max = max > 0 ? Number(max) : 1
    this.active = this.maxActive = 0
    this.queue = []
  }

  async getTurn() {
    const {active, max} = this
    if (active < max) {
      if (++this.active > this.maxActive) this.maxActive = this.active
      return
    }
    return new Promise((resolve, reject) => this.queue.push(resolve))
  }

  done() {
    const {queue} = this
    if (queue.length) {
      const r = queue.shift()
      r()
    } else this.active--
  }
}
