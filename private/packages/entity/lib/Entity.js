'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var crypto = _interopDefault(require('crypto'));

'use strict';



class UIDGenerator {
  constructor(bitSize, baseEncoding, uidLength) {
    if (typeof bitSize === 'string') {
      uidLength = baseEncoding;
      baseEncoding = bitSize;
      bitSize = null;
    } else if (typeof baseEncoding === 'number') {
      uidLength = baseEncoding;
      baseEncoding = null;
    }

    baseEncoding = baseEncoding || UIDGenerator.BASE58;

    if (typeof baseEncoding !== 'string') {
      throw new TypeError('baseEncoding must be a string');
    }

    if (uidLength == null) {
      if (bitSize == null) {
        bitSize = 128;
      } else if (!Number.isInteger(bitSize) || bitSize <= 0 || bitSize % 8 !== 0) {
        throw new TypeError('bitSize must be a positive integer that is a multiple of 8');
      }

      uidLength = Math.ceil(bitSize / Math.log2(baseEncoding.length));
      this._byteSize = bitSize / 8;
    } else {
      if (bitSize != null) {
        throw new TypeError('uidLength may not be specified when bitSize is also specified');
      }
      if (!Number.isInteger(uidLength) || uidLength <= 0) {
        throw new TypeError('uidLength must be a positive integer');
      }

      bitSize = Math.ceil(uidLength * Math.log2(baseEncoding.length));
      this._byteSize = Math.ceil(bitSize / 8);
    }

    this.uidLength = uidLength;
    this.bitSize = bitSize;
    this.baseEncoding = baseEncoding;
    this.base = baseEncoding.length;
  }

  generate(cb) {
    if (!cb) {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(this._byteSize, (err, buffer) => {
          if (err) {
            reject(err);
          } else {
            resolve(this._bufferToString(buffer));
          }
        });
      });
    }

    crypto.randomBytes(this._byteSize, (err, buffer) => {
      if (err) {
        cb(err);
      } else {
        cb(null, this._bufferToString(buffer));
      }
    });
  }

  generateSync() {
    return this._bufferToString(crypto.randomBytes(this._byteSize));
  }

  // Encoding algorithm based on the encode function in Daniel Cousens' base-x package
  // https://github.com/cryptocoinjs/base-x/blob/master/index.js
  _bufferToString(buffer) {
    const digits = [0];
    var i;
    var j;
    var carry;

    for (i = 0; i < buffer.length; ++i) {
      carry = buffer[i];

      for (j = 0; j < digits.length; ++j) {
        carry += digits[j] << 8;
        digits[j] = carry % this.base;
        carry = (carry / this.base) | 0;
      }

      while (carry > 0) {
        digits.push(carry % this.base);
        carry = (carry / this.base) | 0;
      }
    }

    // Convert digits to a string
    var str = '';

    if (digits.length > this.uidLength) {
      i = this.uidLength;
    } else {
      i = digits.length;
      if (digits.length < this.uidLength) { // Handle leading zeros
        str += this.baseEncoding[0].repeat(this.uidLength - digits.length);
      }
    }

    while (i--) {
      str += this.baseEncoding[digits[i]];
    }

    return str;
  }
}

UIDGenerator.BASE16 = '0123456789abcdef';
UIDGenerator.BASE36 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
UIDGenerator.BASE58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
UIDGenerator.BASE62 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
UIDGenerator.BASE66 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-._~';
UIDGenerator.BASE71 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!'()*-._~";

var uidGenerator$1 = UIDGenerator;

var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();















var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
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
class UrnEntity {

  construct({ updated, urn }) {
    if (typeof urn !== 'string' || !urn) throw new Error('UrnEntity: urn argument must be non-empty string');
    Object.assign(this, {
      uuid: this._uuid(),
      format: UrnEntity.formatString,
      urn: `${UrnEntity.urnNamespace}:${urn}`,
      payload: null
    });
    this.setUpdated(updated);
  }

  setPayload(payload, updated) {
    this.payload = JSON.parse(JSON.stringify(payload));
    if (updated !== undefined) this.setUpdated();else this._updateHash();
  }

  getPayload() {
    return this.payload();
  }

  getUuid() {
    return this.uuid;
  }

  setUpdated(updated) {
    if (!(updated >= 0)) throw new Error('UrnEntity: updated argument must be number 0 or greater');
    this.updated = new Date(updated).toISOString();
    this._updateHash();
  }

  toJson() {
    return JSON.stringify(this);
  }

  static fromJson(s) {
    const m = 'UrnEntity.fromJson:';
    const o = JSON.parse(s);
    const ot = typeof o;
    if (ot !== 'object') throw new Error(`${m} json not object value: ${ot}`);
    const { format, urn, uuid, updated, sha256, payload } = o;
    const { formatString, urnNamespace, properties } = UrnEntity;
    if (format !== formatString) throw new Error(`${m} unknown format value: ${format}`);
    const ut = typeof urn;
    if (ut !== 'string' || !urn.startsWith(`${urnNamespace}:`)) throw new Error(`${m} bad urn: ${urn}`);
    const uut = typeof uuid;
    if (uut !== 'string' || !uuid.match(/^[\da-f]{8}-([\da-f]{4}-){3}[\da-f]{8}$/)) throw new Error(`${m} bad uuid: ${uuid}`);
    const upt = typeof updated;
    if (upt !== 'string' || !upt.match(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/)) throw new Error(`${m} bad updated time: ${updated}`);
    const st = typeof sha256;
    if (st !== 'string' || !sha256.match(/^[\da-f]{64}$/)) throw new Error(`${m} bad hash format: ${sha256}`);
    const keys = Object.keys(o);
    const missing = properties.filter(p => !keys.include(p));
    const extra = keys.filter(k => !properties.include(k));
    if (missing.length || extra.length) throw new Error(`${m} bad entity properties:` + `${missing.length ? ` missing: ${missing.join(', ')}` : ''}` + `${extra.length ? ` extra: ${extra.join(', ')}` : ''}`);
    const urnEntity = new UrnEntity({ updated, urn });
    Object.assign(urnEntity, { uuid, urn, payload });
    urnEntity._updateHash();
    const c = urnEntity.sha256;
    if (c !== sha256) throw new Error(`${m} bad sha256: received: ${sha256} calcuklated: ${c}`);
    return urnEntity;
  }

  _uuid() {
    const u = UrnEntity.uid.generateSync();
    return `${u.substr(0, 8)}-${u.substr(8, 4)}-${u.substr(12, 4)}-${u.substr(16, 4)}-${u.substr(20, 12)}`;
  }
  _updateHash() {
    const o = _extends({}, this);
    delete o.sha256;
    const hash = crypto.createHash(UrnEntity.hash);
    hash.write(JSON.stringify(o));
    hash.end();
    this.sha256 = hash.digest('hex');
  }
}
UrnEntity.formatString = 'entity 0';
UrnEntity.urnNamespace = 'urn:example:17';
UrnEntity.properties = ['updated', 'uuid', 'sha256', 'format', 'urn', 'payload'];
UrnEntity.hash = 'sha256';
UrnEntity.uid = new uidGenerator$1(uidGenerator$1.BASE16);

exports.UrnEntity = UrnEntity;
