/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import * as constrs from './builtInOptions'

const m = 'OptionTypeNames'

export const typeNames = getTypeNames()

function getTypeNames() {
  const typeMap = {}
  for (let [name, constr] of Object.entries(Object(constrs))) {
    const {type} = Object(constr)
    if (!type || typeof type !== 'string') throw new Error(`${m} OptionBuiltIn.${name}: type static property not non-empty string`)
    if (typeMap[type]) throw new Error(`${m} OptionBuiltIn.${name}: duplicate built-in type name`)
    typeMap[type] = type
  }
  return typeMap
}
