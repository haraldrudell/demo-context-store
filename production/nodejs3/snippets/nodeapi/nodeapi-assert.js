// nodeapi-assert.js

// http://nodejs.org/api/assert.html
var assert = require('assert')

console.log(__filename.substring(__filename.lastIndexOf('/') + 1), 'starting.')

/*
assert.fail(actual, expected, message, operator)
assert(value, message), assert.ok(value, [message])
assert.equal(actual, expected, [message])
assert.notEqual(actual, expected, [message])
assert.deepEqual(actual, expected, [message])
assert.notDeepEqual(actual, expected, [message])
assert.strictEqual(actual, expected, [message])
assert.notStrictEqual(actual, expected, [message])
assert.throws(block, [error], [message])
assert.doesNotThrow(block, [error], [message])
assert.ifError(value)
*/

// assert compares to true (aliased assert.ok)
// A successful assert does nothing, ie. true == true
assert(true)
/*
assert-1. A failed assert throws exception and prints the provided value.
 AssertionError: false == true
    at Object.<anonymous> (/home/foxyboy/Desktop/c505/node/nodejs3/snippets/nodeapi/nodeapi-assert.js:37:2)
    at Module._compile (module.js:449:26)
    at Object.Module._extensions..js (module.js:467:10)
    at Module.load (module.js:356:32)
    at Function.Module._load (module.js:312:12)
    at Module.runMain (module.js:492:10)
    at process.startup.processNextTick.process._tickCallback (node.js:244:9)
*/
try {
	assert(false)
} catch (e) {
	console.log('assert-1. A failed assert throws exception and prints the provided value.')
	e.stack.split('\n').slice(0, 2).forEach(function (t) { console.log(t) })
	console.log()
}
/*
assert-2. The actual value is what is being printed.
 AssertionError: "" == true
    at Object.<anonymous> (/home/foxyboy/Desktop/c505/node/nodejs3/snippets/nodeapi/nodeapi-assert.js:42:2)
    at Module._compile (module.js:449:26)
    at Object.Module._extensions..js (module.js:467:10)
    at Module.load (module.js:356:32)
    at Function.Module._load (module.js:312:12)
    at Module.runMain (module.js:492:10)
    at process.startup.processNextTick.process._tickCallback (node.js:244:9)
*/
try {
	assert('')
} catch (e) {
	console.log('assert-2. The actual value is what is being printed.')
	e.stack.split('\n').slice(0, 2).forEach(function (t) { console.log(t) })
	console.log()
}
/*
assert-3. If message is provided values are not printed.
 AssertionError: text
    at Object.<anonymous> (/home/foxyboy/Desktop/c505/node/nodejs3/snippets/nodeapi/nodeapi-assert.js:59:2)
    at Module._compile (module.js:449:26)
    at Object.Module._extensions..js (module.js:467:10)
    at Module.load (module.js:356:32)
    at Function.Module._load (module.js:312:12)
    at Module.runMain (module.js:492:10)
    at process.startup.processNextTick.process._tickCallback (node.js:244:9)
*/
try {
	assert(false, 'text')
} catch (e) {
	console.log('assert-3. If message is provided values are not printed')
	e.stack.split('\n').slice(0, 2).forEach(function (t) { console.log(t) })
	console.log()
}

// assert.equal compares to primitive values
/*
equal-1. Equal without message prints the two values.
 AssertionError: 1 == 2
    at Object.<anonymous> (/home/foxyboy/Desktop/c505/node/nodejs3/snippets/nodeapi/nodeapi-assert.js:74:9)
    at Module._compile (module.js:449:26)
    at Object.Module._extensions..js (module.js:467:10)
    at Module.load (module.js:356:32)
    at Function.Module._load (module.js:312:12)
    at Module.runMain (module.js:492:10)
    at process.startup.processNextTick.process._tickCallback (node.js:244:9)
*/
try {
	assert.equal(1, 2)
} catch (e) {
	console.log('equal-1. Equal without message prints the two values')
	e.stack.split('\n').slice(0, 2).forEach(function (t) { console.log(t) })
	console.log()
}
/*
equal-2. Equal with message prints no values.
 AssertionError: text
    at Object.<anonymous> (/home/foxyboy/Desktop/c505/node/nodejs3/snippets/nodeapi/nodeapi-assert.js:90:9)
    at Module._compile (module.js:449:26)
    at Object.Module._extensions..js (module.js:467:10)
    at Module.load (module.js:356:32)
    at Function.Module._load (module.js:312:12)
    at Module.runMain (module.js:492:10)
    at process.startup.processNextTick.process._tickCallback (node.js:244:9)
*/
try {
	assert.equal(1, 2, 'text')
} catch (e) {
	console.log('equal-2. Equal with message prints no values.')
	e.stack.split('\n').slice(0, 2).forEach(function (t) { console.log(t) })
	console.log()
}

//
try {
	assert.deepEqual({ first: 1 }, { second: 2})
} catch (e) {
	console.log('deepEqual-1. deepEqual compares objects and arrays.')
	e.stack.split('\n').slice(0, 2).forEach(function (t) { console.log(t) })
	console.log()
}



// custom assert that provides message and values
/*
Custom code printing both message and values.
 AssertionError: failing test:My test actual:1 expected:2 operation:equal
    at doTest (/home/foxyboy/Desktop/c505/node/nodejs3/snippets/nodeapi/nodeapi-assert.js:117:2)
    at Object.<anonymous> (/home/foxyboy/Desktop/c505/node/nodejs3/snippets/nodeapi/nodeapi-assert.js:110:2)
    at Module._compile (module.js:449:26)
    at Object.Module._extensions..js (module.js:467:10)
    at Module.load (module.js:356:32)
    at Function.Module._load (module.js:312:12)
    at Module.runMain (module.js:492:10)
    at process.startup.processNextTick.process._tickCallback (node.js:244:9)
*/
var actual = 1
var expected = 2
try {
	doTest(assert.equal, actual, expected, 'My test')
} catch(e) {
	console.log('Custom code printing both message and values.')
	e.stack.split('\n').slice(0, 2).forEach(function (t) { console.log(t) })
	console.log()
}

// support code
function doTest(f, actual, expected, heading) {
	f(actual, expected,
		assertMessage(actual, expected, heading, f.name))
}

// code from
// (node source folder)/lib/assert.js
function assertMessage(actual, expected, heading, operator) {
	result = []
	if (heading) result.push('failing test:', heading)
	result.push(
		' actual:',
		truncate(JSON.stringify(actual, replacer), 128),
		' expected:',
		truncate(JSON.stringify(expected, replacer), 128),
		' operation:',
		operator || '=='
	)
	return result.join('')

	function replacer(key, value) {
		if (value === undefined) return '' + value
		if (typeof value === 'number' && (isNaN(value) || !isFinite(value))) return value.toString()
		if (typeof value === 'function' || value instanceof RegExp) return value.toString()
		return value
	}
	function truncate(s, n) {
		if (typeof s == 'string')  return s.length < n ? s : s.slice(0, n)
		return s
	}
}

// end of file
console.log(__filename.substring(__filename.lastIndexOf('/') + 1), 'finsihed successfully.')