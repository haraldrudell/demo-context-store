/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import PusherTcp from './PusherTcp'
import ConnectionServer from './ConnectionServer'

import {classLogger} from 'es2049lib'

export default class PusherTcp1 extends PusherTcp {
  constructor(o) {
    super(o)
    classLogger(this, PusherTcp1, {_tcpPusher: this._tcpPusher, _tcpServer: this._tcpServer})
  }

  async _handleConnect(socket) {
    const {conns} = this._tcpPusher
    await Promise.all(Object.values(conns).map(c => c.shutdown())) // scrap all present connections
    // await super._handleConnect(socket) https://github.com/babel/babel/issues/3930
    await PusherTcp.prototype._handleConnect.call(this, socket)
  }

  async _handleResponse({msg, id, status}) {
    const {conns} = this._tcpPusher
    if (!conns[id]) return
    // await super._handleResponse(socket) https://github.com/babel/babel/issues/3930
    await PusherTcp.prototype._handleResponse.call(this, {msg, id, status})
    }
}
