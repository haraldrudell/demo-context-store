/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import DirScanner from './DirScanner'
import Pacer from './Pacer'
import Mutex from './Mutex'
import File from './File'

export default class DbLoader {
  constructor({models, ssh}) {
    Object.assign(this, {models, ssh})
    this.pacer = new Pacer(10)
    this.mutex = new Mutex()
    this.ec = []
  }

  async load() {
    console.log('Database loading starting…')
    const t0 = Date.now()
    const timer = setInterval(() => this.logState(), 1e4) // every 10 s
    await this.runList()
    this.donkey = new Date().toISOString()
    clearInterval(timer)
    const t = ((Date.now() - t0) / 1e3).toFixed(1)
    console.log('done1!')
    await new Promise((resolve, reject) => setTimeout(resolve, 1e4)) // wait for log output to clear, about 9 s
    console.log(`Completed in ${t} s`)
  }

  async runList() {
    const list = await this.getList()
    this.total = list.length
    console.log(`Sorting ${list.length} files…`)
    list.sort(File.descDate)
      .map(file => this.moderate(file))
    console.log(`Dispatch complete`)
    return Promise.all(list)
  }

  async getList() {
    const {models, ssh, mutex} = this
    const opts = {models, ssh, mutex}
    const lists = await Promise.all((await models.BaseDir.getHostDirs())
      .map(baseDir => new DirScanner({
        dir: baseDir.get('dir'), // '/x/tostorage/mobile_media'
        print: true,
        opts: Object.assign({baseDir}, opts)}).scan()))
    return lists.shift().concat(...lists)
  }

  async moderate(file) {
    const {pacer} = this
    await pacer.getTurn()
    await file.scan().catch(e => {
      this.ec.push(`Error: ${e}`)
      pacer.done()
      throw e
    }) // a throw here will cancel
    pacer.done()
  }

  logState() {
    const {pacer, mutex} = this
    console.log(`${new Date().toISOString()} Progress:` +
      ` total: ${this.total}` +
      ` mutex: ${mutex.busy} ${mutex.queue.length}` +
      ` pacer: ${pacer.active} q: ${pacer.queue.length} peak: ${pacer.maxActive}` +
      ` ec: ${this.ec.length} ${this.ec}` +
      ` donkey: ${this.donkey}`,
      'File:', File.counters
    )
  }
}
