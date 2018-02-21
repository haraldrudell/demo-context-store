/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import Network from 'network-portable'
import {patchCommand, doSudo} from 'es2049lib'

import {spawnAsync} from 'allspawn'

import util from 'util'

export default class NPinger {
  static nping = ['nping', '--interface=IFACE', '--tcp-connect', '--count=1', '--dest-port=443', '8.8.8.8']
  static npingRegExp = /IFACE/g

  constructor(o) {
    const {name, debug, uid} = o || false
    this.m = String(name || 'NPinger')
    Object.assign(this, {uid, name})
    this.network = new Network({debug})
    debug && (this.debug = true) && console.log(`${this.m} constructor: ${util.inspect(this, {colors: true, depth: null})}`)
  }

  async nping() {
    const {uid, name} = this
    return uid === 0 ? this.doNping() : doSudo({args: [name]})
  }

  async doNping() {
    const {network} = this
    const defaultRoute = await network.getDefaultRoute() // {dest, gw, iface, metric, mask, suffix}
    const iface = defaultRoute && defaultRoute.iface
    if (!iface) throw new Error(`${this.m} default route missing`)
    const args = patchCommand(NPinger.nping, NPinger.npingRegExp, iface)
    return spawnAsync({args, echo: true})
  }
}
