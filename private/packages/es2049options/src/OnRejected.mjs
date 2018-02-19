/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
export default class OnRejected {
  static exitCode = 1
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
    let {m, debug, exit} = o || false
    if (typeof exit !== 'function') exit = process.exit
    if (!m || typeof m !== 'string') m = 'OnRejected'
    return {m, debug, exit}
  }

  async invokeRun(o) {
    const {onRejected} = this
    const {run, name, version} = this.getArguments(o)
    return run({onRejected, name, version, OnRejected: this})
  }

  setDebug() {
    return this.debug = true
  }

  onRejected(e) {
    OnRejected.invokeExit(e, this)
  }

  getArguments(o) {
    let {run, name, version, debug, exit} = o || false
    let s
    if ((s = this.verifyNonEmptyString(name))) throw new Error(`${this.m}: package.json key name: ${s}`)
    this.m = name
    debug && (this.debug = true)
    if ((s = this.verifyFn(run))) throw new Error(`${this.m} launchProcess run argument: ${s}`)
    if ((s = this.verifyNonEmptyString(version))) throw new Error(`${this.m}: package.json key version: ${s}`)
    if (exit !== undefined) {
      if ((s = this.verifyFn(exit))) throw new Error(`${this.m} launchProcess exit argument: ${s}`)
      this.exit = exit
    }
    return {run, name, version}
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
