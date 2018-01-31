/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved
*/
const m = 'readPackageJson'

export function readPackageJson(o, pj) {
  const result = {}

  const ot = typeof o
  if (ot !== 'object') throw new Error(`${m} first argument not object: ${ot}`)
  const tpj = typeof pj
  if (tpj !== 'object') throw new Error(`${m} second argument not object: ${tpj}`)

  for (let [key, value] of Object.entries(o)) result[key] = getField(pj, key, value)
  return result
}

export function getField(pj, key, defaultValue) {
  const v = pj[key]
  const hasDefault = typeof defaultValue === 'string'
  const value = v !== undefined || !hasDefault ? v : defaultValue
  return getNonEmptyString(value, `package.json field ${key}`)
}

export function getNonEmptyString(value, name) {
  const vt = typeof value
  if (!value || vt !== 'string') throw new Error(`${name}: not non-empty string: ${vt}`)
  return value
}
