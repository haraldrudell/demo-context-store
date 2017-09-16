// test-mailsender.js
// © Harald Rudell 2013 <harald.rudell@therudells.com> All rights reserved.

var mailsender = require('../lib/mailsender')

var nodemailer = require('nodemailer') // https://github.com/andris9/nodemailer

var assert = require('mochawrapper') // https://github.com/haraldrudell/mochawrapper

var ct = nodemailer.createTransport

exports['MailSender:'] = {
	'Exports': function () {
		assert.exportsTest(mailsender, 1)
	},
	'Instantiate': function (done) {
		var transport = {}
		var opts = {transport: transport}
		var mockTransport = {transport: true}
		nodemailer.createTransport = function mockCreateTransport(t, o) {
			assert.equal(t, transport)
			assert.equal(o, opts)
			return mockTransport
		}
		var m = new mailsender.MailSender(opts)
			.on('ready', done)
	},
	'Create Failure': function (done) {
		var mockTransport = {}
		nodemailer.createTransport = function mockCreateTransport(t, o) {
			return mockTransport
		}
		var m = new mailsender.MailSender()
			.on('error', errorEvent)

		function errorEvent(err) {
			assert.ok(~err.message.substring('Creating'))

			done()
		}
	},
	'Send': function (done) {
		var mockTransport = {
			transport: true,
			sendMail: mockSendMail,
		}
		nodemailer.createTransport = function mockCreateTransport(t, o) {
			return mockTransport
		}
		var one = {}
		var anId = 'ID'
		var two = {messageId: anId}
		var m = new mailsender.MailSender()
			.on('ready', sendMail)

		function sendMail() {
			m.send(one, sendResult)
		}

		function  mockSendMail(o, cb) {
			assert.equal(o, one, 'first argument bad')
			cb(null, two)
		}

		function sendResult(err, id) {
			if (err) assert.equal(err, null)
			assert.equal(id, anId, 'id bad')

			done()
		}
	},
	'Close': function (done) {
		var mockTransport = {
			transport: true,
			close: mockClose,
		}
		nodemailer.createTransport = function mockCreateTransport(t, o) {
			return mockTransport
		}
		var closeC = 0
		var m = new mailsender.MailSender()
			.on('ready', doClose)

		function doClose() {
			m.close(closeResult)
		}

		function  mockClose(cb) {
			closeC++
			cb()
		}

		function closeResult(err) {
			if (err) assert.equal(err, null)
			assert.equal(closeC, 1)

			done()
		}
	},
	'after': function () {
		nodemailer.createTransport = ct
	}
}
