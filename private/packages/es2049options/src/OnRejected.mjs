/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import {readPackageJson} from './readPackageJson'

export default class OnRejected {
  onRejected = this.onRejected.bind(this)

  static launchProcess(o) {
    const instance = new OnRejected()
    return instance.invokeRun(o).catch(instance.onRejected)
  }

  async invokeRun(o) {
    !o && (o = false)
    Object.assign(this, OnRejected.getDefaults(o))
    const {name, version} = readPackageJson({name: 1, version: 1}, o.pjson)
    this.m = name
    const {run} = o
    if (typeof run !== 'function') throw new Error(`${this.m} launchProcess run argument not function`)
    const {onRejected} = this
    return run({onRejected, name, version, OnRejected: this})
  }

  setDebug() {
    return this.debug = true
  }

  onRejected(e) {
    OnRejected.invokeExit(e, this)
  }

  static invokeExit(e, o) {
    const {m, debug, exit} = OnRejected.getDefaults(o)
    debug && console.error(`${m} onRejected:`)
    if (!(e instanceof Error)) e = new Error(`Error value: ${typeof e}, '${e}'`)
    console.error(!debug ? e.message : e)
    exit(1)
  }

  static getDefaults(o) {
    let {m, debug, exit} = o || false
    if (typeof exit !== 'function') exit = process.exit
    debug = Boolean(debug)
    if (!m || typeof m !== 'string') m = 'OnRejected'
    return {m, debug, exit}
  }
}
