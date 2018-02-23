/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import Result from './Result'

import util from 'util'

export default function ResolverHOC(BaseClass) {
  return class Resolver extends BaseClass {
    resolverDependants = []
    resolverInputs = []
    resolverDependencies = {}

    resolverAddOptions(o) {
      const {name, emitter, debug} = Object(o)
      if (!(this.resolverName = name) || typeof name !== 'string') throw new Error('Resolver: name not set')
      this.resolverM = `Resolver: ${name}`
      typeof emitter === 'function' && (this.resolverEmitter = emitter)
      debug && (this.debug = true) && this.constructor === Resolver && console.log(`${this.resolverM} constructor: ${util.inspect(this, {colors: true, depth: null})}`)
    }

    resolverAddDependant(r) {
      const {resolverDependants} = this
      if (typeof Object(r).addInputResult !== 'function') throw new Error(`${this.resolverM}: dependant not Resolver instance`)
      if (!resolverDependants) throw new Error(`${this.resolverM}: resolverAddDependant after run`)
      resolverDependants.push(r)
    }

    resolverAddDependencies(list) {
      this.resolverDependencies = list
    }

    async addInputResult(o) {
      const {resolverDependencies, resolverInputs, resolverDependants, resolverEmitter, resolverName, debug} = this
      const remaining = resolverDependencies ? Object.keys(resolverDependencies).length : 0
      debug && console.log(`${this.resolverM} addInputResult input need: ${remaining} now: ${o ? 1 : 0}`)
      const {name: inputName, result: inputResult} = o || false
      if (remaining) {
        if (!(inputResult instanceof Result)) throw new Error(`${this.resolverM} result from ${inputName} not a Result instance`)
        if (!resolverDependencies) throw new Error(`${this.resolverM} addInputResult after run`)
        if (!resolverDependencies[inputName]) throw new Error(`${this.resolverM} unexpected result from ${inputName}`)
        delete resolverDependencies[inputName]
        resolverInputs.push(inputResult)
        if (Object.keys(resolverDependencies).length) return
      }

      this.resolverInputs = this.resolverDependants = this.resolverEmitter = this.resolverDependencies = null
      const isOk = resolverInputs.every(d => !d.isFailure)
      const result = await super.run(isOk, resolverInputs)
      if (!(result instanceof Result)) throw new Error(`${this.resolverM} result not a Result instance`)
      const name = result.name = resolverName

      debug && console.log(`${this.resolverM} dispatch:`, {name, result})
      return Promise.all((resolverEmitter ? [resolverEmitter(result)] : [])
        .concat(resolverDependants.map(r => r.addInputResult({name, result}))))
    }
  }
}
