/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import EntityBase from './EntityBase'

import UIDGenerator from 'uid-generator'

import util from 'util'
/*
{
  "updated": "2017-09-17T22:13:59.918Z",
  "uuid": "870d5cb7-154c-4960-a9d7-3d98b79f0ce9",
  "format": "entity 0",
  "urn": "urn:example:17:cloudevent",
  "payload": null
}
*/
export default class UrnEntity extends EntityBase {
  static formatString = 'entity 0' // schema version
  static urnNamespace = 'urn:example:17'
  static uid = new UIDGenerator(UIDGenerator.BASE16)

  constructor(o) {
    super({name: 'UrnEntity', ...o})
    const {updated, urn} = o || false
    if (typeof urn !== 'string' || !urn) throw new Error(`${this.m}: urn argument not non-empty string`)
    Object.assign(this, {
      uuid: this._uuid(),
      format: UrnEntity.formatString,
      urn: `${UrnEntity.urnNamespace}:${urn}`,
      payload: null,
    })
    this.setUpdated(updated)
    this.debug && this.constructor === UrnEntity && console.log(`${this.m} constructor: ${util.inspect(this, {colors: true, depth: null})}`)
  }

  setPayload(payload, updated) {
    super.setPayload(payload)
    if (updated !== undefined) this.setUpdated()
  }

  getUuid() {
    return this.uuid
  }

  setUpdated(updated) {
    if (!(updated >= 0)) throw new Error(`${this.m}: updated argument not number 0 or greater`)
    this.updated = new Date(updated).toISOString()
  }

  _uuid() {
    const u = UrnEntity.uid.generateSync()
    return `${u.substr(0, 8)}-${u.substr(8, 4)}-${u.substr(12, 4)}-${u.substr(16, 4)}-${u.substr(20, 12)}`
  }
}
