/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import {setMDebug, classLogger} from 'es2049lib'

export default class Resolvers {
  map = {}
  list = []

  constructor(o) {
    setMDebug(o, this, 'Resolvers')
    classLogger(this, Resolvers)
  }

  addDependencyType(resolver) {
    const {map, list} = this
    if (typeof Object(resolver).getDependencyObject !== 'function') throw new Error(`${this.m} add item not Resolver`)
    const {name} = resolver
    if (map[name]) throw new Error(`${this.m} duplicate resolver type: ${name}`)
    map[name] = resolver
    list.push(resolver)
  }

  getDependencyObject(type, name) {
    const {map} = this
    const resolver = map[type]
    if (!resolver) throw new Error(`${this.m}.getObject: unknown resolver type: ${name}`)
    return resolver.getDependencyObject(name)
  }

  getInstantiatedDependencies() {
    const {list} = this
    const result = {}
    for (let resolver of list) result[resolver.name] = resolver.getObjects()
    return result
  }
}
