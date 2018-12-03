/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import { getTime } from '../util'

export default class FakeDb { // TODO 181202: Node.js v11.3: no class properties
  constructor() {
    this.setStatus('Loading…')
  }

  getStatus() {
    return this.status
  }

  setStatus(t) {
    this.status = `${t} ${getTime()}`
  }
}
