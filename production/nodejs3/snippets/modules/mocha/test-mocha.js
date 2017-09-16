// test-mocha.js
var haraldutil = require('haraldutil')
var assert = require('assert')

exports['Mocha assertion failure reports:'] = {
	'Assertion failure with modified object property: should be value: "correct"': function () {
		var o = {
			value: 'correct',
		}
		assert.equal(o, false)
		o.value = 'bad'
	},
	'Order of boolean assert.equal values: should be false == true': function () {
		assert.equal(false, true)
	},
	'Actual values when message provided': function () {
		assert.equal(false, true, 'Assertion message')
	},
	'Verify mochas nice text diff printouts': function () {
		assert.equal('abcabc', 'abdabc')
	},
	'Test deep equal appearance': function () {
		var o1 = {
			a: {
				b: 1,
			},
		}
		var o2 = {
			a: {
				b: 2,
			},
		}
		assert.deepEqual(o1, o2)
	}
}