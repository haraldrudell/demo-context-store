'use strict';

let run = (() => {
  var _ref = _asyncToGenerator(function* () {
    debug = true;
    m = 'AdbKitPatcher';
    return new _AdbKitPatcher2.default({ name: m, debug }).patch(patches);
  });

  return function run() {
    return _ref.apply(this, arguments);
  };
})();

var _AdbKitPatcher = require('./AdbKitPatcher');

var _AdbKitPatcher2 = _interopRequireDefault(_AdbKitPatcher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                           © 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                           All rights reserved
                                                                                                                                                                                                                                                                                                                                                                                                                                                                           */


let m = 'src/index';
let debug;

const patches = {
  adbkit: 'src/adb.js',
  'adbkit-monkey': 'src/monkey.js',
  'adbkit-logcat': 'src/logcat.js'
};

run().catch(onRejected);

function onRejected(e) {
  debug && console.error(`${m} onRejected:`);
  if (!(e instanceof Error)) e = new Error(`Error value: ${typeof e} ${e}`);
  console.error(!debug ? e.message : e);
  debug && console.error(new Error('onRejected invocation:'));
  process.exit(1);
}