'use strict';

var _regeneratorRuntime = require("regenerator-runtime");

/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
var ClassA = function ClassA(aaa) {
  babelHelpers.classCallCheck(this, ClassA);

  this.aaa = aaa;
};

/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
var ClassB = function ClassB(bbb) {
  babelHelpers.classCallCheck(this, ClassB);

  this.aaa = bbb;
};

var asyncFunction = function () {
  var _ref = babelHelpers.asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
    var m;
    return _regeneratorRuntime.wrap(function _callee$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            m = 'asyncFunction';

            console.log(m + ' will wait 1 s');
            _context2.next = 4;
            return new Promise(function (r) {
              return setTimeout(r, 1e3);
            });

          case 4:
            console.log(m + ' done');

          case 5:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee, this);
  }));

  return function asyncFunction() {
    return _ref.apply(this, arguments);
  };
}();

var _marked = /*#__PURE__*/_regeneratorRuntime.mark(generator);

/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
testGenerator();
testAsyncFunction();

function generator() {
  var m;
  return _regeneratorRuntime.wrap(function generator$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          m = 'generator';

          console.log(m + ' function  body executing');
          _context.next = 4;
          return 1;

        case 4:
          console.log(m + ' end of function body');

        case 5:
        case 'end':
          return _context.stop();
      }
    }
  }, _marked, this);
}

function testGenerator() {
  console.log('Invoking generator function…');
  var v1 = generator();
  console.log('generator returned:', v1);
  console.log('invoking next…');
  var v2 = v1.next();
  console.log('first next value:', v2);
  console.log('invoking next…');
  var v3 = v1.next();
  console.log('second next value:', v3);
  console.log('invoking next…');
  var v4 = v1.next();
  console.log('second next value:', v4);
}

function testAsyncFunction() {
  console.log('invoking async function…');
  var v1 = asyncFunction();
  console.log('async function return value:', v1);
}

//for (let value of generator()) console.log(`generator value: ${value}`)
console.log('helper', new ClassA('alpha'), new ClassB('beta'));
console.log('end of program');
