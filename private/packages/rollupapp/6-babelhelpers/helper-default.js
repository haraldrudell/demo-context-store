'use strict';

/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
class ClassA {
  constructor(aaa) {
    this.aaa = aaa;
  }
}

/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
class ClassB {
  constructor(bbb) {
    this.aaa = bbb;
  }
}

/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
console.log('PREFLIGHTBEFORE');
class Foo {}
console.log('PREFLIGHTAFTER');

console.log('helper', new ClassA('alpha'), new ClassB('beta'));

module.exports = Foo;
