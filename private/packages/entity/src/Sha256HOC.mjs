/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import crypto from 'crypto'
import util from 'util'

export default function Sha256HOC(BaseClass) {
  return class Sha256 extends BaseClass {
    static hash = 'sha256'

    constructor(o) {
      super({name: 'Sha256', ...o})
      this.debug && this.constructor === Sha256 && console.log(`${this.m} constructor: ${util.inspect(this, {colors: true, depth: null})}`)
    }

    setPayload(payload, updated) {
      super.setPayload(payload, updated)
      if (updated === undefined) this._updateHash()
    }

    setUpdated(updated) {
      super.setUpdated(updated)
      this._updateHash()
    }

    _updateHash() {
      const o = {...this}
      delete o.sha256
      const hash = crypto.createHash(Sha256.hash)
      hash.write(JSON.stringify(o))
      hash.end()
      this.sha256 = hash.digest('hex')
    }
  }
}
