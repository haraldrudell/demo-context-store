'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var util = _interopDefault(require('util'));
var UIDGenerator = _interopDefault(require('uid-generator'));
var crypto = _interopDefault(require('crypto'));

/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/

/*
Allowed values in payload:

null

boolean: true false

number: not values: NaN +Infinity -Infinity
- -0 is converted to 0
- 64-bit precision
- range approximately ±10^300
- Integer range approximately ±10^15

string: normalized Unicode 10 utf-16 characters approximate max length 2 GiB in bytes
- NFC: Normalization Form Canonical Composition
- no unpaired surrogates allowed (this ensures a string of valid unicode code points)

object: keys may only be string values approximate max number of properies 4 billion

array: only continuous zero-based indices, max length approximately 4 billion

not allowed value: undefined

lost metadata: functions, non-plain objects like Error, RegExp or Set, non-iterable properties
*/
class EntityBase {

  constructor(o) {
    this.payload = null;

    const { name, debug, payload } = o || false;
    this.m = String(name || 'EntityBase');
    if (payload !== undefined) this.setPayload(payload);
    debug && (this.debug = true) && this.constructor === EntityBase && console.log(`${this.m} constructor: ${util.inspect(this, { colors: true, depth: null })}`);
  }

  setPayload(payload) {
    this.payload = this._clone(payload);
  }

  getPayload() {
    return this._clone(this.payload);
  }

  _clone(v, location = '') {
    const vt = typeof v;
    switch (vt) {
      case 'object':
        if (Array.isArray(v)) {
          const len = v.length;
          const v1 = Array(len);
          for (let index = 0; index < len; index++) {
            v1[index] = this._clone(v[index], `${location}[${index}]`);
          }
          return v1;
        }
        let count = 0;
        let v1 = {};
        for (let p of Object.keys(v)) {
          count++;
          if (typeof p !== 'string') throw cloneError(`non-string key at property#${count}`);
          checkString(p);
          v1[p.normalize()] = this._clone(v[p], `${location}{${p}}`);
        }
        return v1;
      case 'string':
        checkString(v);
        return v.normalize();
      case 'number':
        if (isNaN(v)) throw cloneError(`number value isNaN`);
        if (v === Infinity) throw cloneError(`number value Infinity`);
        if (v === -Infinity) throw cloneError(`number value -Infinity`);
      // eslint-disable-next-line no-fallthrough
      case 'boolean':
      case 'null':
        return v;
    }
    throw cloneError(`type: ${vt}`);

    function cloneError(t) {
      return new Error(`${this.m} ${t}: not allowed. At: ${location || 'top level'}`);
    }

    function checkString(s) {
      for (let codePoint of s) if (codePoint >= 0xd800 && codePoint <= 0xdfff) throw cloneError(`string: invalid utf-16 encoding`);
    }
  }

}

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
/*
{
  "updated": "2017-09-17T22:13:59.918Z",
  "uuid": "870d5cb7-154c-4960-a9d7-3d98b79f0ce9",
  "format": "entity 0",
  "urn": "urn:example:17:cloudevent",
  "payload": null
}
*/
class UrnEntity extends EntityBase {
  // schema version
  constructor(o) {
    super(_extends({ name: 'UrnEntity' }, o));
    const { updated, urn } = o || false;
    if (typeof urn !== 'string' || !urn) throw new Error(`${this.m}: urn argument not non-empty string`);
    Object.assign(this, {
      uuid: this._uuid(),
      format: UrnEntity.formatString,
      urn: `${UrnEntity.urnNamespace}:${urn}`,
      payload: null
    });
    this.setUpdated(updated);
    this.debug && this.constructor === UrnEntity && console.log(`${this.m} constructor: ${util.inspect(this, { colors: true, depth: null })}`);
  }

  setPayload(payload, updated) {
    super.setPayload(payload);
    if (updated !== undefined) this.setUpdated();
  }

  getUuid() {
    return this.uuid;
  }

  setUpdated(updated) {
    if (!(updated >= 0)) throw new Error(`${this.m}: updated argument not number 0 or greater`);
    this.updated = new Date(updated).toISOString();
  }

