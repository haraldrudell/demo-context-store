// mailoutmessage.js
// Provide a writable stream for a single message
// © Harald Rudell 2013 <harald.rudell@therudells.com> All rights reserved.

var stream = require('stream') // http://nodejs.org/api/stream.html
var util = require('util') // http://nodejs.org/api/util.html

exports.Message = Message

/*
writable stream for one message
options: object from, to
smtpClient

events
'rcptFailed' array of string
'error' Error
'complete' will always be emitted
*/
function Message(options, smtpClient) {
	var self = this
	stream.PassThrough.call(this)

	smtpClient.once('error', errorListener)
	smtpClient.once('message', sendMessage)
	smtpClient.once('rcptFailed', recipientListener)
	smtpClient.useEnvelope(options)
	options = null

	function recipientListener(recipients) {
		if (Array.isArray(recipients) && recipients.length) self.emit('rcptFailed', recipients)
	}

	function sendMessage() {
		cleanup()
		smtpClient.once('error', failureListener)
		smtpClient.once('ready', emitComplete)
		self.once('error', emitComplete)
			.pipe(smtpClient)
	}

	function cleanup() {
		smtpClient.removeListener('error', errorListener)
		smtpClient.removeListener('message', sendMessage)
		smtpClient.removeListener('rcptFailed', recipientListener)
	}

	function errorListener(err) {
		cleanup()
		self.emit('error', err)
		emitComplete()
	}

	function failureListener(err) {
		self.emit(err)
		emitComplete(false, '')
	}

	function emitComplete(success, line) {
		smtpClient.removeListener('error', failureListener)
		smtpClient.removeListener('ready', emitComplete)
		self.removeListener('error', emitComplete)
		self.emit('complete', success, line)
	}
}
util.inherits(Message, stream.PassThrough)
