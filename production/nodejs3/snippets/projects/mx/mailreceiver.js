// mailreceiver.js
// Receives Email on a local network interface
// © Harald Rudell 2013 <harald.rudell@therudells.com> All rights reserved.

var simplesmtp = require('simplesmtp') // https://github.com/andris9/simplesmtp
var events = require('events') // http://nodejs.org/api/events.html
var util = require('util') // http://nodejs.org/docs/latest/api/util.html

exports.MailReceiver = MailReceiver

/*
*/
function MailReceiver(opts) {
	var self = this
	this.close = close
	events.EventEmitter.call(this)
	var smtpServer

	process.nextTick(connect)

	function connect() {
		try {
			smtpServer = simplesmtp.createServer(/*opts.mtaOptions*/)
		} catch (e) {
			self.emit('error', e)
		}
	}

	function close(cb) {
		if (smtpServer) {
			var mtaCopy = smtpServer
			smtpServer = null
			mtaCopy.end(endResult)
		} else endResult()

		function endResult(err) {
			cb(err)
		}
	}
}
util.inherits(MailReceiver, events.EventEmitter)
