/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved
*/
import pj from '../package.json'

export function readPackageJson(o) {
  const result = {}
  for (let [key, value] of Object.entries(Object(o))) result[key] = getField(key, value)
  return result
}

export function getField(key, defaultValue) {
  const v = Object(pj)[key]
  const value = v !== undefined || typeof defaultValue !== 'string' ? v : defaultValue
  return getNonEmptyString(value, `package.json field ${key}`)
}

export function getNonEmptyString(value, name) {
  const vt = typeof value
  if (!value || vt !== 'string') throw new Error(`${name}: not non-empty string: ${vt}`)
  return value
}
