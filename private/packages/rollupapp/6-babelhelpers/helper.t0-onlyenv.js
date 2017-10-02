'use strict';

function _classCallCheck$1(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
var ClassA = function ClassA(aaa) {
  _classCallCheck$1(this, ClassA);

  this.aaa = aaa;
};

function _classCallCheck$2(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
var ClassB = function ClassB(bbb) {
  _classCallCheck$2(this, ClassB);

  this.aaa = bbb;
};

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
