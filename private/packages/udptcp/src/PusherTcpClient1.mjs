
/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import PusherTcpClient from './PusherTcpClient'
import ConnectionClient from './ConnectionClient'

import {classLogger} from 'es2049lib'

export default class PusherTcpClient1 extends PusherTcpClient {
  constructor(o) {
    super(o)
    classLogger(this, PusherTcpClient1)
  }

  async _handleConnect(socket) {
    await ConnectionClient.shutdown() // scrap all present connections
    // await super._handleConnect(socket) https://github.com/babel/babel/issues/3930
    await PusherTcpClient.prototype._handleConnect.call(this, socket)
  }

  async _handleResponse({msg, id, status}) {
    let c = ConnectionClient.get(id)
    if (!c) return
    // await super._handleResponse(socket) https://github.com/babel/babel/issues/3930
    await PusherTcpClient.prototype._handleResponse.call(this, {msg, id, status})
    }
}
