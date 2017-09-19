/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reerved.
*/
// rollup ECMAScript 2015: no class properties
import fs from 'fs'
import path from 'path'
import nodeIgnores from './nodepackages'

export default class PackageJson {
  constructor(
    packageJson = path.join(fs.realpathSync(process.cwd()), 'package.json'),
    extension = '.js') {
    const json = JSON.parse(fs.readFileSync(packageJson, 'utf8'))
    Object.assign(this, {extension, filename: packageJson, json})
    if (!json) this.throw('bad json')
    const rollup = (this.rollup = json.rollup || {}) // object, or at least truish
    this.input = this._getInput(rollup.input) // non-empty string, undefined or object
    this.main = this._getJsFile(json.main) // non-empty string or undefined
    this.module = this._getJsFile(json.module) // non-empty string or undefined
    this.external = this._getExternal() // array of string
  }

  throw(s) {
    throw new Error(`PackageJson: ${s} in: ${this.filename}`)
  }

  _getExternal() {
    const external = [] // use array b/c elements has to be added to set one by one
    const {rollup, dependencies} = this.json
    if (rollup) {
      const {node, external: x, dependencies: d} = rollup
      if (Array.isArray(x) && this._ensureArrayOfString(x))
        Array.prototype.push.apply(external, x)
      if (node) Array.prototype.push.apply(external, nodeIgnores)
      if (d && dependencies) Array.prototype.push.apply(external, Object.keys(dependencies))
    }
    return Array.from(new Set(external)).sort()
  }

  _getInput(i) {
    return typeof i === 'object' ? i : this._getJsFile(i)
  }

  _getJsFile(v) {
    v = String(v || '') || undefined // non-empty string or undefined
    if (v) {
      const hasExtension = path.extname(v).length
      return `${v}${hasExtension ? '' : this.extension}`
    } else return v
  }

  _ensureArrayOfString(a) {
    for (let [index, value] of a.entries()) {
      const vt = typeof value
      if (!value || vt !== 'string') throw new Error(`not array of non-empty string: index: ${index} type: ${vt}`)
    }
  }
}
