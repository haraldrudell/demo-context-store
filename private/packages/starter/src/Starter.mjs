/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import {setMDebug, classLogger} from 'es2049lib'

import Resolver from './Resolver'
import Resolvers from './Resolvers'
import Service from './Service'
import Mount from './Mount'
import VolumeGroup from './VolumeGroup'
import Raid from './Raid'

export default class Starter {
  constructor(options) {
    const {start: s0, services, mounts, vgs, raids, debug} = setMDebug(options, this, 'Starter')
    let e
    if ((e = this.isArray(s0, 'start'))) throw e

    const resolvers = new Resolvers({debug})
    for (let resolver of [
      {map: {services}, prop: 'name', constr: Service},
      {map: {mounts}, constr: Mount},
      {map: {vgs}, constr: VolumeGroup},
      {map: {raids}, constr: Raid},
    ]) resolvers.addDependencyType(new Resolver({debug, resolvers, ...resolver}))

    const startList = s0.map((s, i) => {
      if (!s || typeof s !== 'string') throw new Error(`${this.m} start#${i}: not non-empty string`)
      resolvers.getDependencyObject('services', s)
      return s
    })

    Object.assign(this, {startList, ...resolvers.getInstantiatedDependencies()})
    classLogger(this, Starter, {services: Object.keys(Object(this.services))})
  }

  async start() {
    const {startList, services, debug} = this
    debug && console.log(`${this.m}.start: startList: ${startList.join(',')}`)
    return Promise.all(startList.map(name => this.ensure(services[name])))
  }

  async ensure(service) {
    const {debug} = this
    if (!await service.isOk()) {
      debug && console.log(`${this.m}.ensure: not ok: ${service.name}: starting…`)
      await service.start()
      debug && console.log(`${this.m}.ensure: started: ${service.name}`)
    }
  }

  isArray(v, msg) {
    return !Array.isArray(v) && new Error(`${this.m} ${msg} not array`)
  }
}
