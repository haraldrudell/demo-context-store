/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/

import util from 'util'

export default class OnRejected {
  static exitCode = 1
  static exit = process.exit
  onRejected = this.onRejected.bind(this)
  m = 'launchProcess'

  static launchProcess(o) { // {run, name, version, debug, exit}
    const instance = new OnRejected()
    return instance.invokeRun(o).catch(instance.onRejected)
  }

  static invokeExit(e, o) {
    const {m, debug, exit} = OnRejected.getDefaults(o)
    debug && console.error(`${m} onRejected:`)
    if (!(e instanceof Error)) e = new Error(`Error value: ${typeof e}, '${e}'`)
    console.error(!debug ? e.message : e)
    exit(OnRejected.exitCode)
  }

  static getDefaults(o) {
    const {exit: exit0} = OnRejected
    let {m, debug, exit} = Object(o)
    if (typeof exit !== 'function') exit = exit0
    if (!m || typeof m !== 'string') m = 'OnRejected'
    return {m, debug, exit}
  }

  async invokeRun(o) {
    const {onRejected} = this
    const {run, name, version, exit} = this.getArguments(o)
    const status = await run({onRejected, name, version, OnRejected: this})
    let exitCode = 0
    if (status !== undefined) {
      exitCode = +status
      if (isNaN(exitCode)) {
        console.error(util.inspect(status, {colors: true, depth: null}))
        throw new Error(`Non-numeric result from application run: type: ${typeof status} value: ${status}`)
      }
    }
    exitCode !== 0 && exit(exitCode)
  }

  setDebug() {
    return this.debug = true
  }

  logDebug(o) {
    const {options, name} = Object(o)
    Object(options).debug && this.setDebug() &&
      console.log(`${name} options: ${util.inspect(options, {colors: true, depth: null})}`)
  }

  onRejected(e) {
    if (!(e instanceof Error)) e = new Error(`es2049options OnRejected.onRejected: reject value not Error object: ${typeof e} '${e}'`)
    OnRejected.invokeExit(e, this)
  }

  getArguments(o) {
    let {run, name, version, debug, exit} = Object(o)
    let s
    if ((s = this.verifyNonEmptyString(name))) throw new Error(`${this.m}: package.json key name: ${s}`)
    this.m = name
    debug && (this.debug = true)
    if ((s = this.verifyFn(run))) throw new Error(`${this.m} launchProcess run argument: ${s}`)
    if ((s = this.verifyNonEmptyString(version))) throw new Error(`${this.m}: package.json key version: ${s}`)
    if (exit !== undefined) {
      if ((s = this.verifyFn(exit))) throw new Error(`${this.m} launchProcess exit argument: ${s}`)
      this.exit = exit
    } else exit = OnRejected.exit
    return {run, name, version, exit}
  }

  verifyNonEmptyString(value) {
    const vt = typeof value
    if (!value || vt !== 'string') return `not non-empty string: type: ${vt}`
  }

  verifyFn(value, defaultValue) {
    value === undefined && (value = defaultValue)
    const vt = typeof value
    if (vt !== 'function') return `not function: type: ${vt}`
  }
}
