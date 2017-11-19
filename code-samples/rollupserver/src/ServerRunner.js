/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import chokidar from 'chokidar'

export default class ServerRunner {
  static wait = 1e3
  async run({cmd, args, errorHandler}) {
    const eh = typeof errorHandler
    if (eh !== 'function') throw new Error(`ServerRunner: errorHandler not function: ${eh}`)
    const watcher = chokidar.watch(cmd)
      .on('add', this.watcherEvent)
      .on('change', this.watcherEvent)
    Object.assign(this, {cmd, args, errorHandler, watcher})
    const t = ServerRunner.wait
    console.log(`ServerRunner: waiting: ${(t / 1e3).toFixed(2)} s`)
    setTimeout(this.timer, t)
  }

  async launch(t) {
    this.eventTime = t
    console.log(`ServerRunner: watcherEvent`, new Date(t).toISOString())
  }

  watcherEvent = p => this.launch(Date.now()).catch(this.errorHandler)

  timer = () => (async () => {
    const t0 = this.eventTime
    const hadEvent = t0 > 0
    let doIt = !hadEvent // no event has happened yet
    if (!doIt) {
      const t = Date.now()
      const timeSinceLast = t - t0
      doIt = timeSinceLast >= ServerRunner.wait
    }
    if (doIt) return this.launch(t)
  })().catch(this.errorHandler)
}
