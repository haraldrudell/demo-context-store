/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
/*
test async generator transform

https://babeljs.io/docs/plugins/transform-async-generator-functions/

../../node_modules/.bin/babel-node src/asyncGeneratorTransform.js

{
  "plugins": ["transform-async-generator-functions"]
}
npm install --save-dev babel-plugin-transform-async-generator-functions
*/

async function* agf() {
  await 1;
  yield 2;
}

async function f() {
  for await (let x of y) {
    g(x);
  }
}

async function* genAnswers() {
  var stream = [ Promise.resolve(4), Promise.resolve(9), Promise.resolve(12) ];
  var total = 0;
  for await (let val of stream) {
    total += await val;
    yield total;
  }
}

function forEach(ai, fn) {
  return ai.next().then(function (r) {
    if (!r.done) {
      fn(r);
      return forEach(ai, fn);
    }
  });
}

var output = 0;
forEach(genAnswers(), function(val) { output += val.value })
.then(function () {
  console.log(output); // 42
});
