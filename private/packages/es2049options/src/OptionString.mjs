/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import {Option, valueFlags} from './Option'

export default class OptionString extends Option {
  static type = 'string'
  valueName = 'string'

  constructor(o) {
    super(Object.assign({hasValue: valueFlags.always}, o))
  }

  execute({value, i: {options}}) {
    if (value === undefined) value = ''
    const {property} = this
    property && (options[property] = value)
  }
}
