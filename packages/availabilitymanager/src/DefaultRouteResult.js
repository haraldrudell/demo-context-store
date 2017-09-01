/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import Result from './Result'

export default class DefaultRouteResult extends Result {
  /*
  iface: value from Network.get_active_interface:
  { name: 'enx000ec6fa54d2',
     ip_address: '192.168.1.159',
     mac_address: '00:0e:c6:fa:54:d2',
     gateway_ip: '192.168.1.12',
     netmask: '255.255.255.0',
     type: 'Wired' }
  */
  constructor(iface) {
    super(iface)
    this.iface = iface
  }

  toString() {
    const {iface} = this
    return !this.isFailure
      ? `${iface.name} ${iface.ip_address} ${iface.type} gw ${iface.gateway_ip}`
      : 'Default route missing'
  }
}
