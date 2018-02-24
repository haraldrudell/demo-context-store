/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import {SpawnAsync} from 'allspawn'
import {getFnOrUndefined} from 'es2049lib'

export default class Process extends SpawnAsync {
  constructor(o) {
    super(o)
    let s = {}
    if (this.getFnOrUndefined({manipulator, s})) throw new Error(`${this.m} manipulator: ${s.text}`)
    Object.assign(this, s.properties)
  }

  async startSpawn() {
    const prom = super.startSpawn()
    const {cp} = this
    if (cp) manipulator && manipulator(cp)
    return prom
  }
}
