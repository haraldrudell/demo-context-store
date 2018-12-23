/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import {setMDebug, classLogger} from 'es2049lib'

import Function from './Function'

import {spawnAsync} from 'allspawn'
import fs from 'fs-extra'

export default class Raid extends Function {
  static depMap = {vgs: 1, raids: 1, mounts: 1}
  static mdPath = '/dev/md/'
  static mdUuidPath = '/dev/disk/by-id/md-uuid-'
  static mdAdmDetail = ['mdadm', '--detail']
  static mdAdmStop = ['mdadm', '--stop']
  static mdAdmAssemble = ['mdadm', '--assemble']
  static mdadmUuidArg = s => `--uuid=${s}`

  constructor(o) { // mdName mdPath mduuid uuid
    const type = 'Raid'
    const typeName = Object(o).name || Object(o).key || 'anonymous'
    const name = `${typeName}${type}`
    o = {...o, name, depMap: Raid.depMap}
    super(o)
    const {uuid} = setMDebug(o, this)
    if (!this.isUuid(uuid)) throw new Error(`${this.m} uuid not uuid`)
    const raidName = typeName
    Object.assign(this, {uuid, raidName})
    classLogger(this, Raid, {uuid, raidName, deps: this.deps.map(d => d.name)})
  }

  async isOk() {
    const {debug} = this
    if (!await this.ensureDeps()) return false
    const success = await fs.pathExists(this.getMdPath())
    debug && console.log(`${this.m}.isOk: ${success ? true : `failed: path: '${this.getMdPath()}'`}`)
    return success
  }

  async start() {
    const {raidName, uuid, debug} = this
    const {mdAdmStop, spawnAsyncOptions: options, mdAdmAssemble} = Raid
    await this.ensureDeps(true)
    const mdUuidPath = this.getMdUuidPath()
    debug && console.log(`${this.m}.start ${mdUuidPath}…`)
    if (await fs.pathExists(mdUuidPath)) { // array is running under incorrect name
      const args = mdAdmStop.concat( mdUuidPath)
      await spawnAsync({args, echo: true, options})
    }
    const a = mdAdmAssemble.concat(raidName, Raid.mdadmUuidArg(uuid))
    return spawnAsync({args: a, echo: true, options})
  }

  getMdPath = () => `${Raid.mdPath}${this.raidName}`
  getUuidArg = () => this.uuid
  getMdUuidPath = () => `${Raid.mdUuidPath}` + // 4 groups of 8, separator colon
    `${this.uuid.substring(0, 8)}:` +
    `${this.uuid.substring(9, 13)}${this.uuid.substring(14, 18)}:` +
    `${this.uuid.substring(19, 23)}${this.uuid.substring(24, 28)}:` +
    `${this.uuid.substring(28, 36)}`
}
