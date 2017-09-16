// async.js
// demonstrate nodeunit testing of asynchronous code (that has callbacks)

module.exports = {
	tests: {
		okTest: okTest,
		testNextTick: testNextTick,
		testThreeSecondTimeout: testThreeSecondTimeout,
	},
}

function okTest(test) {
	test.done()
}

// in this case nodeunit wait for the callback function
function testThreeSecondTimeout(test) {
	var func = arguments.callee.toString().substring(9, arguments.callee.toString().indexOf('(')) || 'anonymous'
	console.log(func, 'executing')

	setTimeout(timeoutCallback, 3000)
	function timeoutCallback() {
		var func = arguments.callee.toString().substring(9, arguments.callee.toString().indexOf('(')) || 'anonymous'
		console.log(func)
		test.done()
	}

	console.log(func, 'exiting')
}

function testNextTick(test) {
	var func = arguments.callee.toString().substring(9, arguments.callee.toString().indexOf('(')) || 'anonymous'
	console.log(func, 'executing')

	process.nextTick(function nextTickCallback() {
		var func = arguments.callee.toString().substring(9, arguments.callee.toString().indexOf('(')) || 'anonymous'
		console.log(func)
		test.done()
	})

	console.log(func, 'exiting')
}
