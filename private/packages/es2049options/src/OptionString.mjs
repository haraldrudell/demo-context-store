/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import {Option, valueFlags} from './Option'

export default class OptionString extends Option {
  static type = 'string'

  constructor(o) {
    super(Object.assign({hasValue: valueFlags.always, valueName: 'string'}, o))
  }

  execute({value, i: {options}}) {
    if (value === undefined) value = ''
    const {property} = this
    if (property) {
      const optionsValue = options[property]
      if (optionsValue === undefined) options[property] = value
      else if (!Array.isArray(optionsValue)) options[property] = [optionsValue, value]
      else optionsValue.puah(value)
    }
  }
}
