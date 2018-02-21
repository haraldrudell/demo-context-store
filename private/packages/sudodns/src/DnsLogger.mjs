/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import Request from './Request'
import {LineReader} from 'linesai'
import {getNonEmptyString, patchCommand, Failure} from 'es2049lib'

import {SpawnAsync} from 'allspawn'

import util from 'util'
import events from 'events'
const {EventEmitter} = events

export default class DnsLogger {
  static tcpdumpStderrIgnore = [
    'tcpdump: verbose output suppressed',
    'listening on ',
  ]
  static tcpdump = ['tcpdump', '-lnilo', 'udp and port 53 and host 127.0.0.1']
  static tcpdumpRegExp = /IFACE/g
  static lineMatcher = /^([^\s]+) IP ([^\s]+) > ([^:]+)/
  static timeMatcher = /^(\d\d):(\d\d):(\d\d)\.(\d{6})$/
  static ipMatcher = /^(.+)\.(\d+)$/

  constructor(o) {
    const {name, debug, iface} = o || false
    this.m = String(name || 'DnsLogger')
    let s
    if ((this.iface = s = getNonEmptyString(iface)) instanceof Failure) throw new Error(`${this.m} iface: ${s.text}`)
    debug && (this.debug = true) && console.log(`${this.m} constructor: ${util.inspect(this, {colors: true, depth: null})}`)
  }

  async run(o) {
    const {iface} = this
    const {tcpdump, tcpdumpRegExp} = DnsLogger
    const spawnAsync = new SpawnAsync({args: patchCommand(tcpdump, tcpdumpRegExp, iface), options: {stdio: ['ignore', 'pipe', 'pipe']}, debug: true})
    let stdoutReader
    let stderrReader
    let e
    await Promise.all([
      spawnAsync.startSpawn(),
      (stdoutReader = new LineReader(Object(spawnAsync.cp).stdout)).promise,
      (stderrReader = new LineReader(Object(spawnAsync.cp).stderr)).promise,
      this.readStdout(stdoutReader),
      this.readStderr(stderrReader),
    ]).catch(ee => console.error('CATCH', ee) + (e = ee))
    const {cp} = spawnAsync
    console.error('RESOLVED', {e, cp: cp.pid, pid: process.pid})
    cp.kill()
    //await spawnAsync.abortProcess()
    console.error('THROWING', e)
    if (e) throw e
  }

  async readStdout(reader) {
    const emitter = new EventEmitter()
    const g = reader.asyncLineIterator()
    for (;;) {
      const {value: line, done} = await g.next()
      if (done) break // asyncLineIterator has no return value
      //console.log(line)

      const {isRequest, server, port, t} = this.interpretLine(line)
      //console.log({isRequest, server, port, t})

      if (isRequest) new Request({server, port, t, emitter})
      else emitter.emit('event', isRequest, server, port, t)
    }
    // TODO 180219 hr for await does not work Node.js v9.5.0
    //for await (let x of linereader.asyncLineIterator()) console.log('stdo', x)
  }

  interpretLine(line) {
    const bind = '127.0.0.1'
    const {lineMatcher, timeMatcher, ipMatcher} = DnsLogger

    const lineMatch = line.match(lineMatcher)
    if (!lineMatch) throw new Error(`${this.m} line match failed: '${line}'`)
    const [, timeS, ip1S, ip2S] = lineMatch

    const timeMatch = timeS.match(timeMatcher)
    if (!timeMatch) throw new Error(`${this.m} time match failed: '${timeS}', ${line}'`)
    const [, h, m, s, us] = timeMatch
    const t = this.getDaySeconds({h, m, s, us})

    const ips = []
    for (let ipS of [ip1S, ip2S]) {
      const ipMatch = ipS.match(ipMatcher)
      if (!ipMatch) throw new Error(`${this.m} ip match failed: '${ipS}', ${line}'`)
      const [, ip, port] = ipMatch
      ips.push({ip, port})
    }
    const isRequest = ips[0].ip === bind // localhost issued the request
    const server = ips[isRequest ? 1 : 0].ip
    const port = ips[isRequest ? 0 : 1].port
    return {isRequest, server, port, t}
  }

  getDaySeconds({h, m, s, us}) {
    const mS = 60
    const hS = mS * 60
    const t = +h * hS + +m * mS + +s + +us / 1e6
    if (isNaN(t)) throw new Error(`${this.m} time conversion failed: ${[h, m, s, us, t].join(' ')}`)
    return t
  }

  async readStderr(reader) {
    const {tcpdumpStderrIgnore: ignoreList} = DnsLogger
    const g = reader.asyncLineIterator()
    for (;;) {
      const {value: line, done} = await g.next()
      if (done) break
      if (ignoreList.some(t => line.startsWith(t))) continue
      throw new Error(`${this.m} output on stderr: ${line}`)
    }
  }
}
