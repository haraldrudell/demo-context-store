/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import CheckerBase from './CheckerBase'

import {getArrayOfString} from 'es2049lib'
import {SpawnAsync} from 'allspawn'

export default class RemoteChecker extends CheckerBase {
  constructor(o) {
    super({name: 'RemoteChecker', ...o})
    const {args} = Object(o)
    let s = {}
    if (getArrayOfString({args, s})) throw new Error(`${this.m} host: ${s.text}`)
    Object.assign(this, s.properties)
  }

  async run(isOk, results, emitter) {
    const {debug, args, resolverName} = this
    debug && console.log(`${this.m} isOk: ${isOk}`, results)
    if (!isOk) return this.getDependencyFailure(results)

    const spawnAsync = new SpawnAsync({args, options: {stdio: ['ignore', 'pipe', 'pipe']}, nonZeroOk: true})
    const p = spawnAsync.startSpawn()
    const {cp} = spawnAsync
    if (cp) {
      this.pipe(cp.stdout, resolverName, emitter)
      this.pipe(cp.stderr, `${resolverName} ERR`, emitter)
    }
    let e
    const status = await p.catch(ee => (e = ee))
    if (status || e) {
      const m = [`Remote command failed`]
      const data = {}
      if (status) {
        m.push(`status: ${status}`)
        data.status = status
      }
      if (e) {
        m.push(`error: ${e.message}`)
        data.error = e
      }
      m.push(`'${args.join('\x20')}'`)
      return this.getFailure({message: m.join('\x20'), data})
    }

    return this.getSuccess({message: `${this.m} ${resolverName} success`, quite: true})
  }

  pipe(stream, prepend, emitter) {
    stream.on('data', t => {
      t.endsWith('\n') && (t = t.slice(0, -1))
      t && t.split('\n').forEach(line => emitter(`${prepend} ${line}`))
    }).setEncoding('utf8')
  }
}
