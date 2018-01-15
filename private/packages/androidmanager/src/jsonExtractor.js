/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved
*/
import json from '../package.json'

const fieldToProperty = {
  name: 'name',
  version: 'version',
}

export function getJson(name) {
  const result = {}
  for (let [field, prop] of Object.entries(fieldToProperty)) {
    result[prop] = getNonEmptyStringValue(json, field, `${name} package.json field ${field}`)
  }
  return result
}

export function getNonEmptyStringValue(jsonS, key, msg) {
  const value = Object(jsonS)[key]
  const tv = typeof value
  if (tv !== 'string' || !value) throw new Error(`${msg} key value not non-empty string: ${tv} ${value}`)
  return value
}
