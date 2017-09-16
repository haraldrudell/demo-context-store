// test-withoutdone.js
var assert = require('assert')

var test1Complete

exports['mocha with callbacks'] = {
	'initiate timeout': function (done) {
		setTimeout(f, 100)
		function f() {
			test1Complete = true
			console.log('timeout complete')
			done()
		}
	},
	'subsequent tests should not start before callback completes': function (done) {
		assert.ok(test1Complete, 'setTimeout has not completed')
		done(5)
	},
} 