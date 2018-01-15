/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
export default class ByIndex {
  indexToOutput = 0
  submitCount = 0
  fileMap = {}
  directoryMap = {}

  constructor({output, completeCount}) {
    Object.assign(this, {output, completeCount})
  }

  submit(value, index, isDirectory) {
    const {fileMap, directoryMap, output, indexToOutput} = this

    this.submitCount++
    if (!isDirectory) {
      if (output && index === indexToOutput) {
        output(value)
        this.indexToOutput++
        this.flush()
      } else fileMap[index] = value
    } else directoryMap[index] = value
    return this.isDone()
  }

  setOutput(fn) {
    this.output = fn
    this.flush()
  }

  getHeld() {
    const {directoryMap} = this
    return Object.keys(directoryMap).sort().map(key => directoryMap[key])
  }

  isDone = () => this.output && this.submitCount === this.completeCount

  flush() {
    const {fileMap, directoryMap, output} = this
    for (;;) {
      const i = this.indexToOutput
      const v = fileMap[i]
      if (v) {
        delete fileMap[i]
        output(v)
      } else if (!directoryMap[i]) break
      this.indexToOutput++
    }
  }
}
