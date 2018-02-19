/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import {Option} from './Option'

export default class OptionInteger extends Option {
  static type = 'integer'
  valueName = 'integer'

  execute(o) {
    const {name, value, i: {options}} = o
    const {props, property} = this
    const m = `option ${name}`
    const number = +value
    if (isNaN(number)) return `${m}: value not numeric: ${value}`
    if (!Number.isInteger(number)) return `${m}: value not integer: ${value} ${number}`
    const {min, max} = props
    if (typeof min === 'number' && value < min) return `${m}: ${value} cannot be less than ${min}`
    if (typeof max === 'number' && value > max) return `${m}: ${value} cannot be greater than ${max}`
    options[property] = number
  }
}
