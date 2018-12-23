/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import {setMDebug, classLogger} from 'es2049lib'

import Function from './Function'
import { spawnAsync } from 'allspawn';

export default class Service extends Function {
  static depMap = {services:1, vgs: 1, raids: 1, mounts: 1}
  static systemCtl = 'systemctl'
  static sctlStatus = 'status'
  static sctlStop = 'stop'
  static sctlStart = 'start'
  static systemCtlSpawn = {options: {silent: true, ...Service.spawnAsyncOptions}}

  constructor(o) {
    const type = 'Service'
    const typeName = Object(o).name || Object(o).key || 'anonymous'
    const name = `${typeName}${type}`
    o = {...o, name, depMap: Service.depMap}
    super(o)
    Object.assign(this, {service: typeName})
    const {debug, noSystemCtl} = setMDebug(o, this)
    noSystemCtl && (this.noSystemCtl = true)
    classLogger(this, Service, {service: this.service, deps: this.deps.map(d => d.name), debug})
  }

  async isOk() {
    const {systemCtlSpawn} = Service
    const {debug, noSystemCtl} = this
    if (!await this.ensureDeps()) return false
    const result = noSystemCtl
      ? true
      : await spawnAsync({args: this.statusCmd(), ...systemCtlSpawn}).catch(e => e)
    const success = !(result instanceof Error)
    debug && console.log(`${this.m}.isOk: ${success ? true : `failed: result: '${result}'`}`)
    return success
  }

  async start() {
    const {systemCtlSpawn} = Service
    const {noSystemCtl, debug} = this
    debug && console.log(`${this.m}.start…`)
    !noSystemCtl && await spawnAsync({args: this.stopCmd(), echo: true, ...systemCtlSpawn})
    await this.ensureDeps(true)
    return !noSystemCtl && await spawnAsync({args: this.startCmd(), echo: true, ...systemCtlSpawn})
  }

  stopCmd = () => [Service.systemCtl, Service.sctlStop, this.service]
  startCmd = () => [Service.systemCtl, Service.sctlStart, this.service]
  statusCmd = () => [Service.systemCtl, Service.sctlStatus, this.service]
}
