// mxfiler.js
// save messages to the file system
// © 2013 Harald Rudell <harald@therudells.com> All rights reserved.

// https://github.com/haraldrudell/haraldutil
var haraldutil = require('haraldutil')
// http://nodejs.org/api/path.html
var path = require('path')
// http://nodejs.org/api/fs.html
var fs = require('fs')

exports.MxFiler = MxFiler

var writeOpts = {
	mode: 0660, // rw- rw- ---
}

/*
Write email to filesystem
opts: option
.timeval: optional timeval for file naming
.mtaNo: serial number ofr mta
.messageNo: serial number for message

does not throw error
callbacks and getResult indicate errors
*/
function MxFiler(opts) {
	var self = this
	this.write = write
	this.end = end
	this.destroy = destroy
	this.getResult = getResult
	this.onReady = onReady
	this.writable = false
	var filename = createFilename()
	var stream
	var err

	try {
		stream = fs.createWriteStream(filename, writeOpts)
			.on('error', errorListener)
		this.writable = true
	} catch (e) {
		err = e
	}

	function onReady(cb) {
		cb()
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
			discardStream(cb)
		}
	}

	function errorListener(e) {
		self.writable = false
		if (!err) err = e
	}

	function discardStream(cb) {
		if (stream) {
			stream.removeListener('error', errorListener)
			stream = null
		}
		if (cb) cb(err)
	}
	function getResult(cb) {
		cb(err, filename)
	}

	function createFilename() {
		return path.join(haraldutil.getTmpFolder(), [
			fileId, getTimeMarker(opts.timeval), process.pid, opts.mtaNo || 0, opts.messageNo,
		].join('_') + '.txt')
	}
	function getTimeMarker(timeval) {
		var marker = new Date(timeval).toISOString() // '2013-01-07T10:00:00.005Z'

		return [
			marker.substring(0, 4), marker.substring(5, 7), marker.substring(8, 10), '_',
			marker.substring(11, 13), marker.substring(14, 16), marker.substring(17, 19)
		].join('')
	}
}
