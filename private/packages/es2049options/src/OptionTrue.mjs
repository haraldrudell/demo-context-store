/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import OptionBoolean from './OptionBoolean'

export default class OptionTrue extends OptionBoolean {
  static type = 'true'
  value = true

  execute({name, value, i: {options}}) {
    if (value === undefined) value = false
    else value = !!value
    const {property} = this
    property && (options[property] = value)
  }

  _getOptionNames(names, property) {
    if (names === undefined && property) names = `-no-${property}`
    return super._getOptionNames(names, property)
  }
}
