// printoutexamples.js
// Determine optimal printout function
// © Harald Rudell 2013

// http://nodejs.org/api/util.html
var util = require('util')

/*
printoutexamples:7:<anonymous> Print format comparison: util.format, inspect, inspectDeep
util.format
undefined null true 1 'abc' { a: 1 } [Function: func] { a: 1 } [ 1, 2 ] Sun Jan 06 2013 11:22:56 GMT-0800 (PST) /a/g [Error: error]
inspect
undefined, null, true, 1, 'abc', {
  a:1
}, function func(arg), object:Class {
  a:1
}, 2:[1, 2], Date(1357500176569), /a/g, object:Error {}
inspectDeep
undefined, null, true, 1, 'abc', {
  a:1
}, function func(arg), object:Class {
  a:1
}, 2:[1, 2, (nonE)length:2], Date(1357500176569), /a/g {
  (nonE)lastIndex:0,
  (nonE)global:true,
  (nonE)source:'a',
  (nonE)ignoreCase:false,
  (nonE)multiline:false
}, object:Error {
  (nonE)(get)stack:Error: error,
      at Object.<anonymous> (/home/foxyboy/Desktop/c505/node/nodejs3/snippets/projects/haraldutil/printoutexamples.js:21:2),
      at Module._compile (module.js:449:26),
      at Object.Module._extensions..js (module.js:467:10),
      at Module.load (module.js:356:32),
      at Function.Module._load (module.js:312:12),
      at Module.runMain (module.js:492:10),
      at process.startup.processNextTick.process._tickCallback (node.js:244:9),
  (nonE)type:undefined,
  (nonE)message:'error',
  (nonE)arguments:undefined,
  -- prototype:Error,
  (nonE)name:'Error',
  (nonE)message:'',
  (nonE)toString:function toString()
}
*/

// https://github.com/haraldrudell/haraldutil
var haraldutil = require('haraldutil')
var p = haraldutil.p

p('Print format comparison: util.format, inspect, inspectDeep')

// add number in front and remove it
var s = util.format(0, 'x').substring(2)
console.log(s)

var values = [
	undefined,
	null,
	true,
	1,
	'a\nc',
	{a: 1},
	function func(arg) {},
	new function Class() {this.a = 1},
	[1, 2],
	new Date,
	/a/g,
	new Error('error'),
]

console.log('util.format')
console.log.apply(this, values)

;['inspect', 'inspectDeep'].forEach(function (fName) {

	console.log(fName)

	s = []
	values.forEach(function (value) {
		s.push(require('haraldutil')[fName](value))
	})
	console.log(s.join(', '))
})