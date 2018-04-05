/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import MacOSArp from './MacOSArp'

export default class macOSFindNode extends MacOSArp {
  async findNetworkSegmentNode(o) { // true false
    const {iface, ip} = Object(o)
    return this.arp({iface, ip})
  }
}
