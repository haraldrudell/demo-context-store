// mxmessage.js
// Forward emails using simplesmtp
// © 2013 Harald Rudell <harald@therudells.com> All rights reserved.

var smtpwritestream = require('./smtpwritestream')
var dns = require('dns')

exports.MxMessage = MxMessage

/*
Forward email using simplesmtp
opts: option
.from: string mailbox sender
.to: string mailbox recipient

does not throw or emit
single rejected to-destinations are ignored, it will give error
callbacks and getResult indicate errors
*/
function MxMessage(opts) {
	var self = this
	this.write = write
	this.end = end
	this.destroy = destroy
	this.getResult = getResult
	this.onReady = onReady
	this.writable = true
	var pendingResultCb
	var pendingDiscard
	var pendingReadyCb
	var err
	var result
	var stream

	connect()

	function onReady(cb) {
		if (stream !== undefined || err) cb()
		else if (pendingReadyCb) pendingReadyCb.push(cb)
			else pendingReadyCb = [cb]
	}

	/*
	data: data
	cb(err): optional function
	*/
	function write() {
		var args = Array.prototype.slice.call(arguments)
		var cb = typeof args[args.length - 1] === 'function' ? args.pop() : null
		if (stream && stream.writable) stream.write.apply(stream, args.concat(writeResult))
		else writeResult()

		function writeResult(e) {
			if (e) {
				self.writable = false
				if (!err) err = e
			}
			if (cb) cb(err)
		}
	}

	/*
	data: optional data
	cb(err): optional function
	*/
	function end() {
		var args = Array.prototype.slice.call(arguments)
		var cb = typeof args[args.length - 1] === 'function' ? args.pop() : null
		self.writable = false
		if (stream && stream.writable && args.length) stream.write.apply(stream, args.concat(writeResult))
		else writeResult()

		function writeResult(e) {
			if (e && !err) err = e
			if (stream) stream.end(endResult)
			else endResult()
		}

		function endResult(e) {
			if (e && !err) err = e
			discardStream(cb)
		}
	}
	function destroy(cb) {
		self.writable = false
		if (stream) stream.destroy(destroyResult)
		else destroyResult()

		function destroyResult(e) {
			if (e && !err) err = e
			if (!result) {
				result = 'destroy' // is final state
				if (!err) doFinalCbs() // because we entered final state, execute cbs
			}
			discardStream(cb)
		}
	}
	function getResult(cb) {
		if (err || result) cb(err, result)
		else addFinalCb(cb)
	}

	function connect() {
		if (opts.forwardhost) mxResult(null, [{exchange: opts.forwardhost, priority: 0}])
		else {
			var domain = opts.to.split('@')[1]
			if (domain) dns.resolveMx(domain, mxResult)
			else err = new Error('bad opts.to: (' + opts.to + ') -> (' + domain + ')')
		}
	}

	function mxResult(e, addresses) {
		var host
		if (!e) {
			var priority
			addresses.forEach(function (o) {
				if (priority == null || o.priority < priority) {
					priority = o.priority
					host = o.exchange
				}
			})
			if (!host) e = new Error('No MX domain for: ' + opts.to)
		}
		if (!e) {
			stream = new smtpwritestream.SmtpWriteStream({
				from: opts.from,
				to: opts.to,
				port: 25,
				host: host,
			}).on('error', errorListener)
				.once('close', closeListener)
		} else if (!err) err = e
		if (pendingReadyCb) {
			var cbs = pendingReadyCb
			pendingReadyCb = null
			cbs.forEach(doCb)
		}
		function doCb(cb) {
			cb()
		}
	}

	function errorListener(e) {
		self.writable = false
		if (!err) err = e || new Error(arguments.callee.name)
		doFinalCbs()
	}
	function closeListener(outcome) {
		result = outcome || 'ok'
		doFinalCbs()
	}

	function discardStream(cb) {
		if (err || result) {
			discardNow()
			if (cb) cb(err, result) // state is final
		} else { // delay discard so that close may still fire
			if (cb) addFinalCb(cb)
			pendingDiscard = true
		}
	}
	function discardNow() {
		if (stream) {
			var s = stream
			stream = null
			s.removeListener('error', errorListener)
				.removeListener('close', closeListener)
		}
	}

	/*
	finalCbs comes from:
	- getResult that wants to wait for a final close event
	- discardStream that wants to allow for the final close event
	-- discardStream is initiated by end or destroy
	*/
	function addFinalCb(cb) {
		if (pendingResultCb) pendingResultCb.push(cb)
		else pendingResultCb = [cb]
	}
	/*
	state is now final, execute any pending actions
	*/
	function doFinalCbs() {
		if (pendingDiscard) {
			pendingDiscard = null
			discardNow()
		}
		if (pendingResultCb) {
			var cbs = pendingResultCb
			pendingResultCb = null
			cbs.forEach(callCb)
		}
	}
	function callCb(cb) {
		cb(err, result)
	}
}
