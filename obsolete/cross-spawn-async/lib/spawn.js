'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _regeneratorRuntime = _interopDefault(require('babel-runtime/regenerator'));
var _extends = _interopDefault(require('babel-runtime/helpers/extends'));
var _Promise = _interopDefault(require('babel-runtime/core-js/promise'));
var _asyncToGenerator = _interopDefault(require('babel-runtime/helpers/asyncToGenerator'));
var crossSpawn = _interopDefault(require('cross-spawn'));

/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
var spawn = (function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(_ref) {
    var cmd = _ref.cmd,
        args = _ref.args,
        options = _ref.options;
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt('return', new _Promise(function (resolve, reject) {
              return crossSpawn(cmd, args, _extends({}, options, { stdio: ['ignore', 'inherit', 'inherit'] })).once('close', function (status, signal) {
                if (status === 0 && !signal) resolve(status);else {
                  var msg = 'status code: ' + status;
                  if (signal) msg += ' signal: ' + signal;
                  msg += ' \'' + cmd + ' ' + args.join(' ') + '\'';
                  reject(new Error(msg));
                }
              }).on('error', reject);
            }));

          case 1:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  function spawn(_x) {
    return _ref2.apply(this, arguments);
  }

  return spawn;
})();

exports['default'] = spawn;
