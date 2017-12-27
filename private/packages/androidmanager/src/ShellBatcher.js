/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
const m = 'ShellBatcher'

export default class ShellBatcher {
  static observedMax = 4088
  static margin = 256
  static maxCmdLength = ShellBatcher.observedMax - ShellBatcher.margin
  static splitCharacter = '\x01'
  static insertString = `;echo -n ${ShellBatcher.splitCharacter};`
  static extraChars = 14
  static minMs = 200 // su can handle max 5 request per second
  tLast = 0
  queue = []

  constructor(adb, debug, timing) { timing = true
    Object.assign(this, {adb, debug, timing})
  }

  async submit(cmdOrList) { // su 0 'ls;ls'
    const {queue} = this
    const isArray = Array.isArray(cmdOrList)
    const cmds = isArray ? cmdOrList : [cmdOrList]
    const submittedPromises = cmds.map(cmd => {
      let _resolve
      const pn = new Promise((resolve, reject) => _resolve = resolve)
      queue.push({cmd, resolve: _resolve})
      return pn
    })
    await this.rateLimit() // on evey submit, try to execute
    const texts = await Promise.all(submittedPromises)
    return isArray
      ? texts
      : texts[0]
  }

  async rateLimit() {
    if (this.rateLimiterActive) return
    this.rateLimiterActive = true
    const {minMs} = ShellBatcher
    const elapsed = Date.now() - this.tLast
    const leftMs = minMs - elapsed
    if (leftMs > 0) await new Promise((resolve, reject) => setTimeout(resolve, leftMs))
    this.tLast = Date.now()
    this.rateLimiterActive = false
    return this.prepareExecute()
  }

  async prepareExecute() {
    const {queue} = this
    const count = this.getBatchLength()
    await this.execute(count)
    return queue.length && this.rateLimit()
  }

  async execute(count) {
    const {queue, adb, debug, tLast, timing} = this
    const {splitCharacter, insertString} = ShellBatcher
    const batch = queue.splice(0, count)
    const t0 = Date.now()
    const tt = this.tt
    this.tt = t0

    if (debug ||timing) console.log(`ShellBatcher executing: ${batch.length}. ${new Date(t0).toISOString()}${tt ? (' ' + ((t0 - tt) / 1e3).toFixed(3)) : ''}`)
    const cmd = `echo '${batch.map(entry => this.escape(entry.cmd)).join(insertString)}' | su 0`
    if (debug) {
      console.log('ShellBatcher.execute', cmd)
      console.log('ShellBatcher.executeJSON', JSON.stringify(cmd))
    }
    const text = await adb.shell(cmd)
    if (debug || timing) {
      const e = (Date.now() - t0) / 1e3
      const s = `ShellBatcher.execute2 ${e.toFixed(3)} cmds: ${count}`
      debug ? console.log(s, JSON.stringify(text)) : console.log(s)
    }
    const results = text.split(splitCharacter)
    const rxLength = results.length
    if (rxLength !== count) {
      console.error(`${m} cmd: ${cmd.length} ${cmd}`)
      console.error(`${m} response: ${text.length} ${text}`)
      throw new Error(`${m} command batching failed: sent: ${count} received: ${rxLength}${!text.length ? ' Are you root?' : ''}`)
    }
    for (let [ix, result] of results.entries()) {
      const {resolve} = batch[ix]
      resolve(result)
    }
  }

  escape(cmd) {
    const backslash = '\\'
    return cmd.replace(/'/g, `\x27${backslash}\x27\x27`) // single-backslash-single-single
  }

  getBatchLength() {
    let ix = 0
    const {queue} = this
    const {maxCmdLength, extraChars, insertString} = ShellBatcher
    const isLen = insertString.length

    for (let chars = extraChars - isLen; ix < queue.length; ix++) {
      const nextCmd = queue[ix].cmd.length + isLen
      if (chars + nextCmd > maxCmdLength) break
      chars += nextCmd
    }
    if (ix === 0) throw new Error(`${m}: too long command: ${Object(Object(queue[0]).cmd).length}`)
    return ix
  }
}
