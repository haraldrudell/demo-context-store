/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import {getFn, Failure} from 'es2049lib'

export default class ParserBase {
  constructor(o) {
    const {debug, optionsData, name} = o || false
    this.m = String(name || 'ParserBase')
    debug && (this.debug = true)
    const {exit} = optionsData || false
    if ((this.exitFn = getFn(exit, this.defaultExit.bind(this))) instanceof Failure) throw new Error(`${this.m} optionsData.exit: ${Failure.text}`)
  }

  defaultExit(code) {
    process.exit(code)
  }
}
