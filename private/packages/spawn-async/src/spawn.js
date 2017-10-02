/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import {spawn as cspawn} from 'child_process'

export default async function spawn(o) {
  const {cmd, args = [], options} = o || false
  if (typeof cmd !== 'string' || !cmd) throw new Error('spawn-async: command not non-empty string')
  if (!Array.isArray(args)) throw new Error('spawn-async: args not array')
  return new Promise((resolve, reject) => {debugger; return cspawn(cmd, args, {stdio: ['ignore', 'inherit', 'inherit'], ...options})
    .once('close', (status, signal) => {
      if (status === 0 && !signal) resolve(status)
      else {
        let msg = `status code: ${status}`
        if (signal) msg += ` signal: ${signal}`
        msg += ` '${cmd} ${args.join(' ')}'`
        reject(new Error(msg))
      }
    }).on('error', reject)
    }  )
}
