/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import NetworkBase from './NetworkBase'

import {spawnCapture} from 'allspawn'
import {patchCommand} from 'es2049lib'

export default class MacOSArp extends NetworkBase {
  static arp = ['arp', '-niINTERFACE', 'IP']
  static arpRegexps = [/INTERFACE/g, /IP/g]
  static arpMatcher = /at [^ ]+ on/
  static arpNoneMatcher = /no entry/

  async arp(o) {
    const {iface, ip} = Object(o)
    const {debug} = this
    const {arp, arpRegexps, arpNoneMatcher, arpMatcher} = MacOSArp
    const args = patchCommand(arp, arpRegexps[0], iface, arpRegexps[1], ip)
    const {stdout} = await spawnCapture({args, echo: debug})
    /* arp -nien9 192.168.1.10
    ? (192.168.1.10) at 0:16:cb:a1:fc:47 on en9 ifscope [ethernet]

    192.168.1.13 (192.168.1.13) -- no entry on en9
    */
    if (stdout.match(arpNoneMatcher)) return false // the node is not available
    if (!stdout.match(arpMatcher)) throw new Error(`${this.m}.arp: failed to parse: '${stdout}'`)
    return true // the node is reachable
  }
}