  _uuid() {
    const u = UrnEntity.uid.generateSync();
    return `${u.substr(0, 8)}-${u.substr(8, 4)}-${u.substr(12, 4)}-${u.substr(16, 4)}-${u.substr(20, 12)}`;
  }
}
UrnEntity.formatString = 'entity 0';
UrnEntity.urnNamespace = 'urn:example:17';
UrnEntity.uid = new UIDGenerator(UIDGenerator.BASE16);

var _extends$1 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function Sha256HOC(BaseClass) {
  var _class, _temp;

  return _temp = _class = class Sha256 extends BaseClass {

    constructor(o) {
      super(_extends$1({ name: 'Sha256' }, o));
      this.debug && this.constructor === Sha256 && console.log(`${this.m} constructor: ${util.inspect(this, { colors: true, depth: null })}`);
    }

    setPayload(payload, updated) {
      super.setPayload(payload, updated);
      if (updated === undefined) this._updateHash();
    }

    setUpdated(updated) {
      super.setUpdated(updated);
      this._updateHash();
    }

    _updateHash() {
      const o = _extends$1({}, this);
      delete o.sha256;
      const hash = crypto.createHash(Sha256.hash);
      hash.write(JSON.stringify(o));
      hash.end();
      this.sha256 = hash.digest('hex');
    }
  }, _class.hash = 'sha256', _temp;
}

var _extends$2 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

class EntityJson extends Sha256HOC(UrnEntity) {

  constructor(o) {
    super(_extends$2({ name: 'EntityJson' }, o));
    this.debug && this.constructor === EntityJson && console.log(`${this.m} constructor: ${util.inspect(this, { colors: true, depth: null })}`);
  }

  toJson() {
    return JSON.stringify(this);
  }

  static fromJson(string) {
    const { formatString, urnNamespace, properties } = EntityJson;
    const m = `${this.m}.fromJson`;
    const o = JSON.parse(string);
    const ot = typeof o;
    if (ot !== 'object') throw new Error(`${m}: json not an object value: ${ot}`);
    const { format, urn, uuid, updated, sha256, payload } = o;
    if (format !== formatString) throw new Error(`${m}: unknown format value: ${format}`);
    const ut = typeof urn;
    if (ut !== 'string' || !urn.startsWith(`${urnNamespace}:`)) throw new Error(`${m}: bad urn: ${urn}`);
    const uut = typeof uuid;
    if (uut !== 'string' || !uuid.match(/^[\da-f]{8}-([\da-f]{4}-){3}[\da-f]{8}$/)) throw new Error(`${m}: bad uuid: ${uuid}`);
    const upt = typeof updated;
    if (upt !== 'string' || !upt.match(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/)) throw new Error(`${m}: bad updated time: ${updated}`);
    const st = typeof sha256;
    if (st !== 'string' || !sha256.match(/^[\da-f]{64}$/)) throw new Error(`${m}: bad hash format: ${sha256}`);
    const keys = Object.keys(o);
    const missing = properties.filter(p => !keys.include(p));
    const extra = keys.filter(k => !properties.include(k));
    if (missing.length || extra.length) throw new Error(`${m}: bad entity properties:` + `${missing.length ? ` missing: ${missing.join(', ')}` : ''}` + `${extra.length ? ` extra: ${extra.join(', ')}` : ''}`);
    const urnEntity = new EntityJson({ updated, urn });
    Object.assign(urnEntity, { uuid, urn, payload });
    urnEntity._updateHash();
    const c = urnEntity.sha256;
    if (c !== sha256) throw new Error(`${m} bad sha256: received: ${sha256} calcuklated: ${c}`);
    return urnEntity;
  }
}
EntityJson.properties = Object.keys({ updated: 1, uuid: 1, sha256: 1, format: 1, urn: 1, payload: 1 });

var _extends$3 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

class Entity extends EntityJson {
  constructor(o) {
    super(_extends$3({ name: 'Entity' }, o));
    this.debug && this.constructor === Entity && console.log(`${this.m} constructor: ${util.inspect(this, { colors: true, depth: null })}`);
  }
}

/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/

exports.EntityBase = EntityBase;
exports.EntityJson = EntityJson;
exports.UrnEntity = UrnEntity;
exports.Sha256HOC = Sha256HOC;
exports.Entity = Entity;
