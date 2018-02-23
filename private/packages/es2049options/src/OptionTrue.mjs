/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import OptionBoolean from './OptionBoolean'

export default class OptionTrue extends OptionBoolean {
  static type = 'true'

  constructor(o) {
    super(Object.assign({value: true}, o))
  }

  execute({name, value, i: {options}}) {
    if (value === undefined) value = false
    else value = !!value
    const {property} = this
    property && (options[property] = value)
  }

  _getOptionNames(names, property, key) {
    if (names === undefined && (property || key)) names = `-no-${property || key}`
    return super._getOptionNames(names, property)
  }
}
