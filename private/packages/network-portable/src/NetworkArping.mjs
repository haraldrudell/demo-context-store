/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import NetworkTcpOpen from './NetworkTcpOpen'

import {spawnCapture} from 'allspawn'
import {patchCommand} from 'es2049lib'

const isMac = process.platform === 'darwin'

export default class NetworkArping extends NetworkTcpOpen {
  static arpingCmd = !isMac
    ? ['arping', '-IINTERFACE', '-c1', 'IP']
    : ['arping', '-iINTERFACE', '-C1', 'IP'] // on darwin, requires root
  static arpingRegexps = [/INTERFACE/g, /IP/g]
  static arpingMatcher = /(\d+\.\d+)ms/m
  static arpingMatcherCount = 2
  static arpingNoResponseMatcher = /^Received 0 /m

  async arping({iface, ip}) {
    const {debug} = this
    const {arpingCmd, arpingRegexps, arpingMatcher, arpingMatcherCount, arpingNoResponseMatcher} = NetworkArping
    const args = patchCommand(arpingCmd, arpingRegexps[0], iface, arpingRegexps[1], ip)
    const {stdout} = await spawnCapture({args, echo: debug})
    /*
    ARPING 192.168.1.15 from 192.168.1.10 eth0
    Unicast reply from 192.168.1.15 [00:23:54:87:26:12]  0.890ms
    Sent 1 probes (1 broadcast(s))
    Received 1 response(s)

    ARPING 192.168.1.13 from 192.168.1.10 eth0
    Sent 1 probes (1 broadcast(s))
    Received 0 response(s)
    */
    const matchNone = stdout.match(arpingNoResponseMatcher)
    if (matchNone) return false
    const match = stdout.match(arpingMatcher)
    if (!match || match.length !== arpingMatcherCount) throw new Error(`${this.m}.arping parsing failed: '${stdout}'`)
    return Number(match[1])
  }
}
