// mailout.js
// Sends Email using a write stream api to an Internet mail transfer server
// © Harald Rudell 2013 <harald.rudell@therudells.com> All rights reserved.

/*
MailOut provides one outgoing mail connection
*/

var mailoutmessage = require('./mailoutmessage')
var simplesmtp = require('simplesmtp') // https://github.com/andris9/simplesmtp
var events = require('events') // http://nodejs.org/api/events.html
var util = require('util') // http://nodejs.org/api/util.html

var tenSeconds = 1e4
var connectTimeoutValue = tenSeconds

exports.MailOut = MailOut

/*
MailOut(options) constructor for one outgoing smtp connection that connects on instantiation
options: object
.port: number smtp server port
.host: option string, default 'localhost' smtp server fully qualified hostname
.connectTimeout: number, default 10 s, unit ms: timeout for initial connection
.secureConnection: boolean, default false: use SSL
.auth: object user, pass strings
.debug: boolean, default false: output debug text to console
ignoreTLS, tls, logFile, instanceId, localAddress: see simplesmtp

isConnecting(): boolean
isReady(): boolean

getWritable(options, cb): send mail using a write stream
options: object
.from: string: mailbox address of sender used for smtp envelope
.to: string array: mailbox addresses for recipients for smtp envelope
cb(err, writable): writable stream
- write To, Subject, empty line, Body

sendMail(options, cb): send mail using in-memory object
options: object
cb(err)

close(cb)
cb(err): optional function

events
'ready' initial connection established
'end' close() call completed
'error' Error
the final event is end or one or more error
*/
function MailOut(options) {
	if (!options) options = {}
	var self = this
	events.EventEmitter.call(this)
	this.isConnecting = isConnecting
	this.isReady = isReady
	this.getWritable = getWritable
	this.close = close
	var smtpClient
	var stateIsConnecting = true
	var stateIsError
	var stateIsEnd
	var isSending
	var requests
	var connectTimer // is affected by public close()
	var endCbs

	connect()

	function connect() { // only invoked once per object
		connectTimer = setTimeout(connectTimeout, options.connectTimeout || connectTimeoutValue)
		smtpClient = simplesmtp.connect(options.port, options.host, options)
			.once('idle', emitReady)
			.on('error', clientErrorListener)

		function connectTimeout() {
			connectTimer = null
			abortConnect()
			clientErrorListener(new Error('Connect timeout for ' + options.host + ':' + options.port))
		}
	}

	function emitReady() {
		endConnect()
		self.emit('ready')
		smtpClient.on('idle', nextRequest)
	}

	function endConnect() { // cancel timer, remove idle listener
		if (stateIsConnecting) {
			if (connectTimer) {
				var c = connectTimer
				connectTimer = null
				clearTimeout(c)
			}
			smtpClient.removeListener('idle', emitReady)
			stateIsConnecting = false
		}
	}

	function abortConnect() { // ignore errors from ongoing authentication
		if (stateIsConnecting) endConnect()
		smtpClient.on('error', function () {})
		smtpClient.removeListener('error', clientErrorListener)
		closeClient()
	}

	function isConnecting() {
		return stateIsConnecting
	}

	function isReady() {
		return !stateIsConnecting && !stateIsError && !stateIsEnd
	}

	function getWritable(options, cb) {
		if (!stateIsEnd && !stateIsError) {
			if (!isSending && !stateIsConnecting) submitOne(options, cb)
			else {
				var request = {options: options, cb: cb}
				if (!requests) requests = [request]
				else requests.push(request)
			}
		} else cb(new Error('mail link expired'))
	}

	function submitOne(options, cb) {
		isSending = true
		cb(null, new mailoutmessage.Message(options, smtpClient)
			.once('complete', isComplete))
	}

	function isComplete() {
		isSending = false
		nextRequest()
	}

	function nextRequest() {
		if (requests && !isSending && !stateIsConnecting) {
			if (!stateIsEnd && !stateIsError) {
				var request = requests.shift()
				submitOne(request.options, requests.cb)
			} else {
				var err = new Error('mail link expired')
				var rs = requests
				requests = null
				rs.forEach(doCb)
			}
		}

		function doCb(cb) {
			cb(err)
		}
	}

	function clientErrorListener(err) {
		stateIsError = true
		if (stateIsConnecting) endConnect()
		self.emit('error', err)
		if (endCbs) doEndCbs(err)
	}

	/*
	close(cb(err))
	*/
	function close(cb) {
		if (smtpClient) {
			if (cb)
				if (!endCbs) endCbs = [cb]
				else endCbs.push(cb)
			if (stateIsConnecting) abortConnect()
			else closeClient()
		} else if (cb) cb()
	}

	function closeClient() {
		var emitter = smtpClient.socket || smtpClient
		if (smtpClient) {
			var s = smtpClient
			smtpClient = null
			s.close()
		}
		if (emitter) emitter.once('end', emitEnd)
		else emitEnd()
	}

	function emitEnd() {
		if (!stateIsError && !stateIsEnd) {
			stateIsEnd = true
			self.emit('end')
			doEndCbs()
		}
	}

	function doEndCbs(err) {
		if (endCbs) {
			var cbs =endCbs
			endCbs = null
			cbs.forEach(doCb)
		}

		function doCb(cb) {
			cb(err)
		}
	}
}
util.inherits(MailOut, events.EventEmitter)
