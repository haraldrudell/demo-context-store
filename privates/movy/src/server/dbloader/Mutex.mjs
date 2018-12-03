/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
export default class Mutex {
  constructor() {
    this.queue = []
  }

  async wait() {
    return !this.busy
      ? (this.busy = true)
      : new Promise((resolve, reject) => this.queue.push(resolve))
  }

  done() {
    const {queue} = this
    if (queue.length) queue.shift()()
    else this.busy = false
  }
}
