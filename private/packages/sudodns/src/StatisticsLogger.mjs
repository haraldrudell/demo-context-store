/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import DnsStats from './DnsStats'

import {getISOLocal, WriteBs} from 'es2049lib'

import events from 'events'
const {EventEmitter} = events
import util from 'util'

export default class StatisticsLogger {
  static wait0 = 5e3
  static hourMs = 60 * 60 * 1e3
  static dayMs = 24 * StatisticsLogger.hourMs
  start = Date.now()
  hourlyStats = new DnsStats()
  dailyStats = new DnsStats()
  day = this.getDay(this.dailyStats.created)
  handleTimeout = this.handleEvent.bind(this, true)
  handleResponse = this.handleEvent.bind(this, false)
  cycleStats = this.cycleStats.bind(this)
  logHour = this.logHour.bind(this)
  writeBs = new WriteBs()

  constructor(o) {
    const {emitter, wait, name, debug} = o || false
    const {handleTimeout, handleResponse, start} = this
    this.m = String(name || 'StatisticsLogger')
    const {wait0} = StatisticsLogger
    if (!(emitter instanceof EventEmitter)) throw new Error(`${this.m} emitter not EventEmitter`)
    Object.assign(this, {emitter})
    emitter.on('timeout', handleTimeout).on('duration', handleResponse)
    this.wait = wait >= 0 ? +wait : wait0
    debug && (this.debug = true) && console.log(`${this.m} constructor: ${util.inspect(this, {colors: true, depth: null})}`)
    console.log(`${getISOLocal({timeval: start})} statistics logging started`)
    this.scheduleCycleStats()
  }

  handleEvent(isTimeout, o) {
    const {timeval, server, duration} = o || false
    const {hourlyStats, writeBs} = this
    hourlyStats.addValue({isTimeout, server, duration})
    const decimals = isTimeout ? 3 : 6
    const dur3 = (duration).toFixed(decimals)
    const type = isTimeout ? 'had timeout' : 'latency'
    const t = `${getISOLocal({timeval})} server: ${server} ${type}: ${dur3} s`
    if (isTimeout) writeBs.log(t)
    else writeBs.writeBs(t)
  }

  cycleStats() {
    const {hourlyStats, wait} = this
    this.hourlyStats = new DnsStats()
    if (wait) this.timer = setTimeout(this.logHour, wait, hourlyStats)
    else this.logHour(hourlyStats)
  }

  logHour(hourlyStats) {
    const {day, dailyStats, writeBs, start} = this
    const now = Date.now()
    writeBs.log(`${getISOLocal({timeval: now})} hourly: ${hourlyStats.toString()}`)
    dailyStats.mergeDnsStats(hourlyStats)
    const dayNow = this.getDay(now)
    if (dayNow !== day) {
      this.day = dayNow
      this.dailyStats = new DnsStats()
      writeBs.log(`${getISOLocal({timeval: now})} daily: ${dailyStats.toString()} up since: ${getISOLocal({timeval: start})}`)
    }
    this.scheduleCycleStats()
  }

  shutdown() {
    const {timer, emitter, handleTimeout, handleResponse} = this
    emitter.removeListener('timeout', handleTimeout).removeListener('duration', handleResponse)
    timer && clearTimeout(timer)
  }

  scheduleCycleStats() {
    const {hourMs} = StatisticsLogger
    const ms = hourMs - Date.now() % hourMs
    this.timer = setTimeout(this.cycleStats, ms)
  }

  getDay(timeval) {
    const {dayMs} = StatisticsLogger
    return Math.floor(timeval / dayMs)
  }
}
