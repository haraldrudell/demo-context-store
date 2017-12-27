/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
export default class ShellBatcher {
  static minMs = 200 // su can handle max 5 request per second
  tLast = 0
  queue = []

  async submit(cmd) { // su 0 'ls;ls'
    const {queue} = this
    let _resolve
    const p = new Promise((resolve, reject) => _resolve = resolve)
    queue.push({cmd, resolve: _resolve})
    await this.tryExecute()
    return p
  }

  async tryExecute() {
    const t = Date.now()
    const {tLast, timer} = this
    const {minMs} = ShellBatcher
    const leftMs = t - tLast
    if (leftMs < minMs) {
      if (timer) return
      await new Promise((resolve, reject) => this.timer = setTimeout(resolve, leftMs))
      this.timer = null
    }
    return execute()
  }

  async execute() {
    const {queue} = this
    const batch = Array.from(queue)
    queue.length = 0
    const cmd = 'su 0 ' + batch.map(entry => entry.cmd).join(';echo $\'\0\';')
    const text = await adb.shell(cmd)
    const outs = texts.split('\0')
    if (outs.length !== batch.length) {
      console.error(`${m} cmd: ${cmd}`)
      console.error(`${m} respone: ${outs}`)
      throw new Error(`${m} command batching failed`)
    }
    for (let [ix, out] of outs.entries) {
      const {resolve} = batch[ix]
      resolve(out)
    }
  }
}
