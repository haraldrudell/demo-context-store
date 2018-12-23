/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import {setMDebug, classLogger} from 'es2049lib'

import Function from './Function'
import {spawnCapture, spawnAsync} from 'allspawn'

export default class Mount extends Function {
  static depMap = {vgs: 1, raids: 1, mounts: 1}
  static mount = ['mount']
  // node --print "'/dev/disk4s1 on / (apfs, local, journaled)'.match(/^[^ ]* on ([^ ]+)/)"
  static mountMatch = /^[^ ]* on ([^ ]+)/
  static mountMatchIndex = 1

  constructor(o) { // depend vg raid
    const type = 'Mount'
    const typeName = Object(o).name || Object(o).key || 'anonymous'
    const name = `${typeName}_${type}`
    o = {...o, name, depMap: Mount.depMap}
    super(o)
    const {path: p} = setMDebug(o, this)
    const thePath = p || typeName
    if (!thePath || typeof thePath !== 'string') throw new Error(`${this.m} path not non-empty string`)
    Object.assign(this, {path: thePath})
    classLogger(this, Mount, {path: this.path, deps: this.deps.map(d => d.name)})
  }

  async isOk() {
    const {mount: args} = Mount
    const {debug} = this
    if (!await this.ensureDeps()) return false
    const {stdout} = await spawnCapture({args})
    const success = stdout.split('\n').some(line => this.isMountMatch(line))
    debug && console.log(`${this.m}.isOk: ${success ? true : `failed: stdout: '${stdout}'`}`)
    return success
  }

  async start() {
    const {mount, spawnAsyncOptions: options} = Mount
    const {path: p, debug} = this
    await this.ensureDeps(true)
    debug && console.log(`${this.m}.start…`)
    return spawnAsync({args: mount.concat(p), echo: true, options})
  }

  isMountMatch(s) {
    const {mountMatch, mountMatchIndex} = Mount
    const {path: mountPath} = this
    const match = String(s).match(mountMatch)
    return match && match[mountMatchIndex] === mountPath
  }
}
