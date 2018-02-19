/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import {Option, valueFlags, numeralities} from './Option'

import util from 'util'

export default class OptionBoolean extends Option {
  static type = 'boolean'

  constructor(o) {
    super(Object.assign({hasValue: valueFlags.never, numerality: numeralities.optionalOnce}, o))
    this.debug && console.log(`${this.m} constructor: ${util.inspect(this, {colors: true, depth: null})}`, valueFlags.never, numeralities.optionalOnce)
  }

  execute({name, value, i: {options}}) {
    if (value === undefined) value = true
    else value = !!value
    const {property} = this
    property && (options[property] = value)
  }
}
