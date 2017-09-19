'use strict';

/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
function fn() {
  console.log('fn');
}

/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
fn();

/* stage-3: no:
const o = {a: 1}
console.log(`object-rest-spread: ${{...o}}`)
*/

// ECMAScript 2016: yes
console.log(`ECMAScript 2016: ${2**2}`);

// ECMAScript 2017: yes
foo();
async function foo() {
  await new Promise((resolve, reject) => setTimeout(resolve, 1e3));
}
