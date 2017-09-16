// mailsender.js
// Sends Email using an Internet mail transfer server
// © Harald Rudell 2013 <harald.rudell@therudells.com> All rights reserved.

var nodemailer = require('nodemailer') // https://github.com/andris9/nodemailer
var events = require('events') // http://nodejs.org/api/events.html
var util = require('util') // http://nodejs.org/docs/latest/api/util.html

exports.MailSender = MailSender

/*
Provide a connection for sending mail
opts: object
.transport: optional string transport type, default 'SMTP'
.service: optional string predefined service, eg. 'Gmail'
.auth: optional object authentication details: user, pass

events
'ready': the object is ready to accept mail
'error' err
*/
function MailSender(opts) {
	if (!opts) opts = {}
	var self = this
	this.send = send
	this.close = close
	events.EventEmitter.call(this)
	var transport

	connect()
	process.nextTick(haveTransport() ?
		readyEmitter :
		getErrorEmitter('Creating the specified transport failed.'))

	function connect() {
		var type = opts.transport || 'SMTP'
		transport  = nodemailer.createTransport(type, opts)
	}

	function haveTransport() {
		return transport && !!transport.transport
	}

	/*
	Send mail
	opts: object
	.subject: string: mail subject line
	.body: optional string: mail body
	.html: optional string: mail body as html
	to: string or array of string: mailbox recipients
	.debug: optional boolean, default false
	(.from .sender .replyTo .reply_to .cc .bcc .envelope .inReplyTo, .references)
	cb(err, id): optional function, id: string message id
	*/
	function send(opts, cb) {
		if (haveTransport()) transport.sendMail(opts, sendResult)
		else sendResult(new Error('Transport unavailable'))

		function sendResult(err, success) {
			var id = success && success.messageId
			if (typeof id !== 'string') id = ''

			if (!err && success && Array.isArray(success.failedRecipients) &&
				success.failedRecipients.length) err = new Error('Failed recipients:' + success.failedRecipients)
			if (cb) cb(err, id)
			else if (err) throw err
		}
	}

	/*
	Close transport if open
	cb(err): optional function
	*/
	function close(cb) {
		if (haveTransport()) {
			var t = transport
			transport = null
			if (t.close) t.close(closeResult)
			else closeResult()
		} else closeResult()

		function closeResult(err) {
			if (cb) cb(err)
			else if (err) throw err
		}
	}

	function getErrorEmitter(s) {
		var e = new Error(s)
		return emit

		function emit() {
			self.emit('error', e)
		}
	}

	function readyEmitter() {
		self.emit('ready')
	}
}
util.inherits(MailSender, events.EventEmitter)
