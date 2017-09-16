// stream-duplex.js
// Demonstrate a read-write stream
// © Harald Rudell 2013 <harald.rudell@therudells.com> All rights reserved.

/*
Duplex is a combination of Readable and Writable
If there is a one-to-one relationship between input and output, use Transform
*/

var stream = require('stream') // http://nodejs.org/api/stream.html
var util = require('util') // http://nodejs.org/api/util.html

var jsutil = require('../javascript/jsutil')
var haraldutil = require('haraldutil') // https://github.com/haraldrudell/haraldutil

var dataList = ['data1', 'data2']
var p = jsutil.p
var pEval = jsutil.pEval

jsutil.pFileHeader()

/*
1.      Duplex
  1.1   Duplex is used for a read-write stream where there is not a one-to-one relationship between read and write
  1.2   _read, _write must be implemented as well as push of eof
*/
p('Duplex', true)
p('Duplex is used for a read-write stream where there is not a one-to-one relationship between read and write')
p('_read, _write must be implemented as well as push of eof')

/*
ReadWriteStream implementation

writable: true until an error occurs or end or destroy is invoked
readable: true until end or error

events
'drain': all written items complete
'close': end was invoked, all writes completed, writable now false
'pause': the read stream is paused, for instrumentation purposes
'resume': the read stream is resumed, for instrumentation purposes
'data' item: a read stream data item
'end': final event: write stream ended and the read stream emitted all data, resources have been released
'error' err: a fatal error occured, resources have been released
the write stream side emits a final 'close' or one or more final 'error' events
the read stream side emits a final 'end' or one or more final 'error' events
*/
function AddPeriod() {
	var self = this
	stream.Duplex.call(this, {objectMode: true})
	this._write = _write
	this._read = _read
	this.once('finish', writeEof)

	// when input write stream gets data, push it to the output read stream
	function _write(data, encoding, cb) {
		self.push(data)
		cb()
	}

	function writeEof() {
		self.push(null)
	}

	function _read(n) {
	}
}
util.inherits(AddPeriod, stream.Duplex)

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

duplex pipe object:ArrayReadStream {
  _readableState: object:ReadableState {
    highWaterMark: 16384,
    buffer: 0[...],
    length: 0,
    pipes: object:AddPeriod {...},
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
  _read: function _read(n)
}
duplex readable
duplex data 'data1'
duplex data 'data2'
duplex finish
duplex unpipe object:ArrayReadStream {...}
duplex end
stream-duplex:210:printResult [ 'data1', 'data2' ]
*/
testDuplex()
function testDuplex() {
	var result = []
	var readStream = new ArrayReadStream(dataList)
	var addPeriod = new AddPeriod
	var unwrap = wrapEmit(addPeriod, 'duplex')
	var writeStream = new ArrayWriteStream(result)
		.once('finish', printResult)

	readStream.pipe(addPeriod).pipe(writeStream)

	function printResult() {
		require('haraldutil').p(result)
	}
}

/*
Duplex object

stream-duplex:271 object:Duplex {
  _readableState: object:ReadableState {
    highWaterMark: 16384,
    buffer: 0[(nonE)length: 0],
    length: 0,
    pipes: null,
    pipesCount: 0,
    flowing: false,
    ended: false,
    endEmitted: false,
    reading: false,
    calledRead: false,
    sync: true,
    needReadable: false,
    emittedReadable: false,
    readableListening: false,
    objectMode: false,
    defaultEncoding: 'utf8',
    ranOut: false,
    awaitDrain: 0,
    readingMore: false,
    decoder: null,
    encoding: null,
    -- prototype: ReadableState
  },
  readable: true,
  domain: null,
  _events: {
    end: function g() {
      listener: function onend()
    }
  },
  _maxListeners: 10,
  _writableState: object:WritableState {
    highWaterMark: 16384,
    objectMode: false,
    needDrain: false,
    ending: false,
    ended: false,
    finished: false,
    decodeStrings: true,
    defaultEncoding: 'utf8',
    length: 0,
    writing: false,
    sync: true,
    bufferProcessing: false,
    onwrite: function (er),
    writecb: null,
    writelen: 0,
    buffer: 0[(nonE)length: 0],
    -- prototype: WritableState
  },
  writable: true,
  allowHalfOpen: true,
  -- prototype: Duplex,
  write: function (chunk, encoding, cb),
  _write: function (chunk, encoding, cb),
  end: function (chunk, encoding, cb),
  -- prototype: Readable,
  push: function (chunk, encoding),
  unshift: function (chunk),
  setEncoding: function (enc),
  read: function (n),
  _read: function (n),
  pipe: function (dest, pipeOpts),
  unpipe: function (dest),
  on: function (ev, fn),
  addListener: recursive-object#20,
  resume: function (),
  pause: function (),
  wrap: function (stream),
  -- prototype: Stream,
  pipe: function (dest, options),
  -- prototype: EventEmitter,
  setMaxListeners: function (n),
  emit: function (type),
  addListener: function (type, listener),
  on: recursive-object#27,
  once: function (type, listener),
  removeListener: function (type, listener),
  removeAllListeners: function (type),
  listeners: function (type)
}
*/
//require('haraldutil').pp(new stream.Duplex)

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
