// test-mailout.js
// © Harald Rudell 2013 <harald.rudell@therudells.com> All rights reserved.

var mailout = require('../lib/mailout')

var simplesmtp = require('simplesmtp') // https://github.com/andris9/simplesmtp
var events = require('events') // http://nodejs.org/api/events.html

var assert = require('mochawrapper') // https://github.com/haraldrudell/mochawrapper

var co = simplesmtp.connect

exports['MailOut:'] = {
	'Exports': function () {
		assert.exportsTest(mailout, 1)
	},
	'Instantiate': function (done) {
		var mockSmtpClient = new events.EventEmitter
		simplesmtp.connect = function mockConnect(port, host, options) {
			return mockSmtpClient
		}
		var m = new mailout.MailOut
		assert.ok(m)
		done()
	},
	'after': function () {
		simplesmtp.connect = co
	}
}
