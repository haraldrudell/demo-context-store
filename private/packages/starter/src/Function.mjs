/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import {setMDebug} from 'es2049lib'

import Resolvers from './Resolvers'

export default class Function {
  // node --print "'123e4567-e89b-12d3-a456-426655440000'.match(/^[0-9a-fA-F]{8}[:-]([0-9a-fA-F]{4}[:-]){3}[0-9a-fA-F]{12}$/)"
  static uuidMatcher = /^[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}$/
  static spawnAsyncOptions = {timeout: 3e3} // 3 s

  constructor(o) {
    const {resolvers, name, deps = [], depMap} = setMDebug(o, this, 'Function')
    if (!(resolvers instanceof Resolvers)) throw new Error(`${this.m} resolvers not a Resolvers`)
    if (!name || typeof name !== 'string') throw new Error(`${this.m} name not non-empty string`)
    else if (!Array.isArray(deps)) throw new Error(`${this.m} deps not array`)
    if (!depMap) throw new Error(`${this.m} depMap missing`)
    const depsObjects = []
    for (let [i, dep] of deps.entries()) {
      const entries = Object.entries(Object(dep))
      if (entries.length !== 1) throw new Error(`${this.m} deps#${i}: not single-entry object`)
      const [depType, depName] = entries[0]
      if (!depType || typeof depType !== 'string') throw new Error(`${this.m} deps#${i}: key not non-empty string`)
      if (!depName || typeof depName !== 'string') throw new Error(`${this.m} deps#${i}: value not non-empty string`)
      if (!depMap[depType]) throw new Error(`${this.m} deps#${i}: dependency type ${depType} not allowed for type: ${name}`)
      depsObjects.push(resolvers.getDependencyObject(depType, depName))
    }
    Object.assign(this, {resolvers, name, deps: depsObjects})
  }

  async isOk() {
    throw new Error(`${this.m} isOk ot implemented`)
  }

  async start() {
    throw new Error(`${this.m} start not implemented`)
  }

  async ensureDeps(doStart) {
    const {deps} = this
    const p = []
    const result = true
    for (let dep of deps) {
      if (await dep.isOk()) continue
      //debug && console.log(`${this.m}.ensureDeps: Starting not ok service: ${dep.name}…`)
      if (doStart) p.push(dep.start())
      else return false
    }
    return doStart ? Promise.all(p) : result
  }

  isUuid(s) {
    const {uuidMatcher} = Function
    return !!String(s).match(uuidMatcher)
  }
}
