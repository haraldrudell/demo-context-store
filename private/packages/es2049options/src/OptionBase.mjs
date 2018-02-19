/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
export default class OptionBase {
  constructor(o) {
    !o && (o = false)
    this.m = String(o.name || this.constructor.name || 'OptionBase')
    o.debug && (this.debug = true)
  }
}
