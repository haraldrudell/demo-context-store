/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reerved.
*/
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
    const rollup = (this.rollup = json.rollup || {})
    this.input = this._getJsFile(rollup.input)
    this.main = this._getJsFile(json.main)
    this.module = this._getJsFile(json.module)
    this.external = this._getExternal()
  }

  throw(s) {
    throw new Error(`PackageJson: ${s} in: ${this.filename}`)
  }

  _getExternal() {
    const external = [] // use array b/c elements has to be added to set one by one
    const {rollup, dependencies} = this.json
    if (rollup) {
      const {node, external: x, dependencies: d} = rollup
      if (Array.isArray(x)) Array.prototype.push.apply(external, x)
      if (node) Array.prototype.push.apply(external, nodeIgnores)
      if (d && dependencies) Array.prototype.push.apply(external, Object.keys(dependencies))
    }
    return Array.from(new Set(external)).sort()
  }

  _getJsFile(v) {
    v = String(v || '') || undefined // non-empty string or undefined
    if (v) {
      const hasExtension = path.extname(v).length
      return `${v}${hasExtension ? '' : this.extension}`
    } else return v
  }
}
