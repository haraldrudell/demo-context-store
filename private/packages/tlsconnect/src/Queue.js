/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
export default class Queue {
  constructor(o) {
    const {m = 'Queue'} = o || false
    Object.assign(this, {m})
    this.queue = Promise.resolve()
  }

  async submit(task) {
    const tt = typeof task
    if (tt !== 'function') throw new Error(`${this.m} submit argument not function: ${tt}`)

    let result = {}
    const {queue} = this
    const p = this.awaitQueue(task, result, queue)
    this.queue = queue.then(() => p)

    await p
    const {e, v} = result
    if (e) throw e
    return v
  }

  async awaitQueue(task, result, queue) {
    await queue
    let e
    const v = await this.execute(task).catch(err => e = err)
    if (e) result.e = e
    else result.v = v
  }

  async execute(task) {
    return task()
  }
}
