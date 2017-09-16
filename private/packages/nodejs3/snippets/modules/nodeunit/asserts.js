// asserts.js

// https://github.com/caolan/nodeunit
// http://nodejs.org/docs/latest/api/assert.html
/*
assert.equal(actual, expected, [message])
assert.notEqual(actual, expected, [message])
assert.deepEqual(actual, expected, [message])
assert.notDeepEqual(actual, expected, [message])
assert.strictEqual(actual, expected, [message])
assert.notStrictEqual(actual, expected, [message])
assert.throws(block, [error], [message])
assert.ifError(value)
*/

module.exports = {
	testAssert: testAssert,
}

function testAssert(test) {

	// assert.fail(actual, expected, message, operator)
	// fail prints produces an error message with stack trace
	// message does not seem to be used
	// AssertionError: 1 op 2
	//test.fail(1, 2, 'msg', 'op')

	// assert(value, message), assert.ok(value, [message])
	// with no custom message, you get the values and a stack trace
	// AssertionError: true == null
    	// at Object.ok (/usr/local/lib/node_modules/nodeunit/lib/types.js:83:39)
	// test.ok(null)
	// with message, values are not printed
	// Assertion Message: message
	// AssertionError: message
	//test.ok(null, 'message')

	// exceptions
	// Exceptions are printed with their message and a stack trace
	// Error: testException
    	// at Error (unknown source)
    	//at Object.testScrub (/home/foxyboy/Desktop/c505/node/nodejs3/test/test-scrub.js:41:8)
	//throw Error('testException')

	// assert.doesNotThrow(block, [error], [message])
	test.doesNotThrow(
		
	)

	// throw non-Error
	// shows up as undefined without stack trace
	// undefined
	//throw 2

	test.done()
}