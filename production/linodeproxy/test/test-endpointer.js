// test-endpointer.js
// © 2013 Harald Rudell <harald.rudell@therudells.com> (http://haraldrudell.com) All rights reserved.

var endpointer = require('../lib/endpointer')

// https://github.com/haraldrudell/mochawrapper
var assert = require('mochawrapper')

exports['EndPointer:'] = {
	'Exports': function () {
		assert.exportsTest(endpointer, 2)
	},
	'GetAddress': function() {
		var expected = {
			ip: '0.0.0.0',
			port: 0,
			protocol: 'http',
		}
		var actual = endpointer.getAddress()

		assert.deepEqual(actual, expected)
	},
	'GetAddress Socket': function() {
		var reqRes = {
			socket: {
				remoteAddress: 'IP',
				remotePort: 'PORT',
				server: {constructor: {name: 'HTTPSServer',}}
			}
		}
		var expected = {
			ip: reqRes.socket.remoteAddress,
			port: reqRes.socket.remotePort,
			protocol: 'https',
		}

		var actual = endpointer.getAddress(reqRes)

		assert.deepEqual(actual, expected)
	},
	'GetAddress Headers': function() {
		var reqRes = {
			headers: {
				'x-forwarded-for': 'IP',
				'x-forwarded-port': 'PORT',
				'x-forwarded-proto': 'PROTOCOL',
			}
		}
		var expected0 = {
			ip: reqRes.headers['x-forwarded-for'],
			port: reqRes.headers['x-forwarded-port'],
			protocol: reqRes.headers['x-forwarded-proto'],
		}
		var expected1 = {
			ip: '0.0.0.0',
			port: 0,
			protocol: 'http',
		}

		var actual = endpointer.getAddress(reqRes)

		assert.deepEqual(actual, expected0)

		var actual = endpointer.getAddress(reqRes, false)

		assert.deepEqual(actual, expected1)
	},
	'GetInfo': function() {
		var reqRes = {
			url: 'URL',
			method: 'METHOD',
			headers: {host: 'HOST'},
		}
		var expected = {
			ip: '0.0.0.0',
			port: 0,
			protocol: 'http',
			url: reqRes.url,
			method: reqRes.method,
			host: reqRes.headers.host,
		}

		var actual = endpointer.getInfo(reqRes)

		assert.deepEqual(actual, expected)
	},
}
