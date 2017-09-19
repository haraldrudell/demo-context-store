'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var fs = _interopDefault(require('fs-extra'));
var path = _interopDefault(require('path'));

var _regeneratorRuntime = require("regenerator-runtime");

/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
var cleanx = (function (args) {
  var _iterator, _isArray, _i, _ref, st, projectDir;

  return _regeneratorRuntime.async(function (_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (!(typeof args === 'string')) {
            _context.next = 4;
            break;
          }

          args = [args];
          _context.next = 6;
          break;

        case 4:
          if (!(!Array.isArray(args) || !args.length)) {
            _context.next = 6;
            break;
          }

          throw new Error('clean: argument not non-empty string or array');

        case 6:
          _iterator = args, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();

        case 7:
          if (!_isArray) {
            _context.next = 13;
            break;
          }

          if (!(_i >= _iterator.length)) {
            _context.next = 10;
            break;
          }

          return _context.abrupt('break', 23);

        case 10:
          _ref = _iterator[_i++];
          _context.next = 17;
          break;

        case 13:
          _i = _iterator.next();

          if (!_i.done) {
            _context.next = 16;
            break;
          }

          return _context.abrupt('break', 23);

        case 16:
          _ref = _i.value;

        case 17:
          [index, s] = _ref;
          st = typeof s;

          if (!(st !== 'string' || !s)) {
            _context.next = 21;
            break;
          }

          throw new Error(`clean: index ${index}: not non-empty string: ${st}`);

        case 21:
          _context.next = 7;
          break;

        case 23:
          console.log(`clean: ${args.join(' ')}…`);

          projectDir = fs.realpathSync(process.cwd()); // project directory without symlinks

          _context.next = 27;
          return _regeneratorRuntime.awrap(Promise.all(args.map(s => removeIfExist(path.resolve(projectDir, s)))));

        case 27:
          console.log('clean completed successfully.');

        case 28:
        case 'end':
          return _context.stop();
      }
    }
  }, null, this);
});

function removeIfExist(p) {
  return _regeneratorRuntime.async(function (_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return _regeneratorRuntime.awrap(fs.exists(p));

        case 2:
          if (!_context2.sent) {
            _context2.next = 5;
            break;
          }

          _context2.next = 5;
          return _regeneratorRuntime.awrap(fs.remove(p));

        case 5:
        case 'end':
          return _context2.stop();
      }
    }
  }, null, this);
}

/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
doClean().catch(errorHandler);

function doClean() {
  return _regeneratorRuntime.async(function (_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          ({ argv } = process);
          _context.t0 = cleanx;

          if (!(argv.length > 2)) {
            _context.next = 6;
            break;
          }

          _context.t1 = argv.slice(2);
          _context.next = 9;
          break;

        case 6:
          _context.next = 8;
          return _regeneratorRuntime.awrap(getRollupClean());

        case 8:
          _context.t1 = _context.sent;

        case 9:
          _context.t2 = _context.t1;
          return _context.abrupt('return', (0, _context.t0)(_context.t2));

        case 11:
        case 'end':
          return _context.stop();
      }
    }
  }, null, this);
}

function getRollupClean() {
  var json;
  return _regeneratorRuntime.async(function (_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.t0 = JSON;
          _context2.next = 3;
          return _regeneratorRuntime.awrap(fs.readFile(path.resolve('package.json'), 'utf8'));

        case 3:
          _context2.t1 = _context2.sent;
          json = _context2.t0.parse.call(_context2.t0, _context2.t1);
          return _context2.abrupt('return', json && json.rollup && json.rollup.clean);

        case 6:
        case 'end':
          return _context2.stop();
      }
    }
  }, null, this);
}

function errorHandler(e) {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
}
