/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import Skip from './Skip'

export default class Task {
  constructor(o) {
    if (!o) o = false
    const {entry, index, allowedEntries, profile} = o
    const reference0 = `Profile: ${profile} list ${index}`
    switch (typeof entry) {
      case 'string':
        Object.assign(this, {
          printable: entry,
          fn: entry,
          depends: [],
          args: [],
        })
        break
      case 'object':
          const keys = Object.keys(entry)
          if (keys.length !== 1) throw new Error(`${reference0} dictionary not single key: ${keys.length}`)
          const printable = String(keys[0])
          let {fn, depends, args} = entry[printable]
          if (typeof depends === 'string' && depends) depends = [depends]
          if (args === undefined) args = []
          else if (!Array.isArray(args)) args = [args]
          Object.assign(this, {printable, fn, depends, args})
          break
      default: throw new Error(`${reference0} value not dictionary: ${typeof entry}`)
    }
    if (!this.printable) throw new Error(`${reference0} name empty`)
    const reference = this.reference = `Profile: ${profile} list ${this.printable}`

    const fnThis = this.fnThis = allowedEntries[this.fn]
    if (!fnThis || typeof fnThis[this.fn] !== 'function') throw new Error(`${reference} function not available: '${this.fn}'`)
    if (!Array.isArray(this.depends)) throw new Error(`${reference} depends not list`)
  }

  resolve(taskMap) {
    for (let [index, taskName] of this.depends.entries()) {
      const task = taskMap[taskName]
      if (!task) throw new Error(`${this.reference} dependency unknown: ${taskName}`)
      this.depends[index] = task
    }
    this.isResolved = true
  }

  async run() {
    if (!this.isResolved && this.depends.length) throw new Error(`${this.reference} run invoked before resolve`)
    let {promise, depends} = this
    if (promise) return promise // run was already invoked

    return this.promise = !depends.length
      ? this._begin()
      : this.resolveDependencyPromises()
  }

  _begin() {
    return Promise.resolve(this.fnThis[this.fn](...this.args)).then(v => this._end(v))
  }

  _end(v) {
    v.printable = this.printable
    return v
  }

  async resolveDependencyPromises() {
    const promises = []
    for (let task of this.depends) promises.push(task.run())
    const results = await Promise.all(promises)
    const isSuccess = results.every(v => !v.isFailure)
    return isSuccess
      ? this._begin()
      : this._skip(results)
  }

  _skip(results) {
    return Object.assign(new Skip({results}), {printable: this.printable})
  }
}
