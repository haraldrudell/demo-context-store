/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import {setMDebug, classLogger} from 'es2049lib'

import ResolverMap from './ResolverMap'

export default class Resolver extends ResolverMap {
  constructor(o) {
    super(o)
    const {prop, debug} = setMDebug(o, this, `Resolver_${this.name}`)
    const {data: d0} = this
    if (Array.isArray(d0)) {
      if (!prop || typeof prop !== 'string') throw new Error(`${this.m} prop argument not non-empty string`)
      const list = []
      const data = {}
      for (let [i, element] of d0.entries()) { // iterate over service-name array entries
        element = {...element} // should be a single-key dictionary
        const keys = Object.keys(element)
        if (keys.length !== 1) throw new Error(`${this.m} list#${i}: not single-key dictionary`)
        if (!element[prop]) element[prop] = keys[0] // default to key value
        const key = element[prop]
        if (!key || typeof key !== 'string') throw new Error(`${this.m} list#${i}: ${prop} value not non-empty string`)
        if (data[key]) throw new Error(`${this.m} duplicate value for ${prop}`)
        data[key] = element
        list.push(key)
      }
      Object.assign(this, {data, list})
    }
    classLogger(this, Resolver, {debug, data: this.data})
  }

  getObjects() {
    const {list, objects} = this
    return list
      ? list.filter(k => objects[k]).reduce((prev, k) => prev[k] = objects[k] && prev, {})
      : super.getObjects()
  }
}
