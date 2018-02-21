/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import UrnEntity from './UrnEntity'
import Sha256HOC from './Sha256HOC'

import util from 'util'

export default class EntityJson extends Sha256HOC(UrnEntity) {
  static properties = Object.keys({updated: 1, uuid: 1, sha256: 1, format: 1, urn: 1, payload: 1})

  constructor(o) {
    super({name: 'EntityJson', ...o})
    this.debug && this.constructor === EntityJson && console.log(`${this.m} constructor: ${util.inspect(this, {colors: true, depth: null})}`)
  }

  toJson() {
    return JSON.stringify(this)
  }

  static fromJson(string) {
    const {formatString, urnNamespace, properties} = EntityJson
    const m = `${this.m}.fromJson`
    const o = JSON.parse(string)
    const ot = typeof o
    if (ot !== 'object') throw new Error(`${m}: json not an object value: ${ot}`)
    const {format, urn, uuid, updated, sha256, payload} = o
    if (format !== formatString) throw new Error(`${m}: unknown format value: ${format}`)
    const ut = typeof urn
    if (ut !== 'string' || !urn.startsWith(`${urnNamespace}:`)) throw new Error(`${m}: bad urn: ${urn}`)
    const uut = typeof uuid
    if (uut !== 'string' || !uuid.match(/^[\da-f]{8}-([\da-f]{4}-){3}[\da-f]{8}$/)) throw new Error(`${m}: bad uuid: ${uuid}`)
    const upt = typeof updated
    if (upt !== 'string' || !upt.match(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/)) throw new Error(`${m}: bad updated time: ${updated}`)
    const st = typeof sha256
    if (st !== 'string' || !sha256.match(/^[\da-f]{64}$/)) throw new Error(`${m}: bad hash format: ${sha256}`)
    const keys = Object.keys(o)
    const missing = properties.filter(p => !keys.include(p))
    const extra = keys.filter(k => !properties.include(k))
    if (missing.length || extra.length) throw new Error(`${m}: bad entity properties:` +
      `${missing.length ? ` missing: ${missing.join(', ')}` : ''}` +
      `${extra.length ? ` extra: ${extra.join(', ')}` : ''}`)
    const urnEntity = new EntityJson({updated, urn})
    Object.assign(urnEntity, {uuid, urn, payload})
    urnEntity._updateHash()
    const c = urnEntity.sha256
    if (c !== sha256) throw new Error(`${m} bad sha256: received: ${sha256} calcuklated: ${c}`)
    return urnEntity
  }
}
