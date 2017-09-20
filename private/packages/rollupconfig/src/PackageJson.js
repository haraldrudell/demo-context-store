/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reerved.
*/
// rollup ECMAScript 2015: no class properties
import fs from 'fs'
import path from 'path'

export default class PackageJson {
  constructor(packageJson = path.join(fs.realpathSync(process.cwd()), 'package.json')) {
    const json = JSON.parse(fs.readFileSync(packageJson, 'utf8'))
    Object.assign(this, {filename: packageJson, json})
    if (!json) this.throw('bad json')
  }

  throw(s, p) {
    throw new Error(`${p || 'PackageJson'}: ${s} in: ${this.filename}`)
  }
}
