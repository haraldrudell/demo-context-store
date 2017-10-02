'use strict';

function unwrapExports (x) {
	return x && x.__esModule ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var classCallCheck = createCommonjsModule(function (module, exports) {
"use strict";

exports.__esModule = true;

exports.default = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};
});

var _classCallCheck = unwrapExports(classCallCheck);

/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
var ClassA = function ClassA(aaa) {
  _classCallCheck(this, ClassA);

  this.aaa = aaa;
};

/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
var ClassB = function ClassB(bbb) {
  _classCallCheck(this, ClassB);

  this.aaa = bbb;
};

/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
console.log('PREFLIGHTBEFORE');

var Foo = function Foo() {
  _classCallCheck(this, Foo);
};

console.log('PREFLIGHTAFTER');

console.log('helper', new ClassA('alpha'), new ClassB('beta'));

module.exports = Foo;
