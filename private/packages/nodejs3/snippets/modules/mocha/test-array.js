// test-array.js

var assert = require('mochawrapper')

exports['Array Length:'] = {
	'array.length returns a number': function () {
		var expected = 'number'
		var actual = typeof [].length
		assert.equal(expected, actual)
	},
	'Testing with callback (asynchronous)': function (done) {
		setTimeout(completeWhenThisExecutes, 100)
		console.log('background complete')
		function completeWhenThisExecutes() {
			console.log('finishing test')
			done()
		}
	}
}