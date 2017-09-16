// error.js
// © Harald Rudell 2012

var inspect = require('../projects/haraldutil/inspect')

var e = new Error('1string', '2string', '3string')
require('haraldutil').pp(e)

/*
JavaScript 15.11 Error objects:
type is object
All errors are subclasses of error, so instanceof Error covers all errors objects.
.constructor.name indicates the native error type
.message is a string provided when the error was created
.toString() is a string of .name, a colon, and .message
.valueOf() is the object itself
an error object has no enumerable properties

on node.js
.arguments, .type: undefined
.stack
first line: the errror as string
subsequent lines: starts '    at '
some object descriptor
' '
(filename:line:column), or (unknown source)
native error types:
EvalError, RangeError, ReferenceError, SyntaxError, TypeError, URIError

stack frames:
- can have series of property access
    at Object.Module._extensions..js (module.js:467:10)
- can have as added
    at Object.Module.runMain [as _onTimeout] (module.js:492:10)
- can have unknown source
    at SyntaxError (unknown source)
- can have anonymous
    at Object.<anonymous> (/home/foxyboy/Desktop/c505/node/nodejs3/snippets/javascript/error.js:73:12)
*/
var e = Error(3)
console.log
console.log(e)
/*
constructor: Error
log appearance: [Error: 3]
toString: 'Error: 3'
valueOf: object:Error {}
enumerable properties:
other properties:
.arguments undefined
.stack 'Error: 3*    at Error (unknown source)* '
.message '3'
.type undefined
Error: 3
		at Error (unknown source)
		at Object.<anonymous> (/home/foxyboy/Desktop/c505/node/nodejs3/snippets/javascript/error.js:26:12)
		at Module._compile (module.js:441:26)
		at Object..js (module.js:459:10)
		at Module.load (module.js:348:31)
		at Function._load (module.js:308:12)
		at Array.0 (module.js:479:10)
		at EventEmitter._tickCallback (node.js:192:40)
*/
printError(Error(3))

/*
constructor: SyntaxError
log appearance: [SyntaxError: 3]
toString: 'SyntaxError: 3'
valueOf: object:SyntaxError {}
enumerable properties:
other properties:
.arguments undefined
.stack 'SyntaxError: 3*    at SyntaxError (unkno'
.message '3'
.type undefined
SyntaxError: 3
		at SyntaxError (unknown source)
		at Object.<anonymous> (/home/foxyboy/Desktop/c505/node/nodejs3/snippets/javascript/error.js:27:12)
		at Module._compile (module.js:441:26)
		at Object..js (module.js:459:10)
		at Module.load (module.js:348:31)
		at Function._load (module.js:308:12)
		at Array.0 (module.js:479:10)
		at EventEmitter._tickCallback (node.js:192:40)
*/
printError(SyntaxError(3))

/*
inspectAll: object:Error {
	(nonE)arguments: undefined,
	(nonE)(get)stack: 'Error: ha!*    at Object.<anonymous> (/home/foxyboy/Desktop/c505/node/nodejs3/snippets/javascript/error.js:73:47)*    at Module._compile (module.js:441:26)*    at Object..js (module.js:459:10)*    at Module.load (module.js:348:31)*    at Function._load (module.js:308:12)*    at Array.0 (module.js:479:10)*    at EventEmitter._tickCallback (node.js:192:40)',
	(nonE)message: 'ha!',
	(nonE)type: undefined
}
*/
console.log('inspectAll:', inspect.inspectAll(new Error('ha!')))

// examine an operating system error
/*
fsopen: object:Error {
	errno: 34,
	code: 'ENOENT',
	path: '#$#@$#$',
	(nonE)arguments: undefined,
	(nonE)(get)stack: 'Error: ENOENT, open '#$#@$#$'',
	(nonE)message: 'ENOENT, open '#$#@$#$'',
	(nonE)type: undefined
}
*/
require('fs').open('#$#@$#$', 'r', function(err, fd) {
	console.log('fsopen:', inspect.inspectAll(err))
})
function printError(e) {
	console.log()
	//console.log('type:', typeof e)
	console.log('constructor:', e.constructor.name)
	console.log('log appearance:', e)
	console.log('toString:', inspect.inspect(e.toString()))
	console.log('valueOf:', inspect.inspect(e.valueOf()))
	listProperties('enumerable properties:', e, Object.keys(e))
	listProperties('other properties:', e, Object.getOwnPropertyNames(e), Object.keys(e))

	console.log(e.stack)

	function listProperties(title, e, array, excludeArray) {
		console.log(title)
		array.forEach(function (property) {
			if (!excludeArray || excludeArray.indexOf(property) == -1)
				console.log('.' + property, inspect.inspect(e[property]))
		})
	}
}

var e = Error()
pe(e, 'Error ()')
var e = new Error
pe(e, 'new Error')
var e = new Error('que')
pe(e, 'new Error("que")')
var e = Error('que')
pe(e, 'Error("que")')

function pe(e, h) {
	var s = e.stack
	var p1 = s.indexOf('\n')
	var p2 = s.indexOf('\n', p1 + 1)
	console.log(h,s.substring(p1 + 1, p2))
}