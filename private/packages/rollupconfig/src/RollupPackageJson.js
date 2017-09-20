/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reerved.
*/
// rollup ECMAScript 2015: no class properties
import PackageJson from './PackageJson'

import nodeIgnores from './nodepackages'

import path from 'path'

export class RollupPackageJson extends PackageJson {
  constructor(o) {
    super(o)
    const {extension = '.js'} = o || false
    const {json: {rollup, main, module}} = this
    if (!rollup) this.throw('rollup.input must be string or array')
    Object.assign(this, {rollup, extension})
    const {input} = rollup
    Object.assign(this, {
      input: Array.isArray(input) ? input : this._getJsFile(input), // non-empty string, undefined or array
      main: this._getJsFile(main), // non-empty string or undefined
      module: this._getJsFile(module), // non-empty string or undefined
      external: this._getExternal(), // array of string
      })
  }

  throw(s) {
    super.throws(s, 'RollupPackageJson')
  }

  _getExternal() {
    const external = [] // use array b/c elements has to be added to Set one by one
    const {rollup: {node, external: ex, dependencies: useDeps}, json: {dependencies}} = this
    if (Array.isArray(ex) && this._ensureArrayOfString(ex, 'package.json rollup.external')) Array.prototype.push.apply(external, ex)
    if (node) Array.prototype.push.apply(external, nodeIgnores)
    if (useDeps && dependencies) Array.prototype.push.apply(external, Object.keys(dependencies))
    return Array.from(new Set(external)).sort()
  }

  _getJsFile(v) {
    v = String(v || '') || undefined // non-empty string or undefined
    if (v) { // has value, possibly append default extension
      const hasExtension = path.extname(v).length
      return `${v}${hasExtension ? '' : this.extension}`
    }
  }
}

function ensureArrayOfString(a, m) {
  for (let [index, value] of a.entries()) {
    const vt = typeof value
    if (!value || vt !== 'string') throw new Error(`${m}: not array of non-empty string index: ${index} type: ${vt}`)
  }
  return true
}

export function getRollupOutput({main, module, output}) {
  if (typeof output !== 'object') {
    output = []
    if (main) output.push({file: main, format: 'cjs'})
    if (module) output.push({file: module, format: 'es'})
    return output.length ? output : undefined
  } else return output
}

export function deleteUndefined(config) {
  if (config) for (let property of Object.keys(config))
    if (config[property] === undefined) delete config[property]
}

export function assembleConfig(getBaseConfig, getConfig) {
  const pkg = new RollupPackageJson() // cannot be imported because we don’t know where it is
  const configIsArray = Array.isArray(pkg.input)
  const config = configIsArray ? [] : {}

  // assemble config
  const {rollup, rollup: {print}} = pkg
  if (print) console.log('package.json rollup.print true: verbose output')
  const baseConfig = getBaseConfig(rollup)
  if (!configIsArray) {
    const {input, main, module, external} = pkg // input external was processed by RollupPackageJson
    Object.assign(config, getConfig(Object.assign({}, rollup, {baseConfig, input, main, module, external})))
  } else {
    const {external: expkg} = pkg
    let {clean} = rollup
    for (let inputElement of pkg.input) {
      const {input, main: ma, module: mo, output, external: ex, shebang} = inputElement || false
      const main = ma !== true ? ma : pkg.main
      const module = mo !== true ? mo : pkg.module
      const external = ex !== undefined && ensureArrayOfString(ex) ? ex : expkg
      config.push(getConfig(Object.assign({}, rollup, {baseConfig, input, main, module, output, external, shebang, clean})))
      clean = false
    }
  }

  return config
}
