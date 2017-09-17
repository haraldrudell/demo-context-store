/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import {getCmd} from './spawner'

const cmd = 'ping'
const oneSecond = 1e3

export async function sendPing({target, retries, timeout, packetSize}) {
  const timeoutS = timeout >= oneSecond && Math.round(timeout / oneSecond)
  retries = retries >= 0 ? Math.round(retries) : 0
  timeout = (timeoutS + 1) * oneSecond
  const args = ['-nDc1', `-s${packetSize}`]
  if (timeoutS) args.push(`-W${timeoutS}`)
  args.push(target)

  let attempts = 0
  const first = Date.now()
  let last
  while (true) {
    last = !last ? first : Date.now()
    attempts++
    let e
    const {stdout} = await getCmd({cmd, args, timeout}).catch(err => e = err)

    if (!e) {
      // eslint-disable-next-line no-shadow
      const retries = attempts - 1
      return {stdout, retries, first, last}
    }

    if (!/status code: 1 /.test(e.message)) throw e

    if (attempts > retries) {
      e = new PingTimeoutError(stdout)
      Object.assign(e, {first, last, attempts})
      return {e}
    }
  }
}

export class PingTimeoutError extends Error {}
