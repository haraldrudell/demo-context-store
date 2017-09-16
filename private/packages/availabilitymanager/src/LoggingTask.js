/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import Task from './Task'

export default class LoggingTask extends Task {
  async _begin() {
    console.log(`Starting: ${this.printable}`)
    return super._begin()
  }

  _end(result) {
    const v = super._end(result)
    console.log(`Completed ${v.printable}: ${v}`)
    return v
  }

  _skip(results) {
    const v = super._skip(results)
    console.log(`Skip ${v.printable}: ${v}`)
    return v
  }
}
