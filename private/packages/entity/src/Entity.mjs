/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import EntityJson from './EntityJson'

import util from 'util'

export default class Entity extends EntityJson {
  constructor(o) {
    super({name: 'Entity', ...o})
    this.debug && this.constructor === Entity && console.log(`${this.m} constructor: ${util.inspect(this, {colors: true, depth: null})}`)
  }
}
