/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
export function getNonEmptyString(value, errorFn, defaultValue, undefinedOk) {
  return checkType({value, errorFn, defaultValue, undefinedOk, type: 'string', m: 'non-empty string'})
}

export function getObject(value, errorFn, defaultValue, undefinedOk) {
  return checkType({value, errorFn, defaultValue, undefinedOk, type: 'object', m: 'object'})
}

function checkType({value, errorFn, defaultValue, undefinedOk, type, m}) {
  getFunction(errorFn)
  if (value === undefined) value = defaultValue
  if (!(value === undefined && undefinedOk)) {
    const vt = typeof value
    if (!value || vt !== type) throw new Error(errorFn(`not ${m}: type: ${vt}`))
  }
  return value
}

function getFunction(fn, m) {
  const ft = typeof fn
  if (ft !== 'function') throw new Error(`${m} not function: ${ft}`)
  return ft
}
