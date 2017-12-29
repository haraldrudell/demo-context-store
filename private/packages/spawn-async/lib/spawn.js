'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _regeneratorRuntime = _interopDefault(require('babel-runtime/regenerator'));
var _Object$assign = _interopDefault(require('babel-runtime/core-js/object/assign'));
var _extends = _interopDefault(require('babel-runtime/helpers/extends'));
var _Promise = _interopDefault(require('babel-runtime/core-js/promise'));
var _asyncToGenerator = _interopDefault(require('babel-runtime/helpers/asyncToGenerator'));
var child_process = require('child_process');

/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
var spawn$1 = (function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(o) {
    var _ref2, cmd, _ref2$args, args, options, cp;

    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _ref2 = o || false, cmd = _ref2.cmd, _ref2$args = _ref2.args, args = _ref2$args === undefined ? [] : _ref2$args, options = _ref2.options, cp = _ref2.cp;

            if (!(typeof cmd !== 'string' || !cmd)) {
              _context.next = 3;
              break;
            }

            throw new Error('spawn-async: command not non-empty string');

          case 3:
            if (Array.isArray(args)) {
              _context.next = 5;
              break;
            }

            throw new Error('spawn-async: args not array');

          case 5:
            return _context.abrupt('return', new _Promise(function (resolve, reject) {
              var c = child_process.spawn(cmd, args, _extends({ stdio: ['ignore', 'inherit', 'inherit'] }, options)).once('close', function (status, signal) {
                if (status === 0 && !signal) resolve(status);else {
                  var msg = 'status code: ' + status;
                  if (signal) msg += ' signal: ' + signal;
                  msg += ' \'' + cmd + ' ' + args.join(' ') + '\'';
                  var e = new Error(msg);
                  _Object$assign(e, { status: status, signal: signal });
                  reject(e);
                }
              }).on('error', reject);
              if (cp) cp.cp = c;
            }));

          case 6:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  function spawn$$1(_x) {
    return _ref.apply(this, arguments);
  }

  return spawn$$1;
})();

exports['default'] = spawn$1;
