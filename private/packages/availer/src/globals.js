/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import fs from 'fs'

// either we have run Webpack, and global variables are defined
// or we have to read package.json, just not using import
const result = {}
let didReadPackageJson

export default function globals() {
  let needPackageJson

  const p = typeof process !== 'undefined' && process.env
  if (p) {
    if (!result.THE_VERSION) {
      if (p.THE_VERSION) result.THE_VERSION = p.THE_VERSION
      else needPackageJson = true
    }
    if (!result.THE_BUILD) {
      if (p.THE_BUILD) result.THE_BUILD = p.THE_BUILD
    }
    if (!result.THE_NAME) {
      if (p.THE_NAME) result.THE_NAME = p.THE_NAME
      else needPackageJson = true
    }
  }

  if (needPackageJson && !didReadPackageJson) {
    didReadPackageJson = true
    try {
      const s = fs.readFileSync('package.json', 'utf8')
      const o = JSON.parse(s)
      if (!result.THE_VERSION) result.THE_VERSION = o.version
      if (!result.THE_NAME) result.THE_NAME = o.singleFile && o.singleFile.name ||
        o.name
    } catch (e) {
      console.error(e)
    }
  }
  return result
}
