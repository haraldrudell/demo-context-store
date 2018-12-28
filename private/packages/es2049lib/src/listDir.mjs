/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import {getNonEmptyString, getNonEmptyStringOrUndefined, getNonEmptyStringRegExpUndefinedAsArray} from './typeVerifiers'

import fs from 'fs-extra'

import path from 'path'

const m = 'listDir'

export async function* listDir(o) {
  const {dir, include, exclude, type, recurse, debug} = getParameters(o)
  const dir0 = await fs.realpath(dir)
  const dirs = ['']
  debug && console.log(`${m}`, {dirs, include, exclude, type, recurse})
  while (dirs.length) {
    const rel = dirs.shift()
    for (let dirent of await fs.readdir(path.join(dir0, rel), {withFileTypes: true})) {
      const {name} = dirent
      const relName = path.join(rel, name)
      if (exclude && exclude.some(i => typeof i === 'string' ? relName.includes(i) : i.test(relName))) continue
      recurse && dirent.isDirectory() && dirs.push(relName)
      if ((type && (
        (dirent.isBlockDevice() && !type.includes('b')) ||
        (dirent.isCharacterDevice() && !type.includes('c')) ||
        (dirent.isDirectory() && !type.includes('d')) ||
        (dirent.isFIFO() && !type.includes('p')) ||
        (dirent.isFile() && !type.includes('f')) ||
        (dirent.isSocket() && !type.includes('s')) ||
        (dirent.isSymbolicLink() && !type.includes('l'))
        )) ||
        (include && !include.every(i => typeof i === 'string' ? relName.includes(i) : i.test(relName)))
      ) continue
      yield path.join(dir0, relName)
    }
  }
}

function getParameters(o) {
  const {dir, include, exclude, type, recurse, debug} = Object(o)
  let s = {}
  if (getNonEmptyString({s, dir})) throw new Error(`${m}: dir ${s.text}`)
  if (getNonEmptyStringOrUndefined({s, type})) throw new Error(`${m}: dir ${s.text}`)
  if (getNonEmptyStringRegExpUndefinedAsArray({s, include})) throw new Error(`${m}: include ${s.text}`)
  if (getNonEmptyStringRegExpUndefinedAsArray({s, exclude})) throw new Error(`${m}: exclude ${s.text}`)
  recurse !== false && (s.properties.recurse = true)
  debug && (s.properties.debug = true)
  return s.properties
}
