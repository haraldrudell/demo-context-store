/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import {Option} from './Option'
import {getFn, getNonEmptyString, Failure} from 'es2049lib'

const m = 'OptionHOC'

export default function OptionHOC(fn, name) {
  let s
  if ((s = getFn(fn)) instanceof Failure) throw new Error(`${m} fn: ${s.text}`)
  if ((s = getNonEmptyString(name)) instanceof Failure) throw new Error(`${m} name: ${s.text}`)
  return class OptionCustom extends Option {
    static type = name
    valueName = 'value'
    fn

    execute(o) {
      return fn(o)
    }
  }
}
