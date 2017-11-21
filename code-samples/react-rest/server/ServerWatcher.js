/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import ServerManager from './ServerManager'

import chokidar from 'chokidar'


const m = 'ServerWatcher'

export default class ServerWatcher {
  static waitMs = 1e3

  constructor(o = false) {
    const {cmd, args, watchFilename, errorHandler} = o
    const eh = typeof errorHandler
    if (eh !== 'function') throw new Error(`${m}: errorHandler not function: ${eh}`)
    const printableArgs = Array.isArray(args) ? args.join(' ') : args
    console.log(`${m}: server: ${cmd} [${printableArgs}]`)

    const watcher = chokidar.watch(watchFilename)
      .on('add', this._watcherEvent)
      .on('change', this._watcherEvent)
    console.log(`${m}: watching: ${watchFilename}`)

    Object.assign(this, {cmd, args, errorHandler, watcher})

    const {waitMs} = ServerWatcher
    console.log(`${m}: initial launch wait: ${(waitMs / 1e3).toFixed(1)} s`)
    this.timer = setTimeout(this._initialTimeout, waitMs)
  }

  async shutdown() {
    const t = this.timer
    if (t) {
      this.timer = null
      clearTmeout(t)
    }

    const w = this.watcher
    if (w) {
      this.watcher = null
      watcher.close()
    }

    return this._terminate()
  }

  async _relaunchServer(t) {
    this.eventTime = t
    console.log(`${m}: watcherEvent`, new Date(t).toISOString())

    await this._terminate()

    const sm = this.serverManager = new ServerManager()
    const {cmd, args, errorHandler} = this
    const pid = await sm.run({cmd, args, errorHandler}).catch(::this.printError)
    const message = `${m}: ` + (pid ? `launched server pid: ${pid}` : 'server launch failed')
    console.log(message)
    sm.promise.catch(::this.printError)
  }
  _watcherEvent = p => this._relaunchServer(Date.now()).catch(this.errorHandler)

  async _terminate() {
    const {serverManager} = this
    if (serverManager) {
      this.serverManager = null
      const pid = serverManager.getPid()
      if (pid) {
        console.log(`${m}: terminating server pid: ${pid}`)
        await serverManager.shutdown().catch(::this.printError)
      }
    }
  }

  async _ensureInitialLaunch() {
    const hadEvent = this.eventTime > 0
    if (!hadEvent) return this._relaunchServer(Date.now())
  }
  _initialTimeout = () => (this.timer = null) + this._ensureInitialLaunch().catch(this.errorHandler)

  printError = e => console.error(e)
}
