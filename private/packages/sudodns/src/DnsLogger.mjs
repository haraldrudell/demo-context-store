/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import RequestTracker from './RequestTracker'
import StatisticsLogger from './StatisticsLogger'

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
  static localInterfaceIp = '127.0.0.1'

  constructor(o) {
    const {name, debug, iface} = o || false
    const m = this.m = String(name || 'DnsLogger')
    let s
    if ((this.iface = s = getNonEmptyString(iface)) instanceof Failure) throw new Error(`${this.m} iface: ${s.text}`)
    const emitter = this.emitter = new EventEmitter()
    this.statisticsLogger = new StatisticsLogger({emitter, name: m})
    debug && (this.debug = true) && console.log(`${this.m} constructor: ${util.inspect(this, {colors: true, depth: 1})}`)
  }

  async run(o) {
    const {iface, statisticsLogger} = this
    const {tcpdump, tcpdumpRegExp} = DnsLogger
    const spawnAsync = new SpawnAsync({args: patchCommand(tcpdump, tcpdumpRegExp, iface), options: {stdio: ['ignore', 'pipe', 'pipe']}})
    let stdoutReader
    let stderrReader
    let e
    await Promise.all([
      spawnAsync.startSpawn(),
      (stdoutReader = new LineReader(Object(spawnAsync.cp).stdout)).promise,
      (stderrReader = new LineReader(Object(spawnAsync.cp).stderr)).promise,
      this.readStdout(stdoutReader),
      this.readStderr(stderrReader),
    ]).catch(ee => (e = ee))
    await spawnAsync.abortProcess()
    statisticsLogger.shutdown()
    if (e) throw e
  }

  async readStdout(reader) {
    const {emitter} = this
    const g = reader.asyncLineIterator()
    for (;;) {
      const {value: line, done} = await g.next()
      if (done) break // value here: asyncLineIterator has no return value
      const {isRequest, server, port, timeOfDay, timeval} = this.parseTcpdumpLine(line)
      // eslint-disable-next-line no-new
      if (isRequest) new RequestTracker({server, port, timeOfDay, timeval, emitter})
      else emitter.emit('event', {server, port, timeOfDay})
    }

    // TODO 180219 hr for await does not work Node.js v9.5.0
    //for await (let x of linereader.asyncLineIterator()) console.log('stdo', x)
  }

  parseTcpdumpLine(line) {
    const {lineMatcher, timeMatcher, ipMatcher, localInterfaceIp} = DnsLogger

    const lineMatch = line.match(lineMatcher)
    if (!lineMatch) throw new Error(`${this.m} line match failed: line: '${line}'`)
    const [, timeString, ipSender, ipReceiver] = lineMatch

    const timeMatch = timeString.match(timeMatcher)
    if (!timeMatch) throw new Error(`${this.m} time match failed: '${timeString}', line: '${line}'`)
    const [, h, m, s, us] = timeMatch
    const timeOfDay = this.getTimeOfDay({h, m, s, us})
    const timeval = Date.now()

    const ips = []
    for (let ipString of [ipSender, ipReceiver]) {
      const ipMatch = ipString.match(ipMatcher)
      if (!ipMatch) throw new Error(`${this.m} ip match failed: '${ipString}', line: '${line}'`)
      const [, ip, port] = ipMatch
      ips.push({ip, port})
    }
    const isRequest = ips[0].ip === localInterfaceIp // localhost issued the request
    const server = ips[isRequest ? 1 : 0].ip // the localhost dns server ip
    const port = ips[isRequest ? 0 : 1].port // ephemeral port issuing the request

    return {isRequest, server, port, timeOfDay, timeval}
  }

  getTimeOfDay({h, m, s, us}) {
    const mS = 60
    const hS = mS * 60
    const timeOfDay = +h * hS + +m * mS + +s + +us / 1e6
    if (isNaN(timeOfDay)) throw new Error(`${this.m} time conversion failed: ${[h, m, s, us, timeOfDay].join(' ')}`)
    return timeOfDay // number, unit: s
  }

  async readStderr(reader) {
    const {tcpdumpStderrIgnore: ignoreList} = DnsLogger
    const g = reader.asyncLineIterator()
    for (;;) {
      const {value: line, done} = await g.next()
      if (done) break
      if (ignoreList.some(text => line.startsWith(text))) continue
      throw new Error(`${this.m} output on stderr: '${line}'`)
    }
  }
}
