/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import path from 'path'
import os from 'os'

export function parseConfig(config) {
  config = Object(config)
  return {
    dir: tildeExpand(config.dir, 'dir'),
    db: nonEmptyString(config.db, 'db'),
    dirs: parseDirs(config.dirs, 'dirs'),
    ssh: optional(config.ssh, 'ssh'),
    sql: config.sql,
  }
}

export function tildeExpand(value, p) {
  if (!value || typeof value !== 'string') throw new Error(`yaml property '${p}': not non-empty string`)
  return value.startsWith('~/') ? path.join(os.homedir(), value.substring(2)) : value
}

/*
export function arrayOfString(a, prop) {
  if (!Array.isArray(a)) throw new Error(`yaml property not array: '${prop}'`)
  a.forEach((s, i) => {
    if (!s || typeof s !== 'string') throw new Error(`yaml property '${prop} item ${i + 1}: not non-empty string`)
  })
}
*/

function parseDirs(dirs, prop) {
  const result = {}
  for (let [name, value] of Object.entries(Object(dirs)))
    if (value && typeof value === 'string') result[name] = value
    else throw new Error(`yaml property '${prop}' key '${name}': not non-empty string`)
  return result
}

function nonEmptyString(value, prop) {
  if (!value || typeof value !== 'string') throw new Error(`yaml property '${prop}': not non-empty string`)
  return value
}

function optional(value, prop) {
  if (value === undefined) return
  return nonEmptyString(value, prop)
}
