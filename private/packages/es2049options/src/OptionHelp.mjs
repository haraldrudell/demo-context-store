/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import {Option} from './Option'

export default class OptionHelp extends Option {
  static type = 'help'

  constructor(o) {
    super(o)
    const {props: {fn}} = this
    const ft = typeof fn
    if (ft !== 'function') throw new Error(`${this.m} fn not function: ${ft}`)
  }

  execute(o) {
    const {props: {fn}} = this
    return fn(o)
  }
}
