// filestream.js
// a file writestream not throwing exceptions
// © Harald Rudell 2013 <harald@therudells.com> All rights reserved.

// http://nodejs.org/api/util.html
var util = require('util')
// http://nodejs.org/api/stream.html
var stream = require('stream')
// http://nodejs.org/api/fs.html
var fs = require('fs')

exports.FileStream = FileStream

function FileStream(filename) {
	var self = this
	stream.Stream.call(this)
	this.writable
	this.write = write
	this.end = end
	this.destroy = destroy
	var theStream

	try {
		theStream = fs.createWriteStream(filename)
			.on('error', streamErrorListener)
			.on('drain', streamDrainListener)
		this.writable = true
	} catch (e) {
		self.emit(e)
	}

	/*
	write(s, encoding, cb)
	return value: false (data is not flushed yet)

	To avoid exceptions, ensure that theStream.write always gets a callback
	*/
	function write(s) {
		var result
		var args = Array.prototype.slice.call(arguments)
		var cb = typeof args[args.length - 1] === 'function' ? args[args.length - 1] : null
		if (self.writable && theStream.writable) {
			if (!cb) args.push(emptyCb)
			result = theStream.write.apply(theStream, args)
		} else {
			result = false
			internalDestroy(cb, [new Error('stream not writable'), s])
		}
		return result
	}
	/*
	end(s, encoding, cb)
	end does a possible write, then close
	if we do end, we don't have to do destroy
	*/
	function end() {
		var args = Array.prototype.slice.call(arguments)
		var cb = typeof args[args.length - 1] === 'function' ? args.pop() : null
		if (args.length && self.writable) theStream.end.apply(theStream, args.concat(afterEnd))
		else afterEnd()

		function afterEnd(err) {
			if (err) self.emit('error', err)
			discardStream(!err)
			if (cb) {
				var cbArgs = []
				if (err) cbArgs.push(err)
				cb.apply(this, cbArgs)
			}
		}
	}
	function destroy(cb) {
		internalDestroy(cb)
	}

	function internalDestroy(cb, args) {
		var isError = Array.isArray(args) && args[0] instanceof Error
		if (self.writable) theStream.destroy(afterDestroy)
		else afterDestroy()

		function afterDestroy(err) {
			if (err) self.emit('error', err)
			if (self.writable) discardStream(!isError && !err)
			if (isError) self.emit.apply(self, ['error'].concat(args))
			if (cb) {
				var cbArgs = []
				if (isError) cbArgs.push(args[0])
				else if (err) cbArgs.push(err)
				cb.apply(this, cbArgs)
			}
		}
	}
	function discardStream(emitClose) {
		self.writable = false
		theStream.removeListener('drain', streamDrainListener)
		theStream.removeListener('error', streamErrorListener)
		theStream = null
		if (emitClose) self.emit('close')
	}
	function emptyCb() {}
	function streamErrorListener() {
		var args = Array.prototype.slice.call(arguments)
		if (!(args[0] instanceof Error)) args.unshift(new Error('stream error'))
		internalDestroy(null, args)
	}
	function streamDrainListener() {
		self.emit.apply(self, ['drain'].concat(Array.prototype.slice.call(arguments)))
	}
}
util.inherits(FileStream, stream.Stream)
