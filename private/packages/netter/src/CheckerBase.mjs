/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import Result from './Result'

import {setMDebug} from 'es2049lib'

export default class CheckerBase {
  constructor(o) {
    setMDebug(o, this, 'CheckerBase')
  }

  getDependencyFailure(results) {
    let message = []
    results.forEach(({name, isFailure}) => isFailure && message.push(name))
    message = `Failed dependencies: ${message.join('\x20')}`
    return this.getFailure({message})
  }

  getFailure(resultProperties) {
    return new Result({name: this.m, isFailure: true, ...resultProperties})
  }

  getSuccess(resultProperties) {
    return new Result({name: this.m, isFailure: false, ...resultProperties})
  }
}
