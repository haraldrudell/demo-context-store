/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
export default class Listener {
  constructor(ths, fn) {
    Object.assign(this, {ths, fn})
  }

  isSet() {
    return typeof this.fn === 'function'
  }

  invoke(...args) {
    if (this.isSet()) this.fn.call(this.ths, ...args)
  }
}
