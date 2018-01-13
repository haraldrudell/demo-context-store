/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
export default class Queue {
  constructor(o) {
    const {name: m = 'Queue'} = o || false
    Object.assign(this, {m})
    this.queue = Promise.resolve()
  }

  async submit(task) {
    const tt = typeof task
    if (tt !== 'function') throw new Error(`${this.m} submit argument not function: ${tt}`)

    const {queue} = this
    const p = this.awaitQueue(task, queue)
    this.queue = queue.then(() => p) // p must not throw
    const {e, v} = await p
    if (e) throw e
    return v
  }

  async awaitQueue(task, queue) {
    await queue
    let e
    const v = await this.execute(task).catch(err => e = err)
    return {e, v}
  }

  async execute(task) {
    return task()
  }
}
