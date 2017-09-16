// test-neterrorlistener.js
// © 2013 Harald Rudell <harald.rudell@therudells.com> (http://haraldrudell.com) All rights reserved.

var neterrorlistener = require('../lib/neterrorlistener')

// http://nodejs.org/api/events.html
var events = require('events')

// https://github.com/haraldrudell/mochawrapper
var assert = require('mochawrapper')

exports['NetErrorListener:'] = {
	'Exports': function () {
		assert.exportsTest(neterrorlistener, 2)
	},
	'AddListener': function () {
		var opts = {
			reqRes: new events.EventEmitter,
			emitter: new events.EventEmitter,
		}
		var actual = neterrorlistener.addListener(opts)
	},
	'AddListener BadArg Error': function () {
		assert.throws(function () {
			neterrorlistener.addListener()
		}, /Bad/)
	},
	'Unwrap': function () {
		var opts = {
			reqRes: new events.EventEmitter,
			emitter: new events.EventEmitter,
		}
		var unwrap = neterrorlistener.addListener(opts)

		assert.equal(typeof unwrap, 'function')
		assert.ok(opts.reqRes.listeners('error').length)

		unwrap()

		assert.equal(opts.reqRes.listeners('error').length, 0)
	},
	'AddListener Emit': function () {
		var value = 'XYZ'
		var opts = {
			reqRes: new events.EventEmitter,
			emitter: new events.EventEmitter,
		}
		var expected = {
			address: {
				ip: '0.0.0.0',
				port: 0,
				protocol: 'http',
			},
			netClass: opts.reqRes.constructor.name,
			slogan: 'neterrorlistener',
		}
		neterrorlistener.addListener(opts)

		var errs = []
		opts.emitter.on('error', function mockError(e) {errs.push(e)})
		opts.reqRes.emit('error', new Error(value))

		assert.ok(errs.length)
		var e = errs[0]
		assert.equal(e.message, value)
		var o = e.neterrorlistener
		assert.ok(o)
		assert.equal(typeof (expected.invocation = o.invocation), 'object')
		assert.deepEqual(o, expected)
	},
}
