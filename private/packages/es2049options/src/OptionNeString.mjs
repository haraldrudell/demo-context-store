/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import OptionString from './OptionString'

export default class OptionNeString extends OptionString {
  static type = 'nestring'

  execute(o) {
    const {value, name} = o
    if (!value) return `option ${name} not non-empty string: ${typeof value}`
    super.execute(o)
  }
}
