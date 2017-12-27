/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
export default class ByIndex {
  nextIndex = 0
  map = {}
  heldMap = {}

  constructor({output}) {
    this.promise = new Promise(resolve => this._resolve = resolve)
    Object.assign(this, {output})
  }

  submit(value, index, hold) {
    const {map, heldMap, output} = this

    if (!hold) {
      if (output && index === this.nextIndex) {
        this.invokeOutput(value)
        this.nextIndex++
        this.flush()
      } else map[index] = value
    } else heldMap[index] = value
  }

  setAllSubmitted() {
    this.done = true
    this.checkComplete()
  }

  flush() {
    const {map, heldMap} = this
    for (;;) {
      const i = this.nextIndex
      const v = map[i]
      if (v) {
        delete map[i]
        this.invokeOutput(v)
      } else if (!heldMap[i]) break
      this.nextIndex++
    }
    this.checkComplete()
  }

  setOutput(fn) {
    this.output = fn
  }

  async invokeOutput(value) {
    const {output, useIgnore, ignoreValue} = this
    if (!useIgnore || value !== ignoreValue) output(value)
  }

  async checkComplete() {
    const {done, map, _resolve} = this
    done && !Object.keys(map).length && _resolve()
  }

  getHeld() {
    const {heldMap} = this
    return Object.keys(heldMap).sort().map(k => heldMap(k))
  }
}
