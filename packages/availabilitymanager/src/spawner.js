/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import {spawn} from 'child_process'
import readline from 'readline'

export default spawner
async function spawner({cmd, args, stdio, cpr}) {
  if (!cmd || typeof cmd !== 'string') throw new Error(`spawner: cmd not non-empty string ${typeof cmd} '${cmd}'`)
  if (!args) args = []
  else if (!Array.isArray(args)) args = [args]
  if (!stdio) stdio = ['ignore', 'pipe', 'inherit']

  return new Promise((resolve, reject) => {
    const cp = spawn(cmd, args, {stdio}) // inherit is default acc. to api, but it isn't
      .once('close', (status, signal) => {
        if (status === 0 && !signal) resolve(status)
        else {
          let msg = `status code: ${status}`
          if (signal) msg += ` signal: ${signal}`
          msg += ` '${cmd} ${args.join(' ')}'`
          reject(new Error(msg))
        }
      }).on('error', reject)
    if (cpr) cpr.cp = cp
  })
}

export async function getCmdLines(o) {
  const {lineFn} = o
  if (typeof lineFn !== 'function') throw new Error(`getCmdLines lieFn not function: ${typeof lineFn}`)

  const cpr = {}
  const p = spawner({...o, cpr})
  const p2 = new Promise((resolve, reject) => {
    readline.createInterface({input: cpr.cp.stdout})
      .on('line', lineFn)
      .once('close', resolve)
      .on('error', reject)
  })
  await p
  return p2
}

export async function getCmd(o) {
  const cpr = {}
  const p = spawner({...o, cpr})
  const p2 = new Promise((resolve, reject) => {
    let s = ''
    cpo.cp.on('data', s1 => s += s1)
      .once('end', () => resolve(s))
      .on('error', reject)
      .setEncoding('utf8')
  })
  await p
  return p2
}
