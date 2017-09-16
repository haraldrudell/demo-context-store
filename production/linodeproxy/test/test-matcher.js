// test-matcher.js
// © Harald Rudell 2012 MIT License

var matcher = require('../lib/matcher')

// https://github.com/haraldrudell/haraldutil
var haraldutil = require('haraldutil')

// https://github.com/haraldrudell/mochawrapper
var assert = require('mochawrapper')

exports['Matcher:'] = {
	'Exports': function () {
		assert.exportsTest(matcher, 1)
	},
	'Match': function () {
		var tests = [
			{name: 'arguments undefined returns false', expected: false},
			{name: 'unmatched: true returns true', opts: {unmatched: true}, expected: true},
			{name: 'whitelist hit returns true', text: 'abc', opts: {matcherList: [{matcher: 'abc'}]}, expected: true},
			{name: 'blacklist hit returns false', text: 'abc', opts: {unmatched: true, matcherList: [
				{matcher: ['ac', /a?c/]}
				]}, expected: true},
		]

		tests.forEach(function (test) {
			var actual = matcher.match(test.text, test.opts)
			assert.equal(actual, test.expected, test.name)
		})
	},
}