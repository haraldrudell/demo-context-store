/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import OptionString from './OptionString'

import util from 'util'

export default class OptionNeString extends OptionString {
  static type = 'nestring'

  constructor(o) {
    super(o)
    this.debug && this.constructor === OptionNeString && console.log(`${this.m} constructor: ${util.inspect(this, {colors: true, depth: null})}`)
  }

  execute(o) {
    const {value, name} = o
    if (!value) return `option ${name} not non-empty string: ${typeof value}`
    super.execute(o)
  }
}
