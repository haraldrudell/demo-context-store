/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import Result from './Result'

export default class CheckerBase {
  constructor(o) {
    Object(o).debug && (this.debug = true)
  }

  failure(results) {
    const {m} = this
    let message = []
    results.forEach(({name, isFailure}) => isFailure && message.push(name))
    message = `Failed dependencies: ${message.join('\x20')}`
    return new Result({m, isFailure: true, message})
  }
}
