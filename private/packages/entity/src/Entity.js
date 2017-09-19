/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import UIDGenerator from 'uid-generator';

import crypto from 'crypto'
/*
{
  "updated": "2017-09-17T22:13:59.918Z",
  "uuid": "870d5cb7-154c-4960-a9d7-3d98b79f0ce9",
  "sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "format": "entity 0",
  "urn": "urn:example:17:cloudevent",
  "payload": null
}
*/
export class UrnEntity {
  static formatString = 'entity 0'
  static urnNamespace = 'urn:example:17'
  static properties = ['updated', 'uuid', 'sha256', 'format', 'urn', 'payload']
  static hash = 'sha256'
  static uid = new UIDGenerator(UIDGenerator.BASE16)

  construct({updated, urn}) {
    if (typeof urn !== 'string' || !urn) throw new Error('UrnEntity: urn argument must be non-empty string')
    Object.assign(this, {
      uuid: this._uuid(),
      format: UrnEntity.formatString,
      urn: `${UrnEntity.urnNamespace}:${urn}`,
      payload: null,
    })
    this.setUpdated(updated)
  }

  setPayload(payload, updated) {
    this.payload = JSON.parse(JSON.stringify(payload))
    if (updated !== undefined) this.setUpdated()
    else this._updateHash()
  }

  getPayload() {
    return this.payload()
  }

  getUuid() {
    return this.uuid
  }

  setUpdated(updated) {
    if (!(updated >= 0)) throw new Error('UrnEntity: updated argument must be number 0 or greater')
    this.updated = new Date(updated).toISOString()
    this._updateHash()
  }

  toJson() {
    return JSON.stringify(this)
  }

  static fromJson(s) {
    const m = 'UrnEntity.fromJson:'
    const o = JSON.parse(s)
    const ot = typeof o
    if (ot !== 'object') throw new Error(`${m} json not object value: ${ot}`)
    const {format, urn, uuid, updated, sha256, payload} = o
    const {formatString, urnNamespace, properties} = UrnEntity
    if (format !== formatString) throw new Error(`${m} unknown format value: ${format}`)
    const ut = typeof urn
    if (ut !== 'string' || !urn.startsWith(`${urnNamespace}:`)) throw new Error(`${m} bad urn: ${urn}`)
    const uut = typeof uuid
    if (uut !== 'string' || !uuid.match(/^[\da-f]{8}-([\da-f]{4}-){3}[\da-f]{8}$/)) throw new Error(`${m} bad uuid: ${uuid}`)
    const upt = typeof updated
    if (upt !== 'string' || !upt.match(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/)) throw new Error(`${m} bad updated time: ${updated}`)
    const st = typeof sha256
    if (st !== 'string' || !sha256.match(/^[\da-f]{64}$/)) throw new Error(`${m} bad hash format: ${sha256}`)
    const keys = Object.keys(o)
    const missing = properties.filter(p => !keys.include(p))
    const extra = keys.filter(k => !properties.include(k))
    if (missing.length || extra.length) throw new Error(`${m} bad entity properties:` +
      `${missing.length ? ` missing: ${missing.join(', ')}` : ''}` +
      `${extra.length ? ` extra: ${extra.join(', ')}` : ''}`)
    const urnEntity = new UrnEntity({updated, urn})
    Object.assign(urnEntity, {uuid, urn, payload})
    urnEntity._updateHash()
    const c = urnEntity.sha256
    if (c !== sha256) throw new Error(`${m} bad sha256: received: ${sha256} calcuklated: ${c}`)
    return urnEntity
  }

  _uuid() {
    const u = UrnEntity.uid.generateSync()
    return `${u.substr(0, 8)}-${u.substr(8, 4)}-${u.substr(12, 4)}-${u.substr(16, 4)}-${u.substr(20, 12)}`
  }
  _updateHash() {
    const o = {...this}
    delete o.sha256
    const hash = crypto.createHash(UrnEntity.hash)
    hash.write(JSON.stringify(o))
    hash.end()
    this.sha256 = hash.digest('hex')
  }
}
