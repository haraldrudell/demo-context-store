/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import NetworkNearIp from './NetworkNearIp'

export default class NetworkBase extends NetworkNearIp {
  findNetworkSegmentNode() {
    const p = process.platform
    throw new Error(`network-portable.findNetworkSegmentNode has no implementation for platform: ${p}`)
  }
}
