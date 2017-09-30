/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import Task from './Task'

export default class LoggingTask extends Task {
  async _begin() {
    console.log(`Starting: ${this.printable}`)
    // TODO https://github.com/babel/babel/issues/3930
    return Task.prototype._begin.call(this)
    //return super._begin()
  }

  _end(result) {
    // TODO https://github.com/babel/babel/issues/3930
    const v = Task.prototype._end.call(this, result)
    //const v = super._end(result)
    console.log(`Completed ${v.printable}: ${v}`)
    return v
  }

  _skip(results) {
    // TODO https://github.com/babel/babel/issues/3930
    const v = Task.prototype._end.call(this, results)
    //const v = super._skip(results)
    console.log(`Skip ${v.printable}: ${v}`)
    return v
  }
}
