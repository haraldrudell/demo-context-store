/**
* #!/usr/bin/env node
* /*
* © 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
* This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
* */
**/'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

//run(process.argv.slice(2)).catch(errorHandler).catch(console.error)

var run = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(argv) {
    var script, absScript;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.log('cmdline-scripts argv:', argv);
            script = argv[0];
            _context.next = 4;
            return ensureTranspilation(script);

          case 4:
            absScript = _context.sent;
            _context.next = 7;
            return spawn('node', [absScript].concat(argv.slice(1)));

          case 7:
            console.log(script + ' completed successfully');

          case 8:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function run(_x) {
    return _ref.apply(this, arguments);
  };
}();

var spawn = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(cmd, args) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            return _context2.abrupt('return', new Promise(function (resolve, reject) {
              return crossSpawn(cmd, args, { stdio: 'inherit' }).once('close', function (status, signal) {
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
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function spawn(_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}();

var ensureTranspilation = function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(script) {
    var scriptFile, outputDir, es, js, exists, doTranspile, updateTimes, config, status;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            // 'Build'
            scriptFile = script + '.js';
            outputDir = path.join(__dirname, '../build');
            es = path.join(__dirname, '../src', scriptFile);
            js = path.join(outputDir, scriptFile);
            _context3.next = 6;
            return _fs2.default.pathExists(js);

          case 6:
            exists = _context3.sent;
            doTranspile = !exists;

            if (doTranspile) {
              _context3.next = 21;
              break;
            }

            _context3.t0 = Promise;
            _context3.next = 12;
            return _fs2.default.stat(es);

          case 12:
            _context3.t1 = _context3.sent;
            _context3.next = 15;
            return _fs2.default.stat(js);

          case 15:
            _context3.t2 = _context3.sent;
            _context3.t3 = [_context3.t1, _context3.t2];
            _context3.next = 19;
            return _context3.t0.all.call(_context3.t0, _context3.t3);

          case 19:
            updateTimes = _context3.sent;

            doTranspile = updateTimes[0].mtimeMs > updateTimes[1].mtimeMs;

          case 21:
            if (!doTranspile) {
              _context3.next = 26;
              break;
            }

            config = _extends({}, webpackConfig, {
              entry: { script: es },
              output: { path: outputDir }
            });
            _context3.next = 25;
            return doWebpack(config);

          case 25:
            status = _context3.sent;

          case 26:
            return _context3.abrupt('return', js);

          case 27:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function ensureTranspilation(_x4) {
    return _ref3.apply(this, arguments);
  };
}();

var errorHandler = function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(e) {
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            console.error('cmdline-script.errorhandler:');
            console.error(e);
            console.error(new Error('errorHandler invocation'));
            process.exit(1);

          case 4:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function errorHandler(_x5) {
    return _ref4.apply(this, arguments);
  };
}();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/

console.log(__filename);
process.exit(1);

doWebpack = function doWebpack(config) {
  return new Promise(function (resolve, reject) {
    return webpack(config, function (err, status) {
      if (!err) {
        if (status.hasErrors()) err = new Error('webpack errors');
        if (status.hasWarnings()) err = new Error('webpack waringns');
        console.log(status.toString());
      }
      if (!err) resolve(status);else reject(err);
    });
  });
};
