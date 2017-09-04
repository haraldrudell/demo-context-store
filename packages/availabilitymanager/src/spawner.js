/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import {spawn} from 'child_process'
import readline from 'readline'

export default spawner
async function spawner({cmd, args, stdio, cpr, timeout}) {
  timeout = timeout >= 0 ? Number(timeout) : 3e3
  if (!cmd || typeof cmd !== 'string') throw new Error(`spawner: cmd not non-empty string ${typeof cmd} '${cmd}'`)
  if (!args) args = []
  else if (!Array.isArray(args)) args = [args]
  if (!stdio) stdio = ['ignore', 'pipe', 'inherit']

  return new Promise((resolve, reject) => {
    let timer
    const clearTimer = () => timer && clearTimeout(timer) + (timer = null)
    const cp = spawn(cmd, args, {stdio}) // inherit is default acc. to api, but it isn't
      .once('close', (status, signal) => {
        clearTimer()
        if (status === 0 && !signal) resolve(status)
        else {
          let msg = ''
          if (status) msg += `status code: ${status} `
          if (signal) msg += `signal: ${signal} `
          msg += `'${cmd} ${args.join(' ')}'`
          reject(new Error(msg))
        }
      }).on('error', e => clearTimer() + reject(e))
    if (timeout) timer = setTimeout(() => (timer = null) + cp.kill(), timeout)
    if (cpr) cpr.cp = cp
  })
}

export async function getCmd(o) {
  const cpr = {}
  const p = spawner({...o, stdio: ['ignore', 'pipe', 'pipe'], cpr})
  const {cp} = cpr
  let result
  if (cp) {
    const [stdout, stderr] = await Promise.all([
      getStream(cp.stdout),
      getStream(cp.stderr),
    ])
    result = {stdout, stderr}
  }
  await p.catch(e => {
    Object.assign(e, result)
    throw e
  })
  return result
}

async function getStream(s) {
  return new Promise((resolve, reject) => {
    let str = ''
    s.on('data', st => str += st)
      .on('close', () => resolve(str))
      .on('error', reject)
  })
}

export async function getCmdLines(o) {
  const {lineFn} = o || false
  const ef = typeof lineFn
  if (ef !== 'function') throw new Error(`getCmdLines lieFn not function: ${ef}`)

  const cpr = {}
  const p = spawner({timeout: 0, ...o, cpr})
  const {cp} = cpr
  let p2
  if (cp) p2 = new Promise((resolve, reject) => {
    readline.createInterface({input: cp.stdout})
      .on('line', lineFn)
      .once('close', resolve)
      .on('error', reject)
  })
  await p
  return p2
}
