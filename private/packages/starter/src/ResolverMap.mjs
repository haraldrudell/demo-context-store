/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import {setMDebug, classLogger} from 'es2049lib'

import Resolvers from './Resolvers'

export default class ResolverMap {
  objects = {}

  constructor(o) {
    const {map, constr, resolvers} = setMDebug(o, this, 'ResolverMap')
    if (typeof constr !== 'function') throw new Error(`${this.m} constr argument not function`)
    if (!(resolvers instanceof Resolvers)) throw new Error(`${this.m} resolvers argument bad`)
    const keys = Object.keys(Object(map))
    const name = keys[0]
    if (keys.length !== 1 || !name || typeof name !== 'string') throw new Error(`${this.m} map argument not single-key object`)
    this.m += `_${name}`
    const data = Object(map[name])
    Object.assign(this, {name, data, constr, resolvers})
    classLogger(this, ResolverMap, {name})
  }

  getDependencyObject(itemName) {
    const {constr, data, resolvers, debug} = this
    const arg = data[itemName]
    if (!arg) throw new Error(`${this.m} unknown ${this.name}: ${itemName}`)
    return this.objects[itemName] = new constr({key: itemName, debug, ...arg, resolvers})
  }

  getObjects = () => this.objects
}
