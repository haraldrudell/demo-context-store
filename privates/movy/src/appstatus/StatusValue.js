/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import {api} from 'api'

import { getTime } from 'server'

export default class StatusValue {
  status = `${getTime()} Disconnected`
  isConnected = false

  initRefresh(fn) {
    this.refresh(fn).catch(console.error)
    return this
  }

  getStatus() {
    return this.status
  }

  async refresh(fn) {
    if (typeof fn !== 'function') console.error(new Error('StatusValue.refresh: notfn'))
    const t = await api.getStatus().catch(e => e)
    if (!(t instanceof Error)) {
      this.isConnected = true
      fn(this.status = `${getTime()} ${t}`)
    } else if (this.isConnected) {
      this.isConnected = false
      this.error = t
      fn(this.status = `${getTime()} Error: ${t}`)
    }
  }
}
