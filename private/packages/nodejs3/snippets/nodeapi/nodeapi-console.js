// nodeapi-console.js
// © Harald Rudell 2012

// http://nodejs.org/api/stdio.html

// https://github.com/haraldrudell/haraldutil
var haraldutil = require('haraldutil')

/*
console
console.log([data], [...])
console.info([data], [...])
console.error([data], [...])
console.warn([data], [...])
console.dir(obj)
console.time(label)
console.timeEnd(label)
console.trace(label)
console.assert(expression, [message])
*/

/*
{
  info:function (),
  log:recursive-object#2,
  error:function (),
  time:function (label),
  warn:recursive-object#3,
  dir:function (object),
  trace:function (label),
  assert:function (expression),
  timeEnd:function (label)
}
*/
console.log(haraldutil.inspectDeep(console))

console.log('console.dir:')
// prints: { a: 1 }
console.dir({a: 1})

var label = 'haha'
console.time(label)
setTimeout(f, 100)
function f() {
	// haha: 101ms
	console.timeEnd(label)
}