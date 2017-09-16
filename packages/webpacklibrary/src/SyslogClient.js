/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import {Client, Transport} from 'syslog-client'
export {Transport}

export default class SyslogClient extends Client {
  constructor(o) {
    super((o || false).ip, o)

    // for tcp the buggy thing emits timeout errors
    // we have to use tcp, b/c udp logs whether logging is functional or not
    // options parsing does not distinguish between timeout value missing or 0
    // we can fix that now!
    if (o.tcpTimeout === 0) this.tcpTimeout = 0
  }
}
