/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import {setMDebug, classLogger} from 'es2049lib'

import Function from './Function'

import {spawnAsync} from 'allspawn'
import fs from 'fs-extra'

export default class VolumeGroup extends Function {
  static depMap = {raids: 1, mounts: 1}
  static luksPath = '/dev/mapper/'
  static cryptSetup = ['cryptsetup', 'open']
  static cryptOptions = {stdio: 'inherit'}

  constructor(o) { // depend mount raid
    const type = 'VolumeGroup'
    const typeName = Object(o).name || Object(o).key || 'anonymous'
    const name = `${typeName}_${type}`
    o = {...o, name, depMap: VolumeGroup.depMap}
    super(o)
    const {device, luksName} = setMDebug(o, this)
    if (!luksName || typeof luksName !== 'string') throw new Error(`${this.m} luksName not non-empty string`)
    if (device != null && typeof device !== 'string') throw new Error(`${this.m} device not non-empty string`)
    const p = {luksName, devdeps: this.deps.map(d => d.name)}
    device && (this.device = p.device = device)
    Object.assign(this, {luksName})
    classLogger(this, VolumeGroup, p)
  }

  async isOk() {
    const {debug} = this
    if (!await this.ensureDeps()) return false
    const success = await fs.pathExists(this.getVgPath())
    debug && console.log(`${this.m}.isOk: ${success ? true : `failed: path: '${this.getVgPath()}'`}`)
    return success
  }

  async start() {
    const {device, luksName, debug} = this
    const {cryptSetup, cryptOptions, spawnAsyncOptions} = VolumeGroup
    if (!device) throw new Error(`${this.m} device unset: cannot start volume group`)
    await this.ensureDeps()
    debug && console.log(`${this.m}.start…`)
    return spawnAsync({
      args: cryptSetup.concat(device, luksName),
      echo: true,
      options: {...cryptOptions, ...spawnAsyncOptions},
    })
  }

  getVgPath = () => `${VolumeGroup.luksPath}${this.luksName}`
}
