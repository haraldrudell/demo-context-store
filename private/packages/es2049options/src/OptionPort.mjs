/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import OptionInteger from './OptionInteger'
import {valueFlags} from './Option'

export default class OptionPort extends OptionInteger {
  static type = 'port'
  valueName = 'port'

  constructor(o) {
    super(Object.assign({hasValue: valueFlags.always}, o))
    console.log('es2049optionsOptionPort', {hasValue: valueFlags.always}, o)
    const {props} = this
    if (props.min == null) props.min = 1
    if (props.max == null) props.max = 65535
  }
}
