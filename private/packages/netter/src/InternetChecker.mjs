/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import NetworkChecker from './NetworkChecker'

import {getAbsolute, getNonEmptyString, getPortNumber, patchCommand} from 'es2049lib'
import {spawnCapture} from 'allspawn'

import util from 'util'


export default class InternetChecker extends NetworkChecker {
  static tcpHost0 = '8.8.8.8'
  static tcpPort0 = 443
  static nping = ['nping', '--tcp-connect', '--count=1', '--dest-port=PORT', 'IP']
  static npingPORT = /PORT/g
  static npingIP = /IP/g

  constructor(o) {
    super({name: 'InternetChecker', ...o})
    const {tcpHost, tcpPort} = Object(o)
    const {tcpHost0, tcpPort0} = InternetChecker
    let s = {}
    if (getNonEmptyString({tcpHost, s}, tcpHost0)) throw new Error(`${this.m} tcpHost: ${s.text}`)
    if (getPortNumber({tcpPort, s}, tcpPort0)) throw new Error(`${this.m} tcpPort: ${s.text}`)
    Object.assign(this, s.properties)
  }

  async run(isOk, results) {
    const {debug} = this
    debug && console.log(`${this.m} isOk: ${isOk}`, results)
    if (!isOk) return this.getDependencyFailure(results)
    const {defaultRoute, vpnOverride} = results[0].data
    const m = []

    /*
    const data = await this.doSudoNping()
    const {iface, ms, conns, stdout} = data
    if (stdout) return this.getFailure({message: `Parse of nping response failed`, data})
    if (!conns) return this.getFailure({message: `Connection failed on interface: ${iface}`, data})
    m.push(`Interface: ${iface}: ${ms} ms`)
  */

    // Gateway latency: 0.806 ms
    const arpMs = await this.getArpLatency(defaultRoute)
    if (!arpMs) return this.getFailure({message: 'Default gateway unavailable'})
    m.push(`Gateway latency: ${arpMs} ms`)

    // does the default gateway connect to the Internet?
    if (!vpnOverride) { // regular tcpOpen
      const {elapsedMs, message, data} = await this.getTcpOpenLatency()
      if (message) return this.getFailure({message, data})
      m.push(`Internet latency: ${(elapsedMs / 1e3).toFixed(3)} s`)
    } else {
      const data = await this.doNping()
      const {iface: i0, ms, conns, stdout} = data
      if (stdout) return this.getFailure({message: `Parse of nping response failed`, data})
      if (!conns) return this.getFailure({message: `Connection failed on interface: ${iface}`, data})
      const iface = i0 || defaultRoute.iface
      m.push(`Interface: ${iface}: ${ms} ms`)
    }

    return this.getSuccess({message: m.join('\n'), data: {defaultRoute, vpnOverride}})
  }

  async doSudoNping() {
    const {sudo, sudonping: file} = InternetChecker
    const args = [sudo, await getAbsolute({file, shouldExist: true, usePath: true})]
    const {stdout} = await spawnCapture({args})
    return this.parseNpingResponse(stdout)
  }

  async doNping() {
    const {nping, npingPORT, npingIP} = InternetChecker
    const {tcpHost, tcpPort} = this
    const args = patchCommand(nping, npingIP, tcpHost, npingPORT, tcpPort)
    const {stdout} = await spawnCapture({args})
    return this.parseNpingResponse({stdout, args})
  }

  async parseNpingResponse(result) {
    const {stdout} = result
    /*
    nping --interface=enx000ec6fa54d2 --tcp-connect --count=1 --dest-port=443 8.8.8.8

    Starting Nping 0.7.60 ( https://nmap.org/nping ) at 2018-02-23 21:52 PST
    SENT (0.0013s) Starting TCP Handshake > 8.8.8.8:443
    RCVD (0.0615s) Handshake with 8.8.8.8:443 completed

    Max rtt: 60.278ms | Min rtt: 60.278ms | Avg rtt: 60.278ms
    TCP connection attempts: 1 | Successful connections: 1 | Failed: 0 (0.00%)
    Nping done: 1 IP address pinged in 0.06 seconds
    */
    const ifMatch = stdout.match(/--interface=([^\s]+)/)
    const iface = ifMatch && ifMatch[1]
    result.iface = iface

    const cMatch = stdout.match(/Successful connections: (.)/)
    const conns = cMatch && Number(cMatch[1])
    result.conns = conns

    const msMatch = stdout.match(/^Max rtt: ([0-9.]+)/m)
    const ms = msMatch && Number(msMatch[1])
    result.ms = ms

    if (conns >= 0 && ms >= 0) delete result.stdout
    return result
  }

  async getTcpOpenLatency(iface) {
    const {tcpHost: host, tcpPort: port} = this
    const {network} = this
    if (!network) throw new Error(`${this} network property not set`)

    const o = await network.tcpOpen({host, port})
    const {err, isOpen, elapsedMs} = o

    if (err) Object.assign(o, {message: `tcp open error: ${err.message}`, data: {...o, iface}})
    else if (!isOpen) Object.assign(o, {message: `Connection failed ${iface ? `on interface: ${iface} ` : ''}${host}:${port}`, data: {...o, iface}})
    else if (isNaN(elapsedMs)) Object.assign(o, {message: `Timing failed: ${util.inspect(elapsedMs)}`, data: {...o, iface}})
    else Object.assign(o, {text: `${iface ? `interface: ${iface} ` : ''}latency: ${(elapsedMs / 1e3).toFixed(3)} s`})
    return {...o, host, port}
  }

  async getArpLatency(route) {
    const {iface, gw} = route
    const {network} = this
    return network.arping({iface, ip: gw})
  }
}
