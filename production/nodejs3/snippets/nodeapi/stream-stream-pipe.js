// stream-stream-pipe.js
// Demonstrate piping from a Readable to a Writable
// © Harald Rudell 2012 <harald.rudell@therudells.com> All rights reserved.

var stream = require('stream') // http://nodejs.org/api/stream.html
var util = require('util') // http://nodejs.org/api/util.html

var jsutil = require('../javascript/jsutil')
var haraldutil = require('haraldutil') // https://github.com/haraldrudell/haraldutil

var dataList = ['data1', 'data2']
var p = jsutil.p
var pEval = jsutil.pEval

jsutil.pFileHeader()

// from stream-readable.js
function ArrayReadStream(array) {
	stream.Readable.call(this, {objectMode: true})
	this._read = _read

	function _read(n) {
		if (Array.isArray(array)) array.forEach(this.push.bind(this))
		this.push(array = null)
	}
}
util.inherits(ArrayReadStream, stream.Readable)

// from stream-writable.js
function ArrayWriteStream(array) {
	stream.Writable.call(this, {objectMode: true})
	this._write = _write

	function _write(data, encoding, cb) {
		array.push(data)
		cb()
	}
}
util.inherits(ArrayWriteStream, stream.Writable)

/*
Events

write pipe object:ArrayReadStream {
  _readableState: object:ReadableState {
    highWaterMark: 16384,
    buffer: 0[...],
    length: 0,
    pipes: object:ArrayWriteStream {...},
    pipesCount: 1,
    flowing: false,
    ended: false,
    endEmitted: false,
    reading: false,
    calledRead: false,
    sync: true,
    needReadable: false,
    emittedReadable: false,
    readableListening: false,
    objectMode: true,
    defaultEncoding: 'utf8',
    ranOut: false,
    awaitDrain: 0,
    readingMore: false,
    decoder: null,
    encoding: null
  },
  readable: true,
  domain: null,
  _events: {
    end: function g()...
  },
  _maxListeners: 10,
  _read: function _read(n),
  emit: function emitLogger()
}
read readable
read data 'data1'
read data 'data2'
read end
write finish
write unpipe object:ArrayReadStream {...}
*/
testPipe()
function testPipe() {
	var result = []
	var readStream = new ArrayReadStream(dataList)
	var unwrap1 = wrapEmit(readStream, 'read')
	var writeStream = new ArrayWriteStream(result)
	var unwrap2 = wrapEmit(writeStream, 'write')

	readStream.pipe(writeStream)
}

// logger of all emitted events
var inspectObj = {maxString: 20, maxProperties: 0, maxLevels: 0, nonEnum: true}
function wrapEmit(emitter, slogan) {
	var wrappedEmit = emitter.emit
	emitter.emit = emitLogger
	if (!slogan) slogan = 'Event:'
	return unwrap

	function emitLogger() {
		var args = Array.prototype.slice.call(arguments)

		var prints = [slogan, args[0]]
		for (var index in args)
			if (index > 0) prints.push(haraldutil.inspect(args[index], inspectObj))
		console.log.apply(this, prints)

		wrappedEmit.apply(this, args)
	}

	function unwrap() {
		emitter.emit = wrappedEmit
	}
}
