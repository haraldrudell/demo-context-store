/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import {spawn} from 'child_process'

const m = 'ServerManager'

export default class ServerManager {
  async run(o = false) {
    this.promise = this._spawnAsync({...o, m}).then(::this._terminated, ::this._failed)
    return this.childProcess.pid
  }

  _terminated(value) {
    this.terminated = true
    if (!this.didKill) throw new Error(`${m}: server terminated unexpectedly`)
    return value
  }

  _failed(e) {
    this.terminated = true
    if (e.signal !== 'SIGTERM' || !this.didKill) throw e
  }

  getPid() {
    let result = 0
    if (!this.terminated) { // the process has already ended
      const {childProcess} = this
      if (childProcess) result = childProcess.pid
    }
    return result
  }

  async shutdown() {
    const {childProcess} = this
    if (!childProcess) return // the process has not launched
    if (!this.didKill) { // kill was not yet sent
      this.didKill = true
      childProcess.kill()
    }
    return this.promise // wait for the process to terminate
  }

  async _spawnAsync(o) {
    const {cmd, args = [], options, m} = o || false
    if (typeof cmd !== 'string' || !cmd) throw new Error(`${m}: command not non-empty string`)
    if (!Array.isArray(args)) throw new Error(`${m}: args not array`)
    return new Promise((resolve, reject) => this.childProcess = spawn(cmd, args, {stdio: ['ignore', 'inherit', 'inherit'], ...options})
      .once('close', (status, signal) => {
        if (status === 0 && !signal) resolve(status)
        else if (this.didKill && signal === 'SIGTERM') resolve(null)
        else {
          let msg = `status code: ${status}`
          if (signal) msg += ` signal: ${signal}`
          msg += ` '${cmd} ${args.join(' ')}'`
          const e = new Error(msg)
          Object.assign(e, {status, signal})
          reject(e)
        }
      }).on('error', reject)
    )
  }
}
