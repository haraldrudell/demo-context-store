/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import {Option} from './Option'

import path from 'path'

export default class OptionFilename extends Option {
  static type = 'filename'
  valueName = 'filename'

  constructor(o) {
    super(o)
    const {property, names} = this
    if (!property) throw new Error(`${this.m} option ${names[0]} of filename type: property cannot be empty`)
  }

  execute({name, value, i: {options}}) {
    const {isHasValueAlways, property} = this
    if (!value && isHasValueAlways) return `option ${name} of filename type: filename cannot be empty`
    options[property] = value ? path.resolve(value) : ''
  }
}
