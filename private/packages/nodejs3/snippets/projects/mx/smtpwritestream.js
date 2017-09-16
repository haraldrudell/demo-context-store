// smtpwritestream.js
// Stream emails to a
// © 2013 Harald Rudell <harald@therudells.com> All rights reserved.

var unlisten = require('./unlisten')
// https://github.com/andris9/simplesmtp
var simplesmtp = require('simplesmtp')
// http://nodejs.org/api/stream.html
var stream = require('stream')
// http://nodejs.org/api/util.html
var util = require('util')

exports.SmtpWriteStream = SmtpWriteStream

/*
Stream email to smtp server
opts: object
.from: string: mailbox sender
.to: non-empty string or array of those: mailbox destinations
.log: optional function: log function, util.format capable

events:
'rejected' string: this mailbox from to array was rejected, one or more events
'drain': all preceding writes complete
'error' err:one or ode error
'close': final event if no errors

1. this.writable goes true if opts are ok and connect does not throw exception
2. this.writable is true until end, destroy, error, or message complete
3. connectionWritable goes true when connection is established, ie. client.write can be invoked
4. connectionWritable goes false on error
4. client goes null on destroy, concluding end instruction or mailserver quit
*/
function SmtpWriteStream(opts) {
	var self = this
	stream.Stream.call(this)
	this.writable // flasg if write operations form the public allowed
	this.write = write
	this.end = end
	this.destroy = destroy
	var log = opts.log || console.log
	var client // evaluates to true: client is or will be writable
	var unListen
	var connectionWritable
	var bufferUntilConnection = [] // .0: data, .1: cb(err)
	var emitDrain
	var result
	var finalEventDidFire
	var err

	connect()

	/*
	data: string or Buffer
	cb(err): optional function
	return value: true if nothing buffered
	*/
	function write() {
		var result = false
		var args = Array.prototype.slice.call(arguments)
		var cb = typeof args[args.length - 1] === 'function' ? args.pop() : null
		emitDrain = true
		if (self.writable) {
			var data = args[0]
			if (!connectionWritable || // connection not established yet
				bufferUntilConnection.length) // still buffering
				bufferUntilConnection.push([client.write, data, cb])
			else {
				result = client.write(data) // simplesmtp does not support callback
				self.emit('drain')
				if (cb) cb()
			}
		} else {
			var err = new Error('smtp stream not writable')
			if (cb) cb(err)
			else throw err
		}

		return result
	}
	/*
	data: optional string or Buffer
	cb(err): optional function
	no return value
	*/
	function end() {
		var args = Array.prototype.slice.call(arguments)
		var cb = typeof args[args.length - 1] === 'function' ? args.pop() : null
		if (args.length) write(args[0]) // simplesmtp does not support callback
		if (self.writable) {
			self.writable = false
			if (!connectionWritable || // connection not established yet
				bufferUntilConnection.length)
				bufferUntilConnection.push([client.end, cb])
			else {
				client.end()
				if (cb) cb(err)
			}
		} else if (cb) cb(err)
	}
	/*
	cb(err): optional function
	no return value
	*/
	function destroy(cb) {
		shutdown(cb)
	}
	/*
	Verify options and open the socket
	*/
	function connect() {
		var e = verifyOpts()

		if (!e) try {
			/*
			simplesmtp.connect(port, host, options)
			port: optional number, default 25
			host: string hostname, default "localhost"
			options: object: secureConnection, name, auth, ignoreTLS, debug, instanceId

			return value: SMTPClient extends Stream
			.useEnvelope({from: string, to: [string]}): no result, no callback
			.end(Buffer): no result, no callback
			.quit(): sends QUITthen does close(). no result, no callback
			.close(): closes the socket. no result, no callback
			.write(buffer): return value: socket.write. no callback

			events
			'idle': connection is ready for sendEnvelope
			'rcptFailed' []: recipients in the array of mailbox strings were not accepted by the receiving mail server
			'message': ready to receive message
			'ready' ok response: message sending concluded, ok: boolean if went well, response: string response
			'end': the connection was closed
			'error' Error eg: RecipientError 'Can't send mail - all recipients were rejected'. the connection will close
			rejected recipients results in error being emitted
			*/
			client = simplesmtp.connect(opts.port, opts.host, opts.connectOptions) // connect(port, host, options)
			unListen = new unlisten.UnListen(client)
				.once('idle', sendEnvelope)
				.once('rcptFailed', rcptListener)
				.once('message', sendMessage)
				.once('ready', messageSent)
				.on('error', clientErrorListener)
				.on('end', endListener)
			self.writable = true
		} catch (er) {
			e = er
		}
		if (e) {
			if (!err) err = e
			process.nextTick(getErrorEmitter(e))
		}
	}

	function sendEnvelope() { // provide from and to addresses
		if (client) { // we are or will be client writable
			var envelope = {from: opts.from}
			envelope.to = Array.isArray(opts.to) ? opts.to : [opts.to]
			 client.useEnvelope(envelope) // envelope does not honor sender or other header fields
		}
	}
	function rcptListener(array) { // some but not all recipients rejected
		if (!finalEventDidFire) array.forEach(emitRejected)
	}
	function emitRejected(mailbox) {
		self.emit('rejected', mailbox)
	}
	function sendMessage() { // send message headers, subject and body
		if (client && connectionWritable === undefined) {
			connectionWritable = true
			while (client && bufferUntilConnection.length) {
				var args = bufferUntilConnection.shift()
				var cb = typeof args[args.length - 1] === 'function' ? args.pop() : null
				var fn = typeof args[0] === 'function' ? args.shift() : null
				if (fn) fn.apply(client, args) // simplesmtp does not support cb
				if (cb) cb(err)
			}
			if (self.writable && emitDrain) self.emit('drain')
		}
	}
	function messageSent(ok, response) { // complete: shutdown
		self.writable = false
		result = response
		if (!ok) emitFinal(new Error(arguments.callee.name + ': failed: ' + response))
		client.quit() // only sending one message, so close the connection
	}
	/*
	err: example: SenderError
	. data: '421 4.4.2 c505 Error: timeout exceeded'
	.name 'SenderError'
	*/
	function clientErrorListener(e) { // error: abort, there will be end event
		emitFinal(e instanceof Error ? e : new Error(e))
	}
	function endListener() { // the connection is closed: shutdown the client
		shutdown()
	}

	function shutdown(cb) {
		self.writable = false
		if (client) {
			var c = client
			client = null
			c.close() // no argument, callback or result
		}
		if (unListen) {
			var u = unListen
			unListen = null
			u.unListen()
		}
		bufferUntilConnection = null
		emitFinal()
		if (cb) cb(err)
	}
	function emitFinal(e) {
		self.writable = false
		connectionWritable = false
		if (!e) {
			if (!finalEventDidFire) self.emit('close', result)
		} else {
			if (!err) err = e
			self.emit('error', e)
		}
		finalEventDidFire = true
	}

	function logEvents(client) {
		var em = client.emit
		client.emit = function (e, d) {
			var args = Array.prototype.slice.call(arguments)
			log('event:', args)
			em.apply(client, args)
		}
	}

	function getErrorEmitter(e) {
		return emitError

		function emitError() {
			self.emit('error', e)
		}
	}

	function verifyOpts() {
		var result

		if (!opts) result = new Error('opts argument missing')
		else if (typeof opts.from !== 'string' || !opts.from) result = new Error('opts.from must be non-empty string')
		else if ((typeof opts.from !== 'string' || !opts.from) && // if it is not a nonempty string
			(!Array.isArray(opts.to) || !opts.to.length || !opts.to.every(verfyString))) result = new Error('opts.to must be non-empty string or non-empty Array of those')

		return result
	}

	function verifyString(v) {
		return typeof v === 'string'
	}
}
util.inherits(SmtpWriteStream, stream.Stream)
