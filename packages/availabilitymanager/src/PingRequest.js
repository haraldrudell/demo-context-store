/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/

export default class Request {
  static id = 0

  constructor({target, retries, timeout, packetSize, onBeforeSocketSend, onSocketSend, onTimeout}) {
    Object.assign(this, {id: Request.id++, target, retries, timeout, packetSize, onBeforeSocketSend, onSocketSend, onTimeout})
    this.promise = new Promise((resolve, reject) => {
      this._resolve = resolve
      this._reject = reject
    })
  }

  resolve(v, data) {
    this.promise.data = data
    this._resolve(v)
  }

  reject(e) {
    this._reject(e)
  }

  setTimeout() {
    this.timer = setTimeout(this.handleTimeout, this.timeout)
  }

  handleTimeout = () => this.onTimeout(this)

  clearTimeout() {
    const t = this.timer
    if (t) {
      this.timer = null
      clearTimeout(t)
    }
  }

  beforeSocketSend = (...args) => this.onBeforeSocketSend(this, ...args)

  afterSocketSend = (...args) => this.onSocketSend(this, ...args)
}
