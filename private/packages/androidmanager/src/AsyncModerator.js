const UPDATE_RESET = 0
const UPDATE_FOUNDTASK = 1
const UPDATE_LAUNCHTASK = 2
const UPDATE_COMPLETEDTASK = 3
const UPDATE_LAUNCHCOMPLETE = 4

export default class AsyncModerator {
  constructor(concurrent) {
    this.concurrent = concurrent
    const o = {}
    this.promise = new Promise((resolve, reject) => {
      o.resolve = resolve
      o.reject = reject
    })
    Object.assign(this.promise, o)

    this.foundTasks = 0
    this.launchedTasks = 0
    this.completedTasks = 0
    this.pending = []
    this.iterators = []
  }

  setAllSubmitted() {
    this.allSubmitted = true
    if (!this.iterators.length) this._update(UPDATE_LAUNCHCOMPLETE)
  }

  // iterators become tasks

  addAsyncIterator(i) {
console.log('addAsyncIterator', i)
    this.iterators.push(i)
    this._launchEverything()
  }

  addTask(promiseThunk) { // adds a promise, queue if too many
    this._update(UPDATE_FOUNDTASK)
    const running = this.launchedTasks - this.completedTasks
    if (running < this.concurrent) this._launchTask(promiseThunk)
    else this.pending.push(promiseThunk)
  }

  _launchEverything = () => this._launchTasks() && this._launchIteratorItems().catch(this.promise.reject)

  _haveSlots = () => this.launchedTasks - this.completedTasks < this.concurrent

  async _launchIteratorItems() {
    const iterators = this.iterators

    while (this._haveSlots() && iterators.length) {
      const iterator = iterators[0]
      const i = await iterator.next()
console.log('_launchIteratorItems', i.value)
      if (i.value) {
        this._update(UPDATE_FOUNDTASK)
        this._launchTask(i.value)
      }
      if (i.done && iterator === iterators[0]) {
        iterators.shift()
        if (!iterators.length && this.allSubmitted) this._update(UPDATE_LAUNCHCOMPLETE)
      }
    }
  }

  _launchTasks() { // true: slots are still available
    const pending = this.pending
    let haveMoreTasks, haveAvailableSlots

    for (;;) {
      haveMoreTasks = !!this.pending.length
      haveAvailableSlots = this._haveSlots()

      if (!haveMoreTasks || !haveAvailableSlots) break

      this._launchTask(pending.shift())
    }

    return haveAvailableSlots
  }

  // the only place that executes thunks

  _launchTask(promiseThunk) {
    this._update(UPDATE_LAUNCHTASK)
    promiseThunk().then(this._handleComplete).catch(this.promise.reject)
  }

  _handleComplete = v => {
    this._update(UPDATE_COMPLETEDTASK)
    this._launchEverything()
  }

  _update(v) {
    switch (v) {
      case UPDATE_FOUNDTASK: this.foundTasks++; break
      case UPDATE_LAUNCHTASK: this.launchedTasks++; break
      case UPDATE_COMPLETEDTASK: this.completedTasks++; break
      case UPDATE_LAUNCHCOMPLETE: this.launchComplete = true; break
      default: throw new Error(`update bad operator: ${Number(v)}`)
    }

    let s = `  total: ${this.foundTasks}${this.launchComplete ? '' : '…'} completed: ${this.completedTasks} remaining: ${this.foundTasks - this.completedTasks}`

    const sLength = s.length
    const spaces = this.sLength - sLength
    this.sLength = sLength
    if (spaces > 0) s += ' '.repeat(spaces)
    s += '\b'.repeat(s.length)

    process.stdout.write(s)

    if (this.launchComplete && this.launchedTasks === this.completedTasks) {
      console.log()
      this.promise.resolve()
    }
  }
}
