/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
export function getNonEmptyString(value, defaultValue) {
  if (value === undefined) value = defaultValue
  const vt = typeof value
  if (value && vt === 'string') return value
  return new Failure(`not non-empty string: type: ${vt}`)
}

export function getNonEmptyStringOrUndefined(value, defaultValue) {
  if (value === undefined) if ((value = defaultValue) === undefined) return value
  const vt = typeof value
  if (value && vt === 'string') return value
  return new Failure(`not non-empty string or undefined: type: ${vt}`)
}

export function getStringOrFunctionOrUndefined(value, defaultValue) {
  if (value === undefined) if ((value = defaultValue) === undefined) return value
  const vt = typeof value
  if (vt !== 'string' && vt !== 'function') return new Failure(`not non-empty string or function or undefined: type: ${vt}`)
  return value
}

export function getNonEmptyStringOrArrayOfAsArray(value, defaultValue) {
  if (value === undefined) value = defaultValue
  if (!Array.isArray(value)) {
    const vt = typeof value
    if (value && vt === 'string') return [value]
    return new Failure(`not non-empty string or list of non-empty string: type: ${vt}`)
  } else for (let [index, aValue] of value.entries()) {
    const vt = typeof aValue
    if (!value || vt !== 'string') return new Failure(`index #${index}: not non-empty string: type: ${vt}`)
  }
  return value
}

export function getArrayOfNonEmptyString(value, defaultValue) {
  if (value === undefined) value = defaultValue
  if (!Array.isArray(value)) return new Failure(`not array`)
  for (let [index, aValue] of value.entries()) {
    const vt = typeof aValue
    if (!aValue || vt !== 'string') return new Failure(`index #${index}: not non-empty string: type: ${vt}`)
  }
  return value
}

export function getRegExp(value, defaultValue) {
  if (value === undefined) value = defaultValue
  if (!(value instanceof RegExp)) return new Failure(`not regular expression`)
  return value
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

export function ensureListOfNonEmptyString(ssh, m) {
  if (!Array.isArray(ssh)) throw new Error(`${m}: not array`)
  for (let [index, value] of ssh.entries()) {
    const vt = typeof value
    if (!value || vt !== 'string') throw new Error(`${m}: element at index ${index} not non-empty string: type: ${vt}`)
  }
  return ssh
}

export function ensureListOfString(ssh, m) {
  if (!Array.isArray(ssh)) throw new Error(`${m}: not array`)
  for (let [index, value] of ssh.entries()) {
    const vt = typeof value
    if (vt !== 'string') throw new Error(`${m}: element at index ${index} not string: type: ${vt}`)
  }
  return ssh
}

export function ensurePortNumber(port, m) {
  const value = +port
  if (!(value > 0) || !(value <= 65535)) throw new Error(`${m} not >0 <= 65535`)
  return value
}

export function checkTimeval(timeval, msg, defaultValue) {
  const number = +(timeval !== undefined ? timeval : defaultValue)
  if (!(number > 0)) throw new Error(`${msg} bad timeval: type: ${typeof timeval}`)
  return number
}

export function getFn(fn, defaultValue) {
  if (fn === undefined) fn = defaultValue
  const ft = typeof fn
  return ft === 'function' ? fn : new Failure(`not function: type: ${ft}`)
}

export class Failure {
  constructor(o) {
    if (!o) (o = false)
    else if (typeof o === 'string') o = {text: o}
    o.text = String(o.text || 'Undefined Type Failure')
    Object.assign(this, o)
  }
}
