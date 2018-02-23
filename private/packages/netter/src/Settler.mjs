/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import ResolverHOC from './ResolverHOC'

import util from 'util'

export default class Settler {
  constructor(o) {
    const {name, runners, emitter, debug} = o || false
    this.m = `Settler ${name}`
    debug && (this.debug = true)
    const st = typeof name
    if (!(this.name = name) || st !== 'string') throw new Error(`${this.m} name not non-empty string: type: ${st}`)
    if (!Array.isArray(runners)) throw new Error(`${this.m}: runners is not a list`)
    typeof emitter === 'function' && (this.emitter = emitter)
    this.roots = this._processRunners(runners)
    debug && this.constructor === Settler && console.log(`${this.m} constructor: ${util.inspect(this, {colors: true, depth: null})}`)
  }

  async run() {
    const {roots, debug} = this
    debug && console.log(`${this.m} executing: ${roots && roots.length}`)
    if (roots) {
      this.roots = null
      return Promise.all(roots.map(resolver => resolver.addInputResult()))
    }
  }

  _processRunners(runners) {
    const {emitter, debug} = this
    const roots = []
    const runnerNames = {}
    const mapToExtends = {}
    for (let [index, runner] of runners.entries()) {
      const {name, type, options} = runner || false

      // ensures that runner names are unique and usable
      const nt = typeof name
      if (!name || nt !== 'string') throw new Error(`${this.m} runner#${index}: name not non-empty string: type: ${nt}`)
      if (runnerNames[name]) throw new Error(`${this.m} runner#${index}: duplicate runner name: ${name}`)

      // instantiate
      const tt = typeof type
      if (tt !== 'function') throw new Error(`${this.m}: ${name} runner constructor not function: type: ${tt}`)

      const Resolver = mapToExtends[type] || (mapToExtends[type] = ResolverHOC(type))
      try {
        (runnerNames[name] = new Resolver(options)).resolverAddOptions({name, emitter, debug})
      } catch (e) {
        console.error(`${this.m} constructor error for runner: ${name}`)
        throw e
      }
    }

    // ensure that dependencies are usable and resolves to a runner
    for (let {name, depends} of runners) {
      const resolver = runnerNames[name]
      if (Array.isArray(depends) && depends.length) {
        const dependencies = {}
        for (let dependency of depends) {
          const otherResolver = runnerNames[dependency]
          if (!otherResolver) throw new Error(`${this.m} runner ${name} lists unknown dependency: ${dependency}`)
          otherResolver.resolverAddDependant(resolver)
          dependencies[dependency] = true
        }
        resolver.resolverAddDependencies(dependencies)
      } else roots.push(resolver)
    }

    return roots
  }
}
