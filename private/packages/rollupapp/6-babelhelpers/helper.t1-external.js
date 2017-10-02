'use strict';

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

/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
console.log('PREFLIGHTBEFORE');

var Foo = function Foo() {
  babelHelpers.classCallCheck(this, Foo);
};

console.log('PREFLIGHTAFTER');

console.log('helper', new ClassA('alpha'), new ClassB('beta'));

module.exports = Foo;
