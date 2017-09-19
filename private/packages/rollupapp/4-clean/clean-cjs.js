'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _regeneratorRuntime = _interopDefault(require('babel-runtime/regenerator'));
var _asyncToGenerator = _interopDefault(require('babel-runtime/helpers/asyncToGenerator'));
var _typeof = _interopDefault(require('babel-runtime/helpers/typeof'));
var _getIterator = _interopDefault(require('babel-runtime/core-js/get-iterator'));
var _Promise = _interopDefault(require('babel-runtime/core-js/promise'));
var _slicedToArray = _interopDefault(require('babel-runtime/helpers/slicedToArray'));
var fs = _interopDefault(require('fs-extra'));
var path = _interopDefault(require('path'));

var removeIfExist = function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(p) {
    return _regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return fs.exists(p);

          case 2:
            if (!_context2.sent) {
              _context2.next = 5;
              break;
            }

            _context2.next = 5;
            return fs.remove(p);

          case 5:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function removeIfExist(_x2) {
    return _ref4.apply(this, arguments);
  };
}();

/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
var cleanx = (function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(args) {
    var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _ref2, _ref3, index, s, st, projectDir;

    return _regeneratorRuntime.wrap(function _callee$(_context) {
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
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context.prev = 9;
            _iterator = _getIterator(args);

          case 11:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context.next = 22;
              break;
            }

            _ref2 = _step.value;
            _ref3 = _slicedToArray(_ref2, 2);
            index = _ref3[0];
            s = _ref3[1];
            st = typeof s === 'undefined' ? 'undefined' : _typeof(s);

            if (!(st !== 'string' || !s)) {
              _context.next = 19;
              break;
            }

            throw new Error('clean: index ' + index + ': not non-empty string: ' + st);

          case 19:
            _iteratorNormalCompletion = true;
            _context.next = 11;
            break;

          case 22:
            _context.next = 28;
            break;

          case 24:
            _context.prev = 24;
            _context.t0 = _context['catch'](9);
            _didIteratorError = true;
            _iteratorError = _context.t0;

          case 28:
            _context.prev = 28;
            _context.prev = 29;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 31:
            _context.prev = 31;

            if (!_didIteratorError) {
              _context.next = 34;
              break;
            }

            throw _iteratorError;

          case 34:
            return _context.finish(31);

          case 35:
            return _context.finish(28);

          case 36:
            console.log('clean: ' + args.join(' ') + '\u2026');

            projectDir = fs.realpathSync(process.cwd()); // project directory without symlinks

            _context.next = 40;
            return _Promise.all(args.map(function (s) {
              return removeIfExist(path.resolve(projectDir, s));
            }));

          case 40:
            console.log('clean completed successfully.');

          case 41:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[9, 24, 28, 36], [29,, 31, 35]]);
  }));

  function cleanx(_x) {
    return _ref.apply(this, arguments);
  }

  return cleanx;
})();

var doClean = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
    var _process, argv;

    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _process = process, argv = _process.argv;
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
            return getRollupClean();

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
    }, _callee, this);
  }));

  return function doClean() {
    return _ref.apply(this, arguments);
  };
}();

var getRollupClean = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2() {
    var json;
    return _regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.t0 = JSON;
            _context2.next = 3;
            return fs.readFile(path.resolve('package.json'), 'utf8');

          case 3:
            _context2.t1 = _context2.sent;
            json = _context2.t0.parse.call(_context2.t0, _context2.t1);
            return _context2.abrupt('return', json && json.rollup && json.rollup.clean);

          case 6:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function getRollupClean() {
    return _ref2.apply(this, arguments);
  };
}();

/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
doClean().catch(errorHandler);

function errorHandler(e) {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
}
