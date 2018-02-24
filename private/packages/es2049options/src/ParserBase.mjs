/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import {setMDebug, getFn} from 'es2049lib'

export default class ParserBase {
  constructor(o) {
    const {optionsData} = setMDebug(o, this, 'ParserBase')
    const {exit} = Object(optionsData)
    let s = {}
    if (getFn({exitFn: exit, s}, this.defaultExit.bind(this))) throw new Error(`${this.m} optionsData.exit: ${s.text}`)
    Object.assign(this, s.properties)
  }

  defaultExit(code) {
    process.exit(code)
  }
}
