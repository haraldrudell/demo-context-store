/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _CsvJsonConverter = __webpack_require__(1);

var _CsvJsonConverter2 = _interopRequireDefault(_CsvJsonConverter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

launch({ fn: _CsvJsonConverter2.default, getOptions, errorHandler }).catch(errorHandler);

function getOptions() {
  const { argv } = process;
  console.log('getOptions argv', argv);
  const useHeader = argv[2] === '--header';
  if (argv.length !== (useHeader ? 3 : 2)) throw new Error('usage: csv1480json [--header]');
  return { readStream: process.stdin, writeStream: process.stdout, useHeader };
}

async function launch({ fn, getOptions, errorHandler }) {
  process.on('uncaughtException', errorHandler).on('unhandledRejection', errorHandler);
  new fn(_extends({}, getOptions(), { errorHandler }));
}

function errorHandler(e) {
  console.error(e instanceof Error ? e /*TODO .message*/ : `errorHandler value: ${typeof e} ${e}`);
  process.exit(1);
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Pipeline = __webpack_require__(2);

var _Pipeline2 = _interopRequireDefault(_Pipeline);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// getField result
const FIELD_EOF = 1; // end of file
const FIELD_NONE = 2; // data for complete field not seen yet
const FIELD_RECORD = 3; // got a complete record

const separators = Array.from(',\r\n');

class CsvJsonConverter extends _Pipeline2.default {
  constructor(o) {
    super(o || false);

    this.addData = string => this.csv += string;

    this.isField = s => typeof s === 'string';

    const { useHeader } = o || false;
    this.useHeader = !!useHeader;
    this.csv = '';
    this.recordNo = 1;
    console.log(this.useHeader, Object.keys(o || false));
  }

  getOutput(isEnd) {
    if (isEnd) this.isEnd = true;
    if (this.useHeader && !this.headers) if (!this.getHeader()) return;
    let output = '';
    for (let record; record = this.getRecord(); output += record + '\n');
    return output || undefined;
  }

  getRecord() {
    const fields = this.getFieldList();
    if (fields) {
      // got a record
      const count = fields.length;
      const { fieldCount, recordNo, useHeader, headers } = this;
      if (!fieldCount) this.fieldCount = count;else if (count !== fieldCount) throw new Error(`Record ${recordNo} bad field count: ${count} expected ${fieldCount}`);
      this.recordNo++;
      return `{${fields.map((v, index) => `${useHeader ? headers[index] : index + 1}: ${JSON.stringify(v)}`).join(', ')}}`;
    } else return false;
  }

  getHeader() {
    const list = this.getFieldList();
    if (list) {
      this.headers = list.map(v => JSON.stringify(v));
      this.fieldCount = list.length;
    }
  }

  getFieldList() {
    // array of string or false
    let fields = this.fields || (this.fields = []);
    let field;
    while (this.isField(field = this.getField())) fields.push(field);
    console.log('getFieldList end:', field, fields);
    if (field === FIELD_RECORD) {
      this.fields = null;
      return fields;
    } else return false; // need to wait for more data or end of records
  }

  getField() {
    // string or FIELD_*
    const { isEnd, recordNo } = this;
    const fields = this.fields.length;
    let { csv } = this;
    let csvCh = csv[0];

    if (csvCh === '\r' || csvCh === '\n') {
      // skip the end of line terminating a previous record
      if (csv.length < 2 && !isEnd) return FIELD_NONE; // must have two characters to find \r\n
      const chs = csv.substring(0, 2) === '\r\n' ? 2 : 1;
      this.csv = csv = csv.substring(chs);
      return FIELD_RECORD; // we have a complete record
    }

    if (!csv && isEnd) return fields ? FIELD_RECORD : FIELD_EOF;

    const m = `Record ${recordNo} field ${fields + 1}`;

    if (fields) if (csvCh === ',') csvCh = (this.csv = csv = csv.substring(1))[0];else throw new Error(`${m} missing field-separating comma`); // TODO insert location

    if (csvCh === '"') {
      // double-quoted field
      let quoteSearchIndex = this.quoteSearchIndex || 1; // where to start looking
      let index;
      for (;;) {
        let index = csv.indexOf('"', quoteSearchIndex);
        if (!~index) // no end-quote yet
          if (!isEnd) {
            this.quoteSearchIndex = quoteSearchIndex;
            return FIELD_NONE; // no matching quote in data thus far
          } else throw new Error(`${m} unmatched double quote`);
        if (index - quoteSearchIndex < 2 || csv[index - 1] !== '\\') {
          // found unescaped ending double quote
          this.quoteSearchIndex = 0;
          this.csv = csv.substring(index + 1);
          return csv.substring(1, index);
        }
        quoteSearchIndex = index + 1; // skip escaped double quote
      }
    }

    // it is an unquoted field
    const index = separators.map(ch => csv.indexOf(ch)).reduce((r, index) => !~index ? r : !~r ? index : Math.min(r, index));
    if (!~index) // none of the separators appeared
      if (isEnd) {
        this.csv = '';
        return csv; // field is rest of line
      } else return FIELD_NONE; // need more data
    this.csv = csv.substring(index);
    return csv.substring(0, index);
  }

}
exports.default = CsvJsonConverter;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stream = __webpack_require__(3);

class PipeLine extends _stream.Transform {
  constructor({ readStream, writeStream, errorHandler }) {
    super({ decodeStrings: false, encoding: 'utf8' });

    this._flush = callback => callback(null, this.getOutput(true));

    const eh = typeof errorHandler;
    if (eh !== 'function') throw new Error(`PipeLine: errorHandler not function: ${eh}`);
    readStream.on('error', errorHandler).setEncoding('utf8').pipe(this.on('error', errorHandler)).pipe(writeStream.on('error', errorHandler));
  }

  _transform(chunk, encoding, callback) {
    // callback(err, chunk)
    if (chunk.length) this.addData(chunk);
    callback(null, this.getOutput());
  }

}
exports.default = PipeLine; /*
                            © 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
                            This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
                            */

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("stream");

/***/ })
/******/ ]);
//# sourceMappingURL=csv1480json.js.map