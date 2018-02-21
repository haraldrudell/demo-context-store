/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import DnsLogger from './DnsLogger'
import Network from 'network-portable'
import {doSudo} from 'es2049lib'

import util from 'util'

export default class Dnser {
  constructor(o) {
    const {name, debug, uid} = o || false
    this.m = String(name || 'Dnser')
    Object.assign(this, {uid, name})
    this.network = new Network({debug})
    debug && (this.debug = true) && console.log(`${this.m} constructor: ${util.inspect(this, {colors: true, depth: null})}`)
  }

  async doDns() {
    const {uid, name} = this
    return uid === 0 ? this.startDns() : doSudo({args: name})
  }

  async startDns() {
    const {debug} = this
    const iface = await this.getActiveInterface()
    return new DnsLogger({iface, debug}).run()
  }

  async getActiveInterface() {
    const {network} = this
    const {iface} = await network.getDefaultRoute() // {dest, gw, iface, metric, mask, suffix}
    if (!iface) throw new Error(`${this.m} default route missing`)
    return iface
  }
}
