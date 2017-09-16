// stream-transform.js
// Demonstrate transform
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
1.      Transform
  1.1   Transform is used when every read corressponds to a write
  1.2   The _tranform function must be implemented.
*/
p('Transform', true)
p('Transform is used when every read corressponds to a write')
p('The _tranform function must be implemented.')

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
	stream.Transform.call(this, {objectMode: true})
	this._transform = _transform

	function _transform(data, encoding, cb) {
		cb(null, data + '.')
	}
}
util.inherits(AddPeriod, stream.Transform)

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

transform pipe object:ArrayReadStream {
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
transform readable
transform data 'data1.'
transform data 'data2.'
transform finish
transform unpipe object:ArrayReadStream {...}
transform end
stream-transform:199:printResult [ 'data1.', 'data2.' ]
*/
//testTransform()
function testTransform() {
	var result = []
	var readStream = new ArrayReadStream(dataList)
	var addPeriod = new AddPeriod
	var unwrap = wrapEmit(addPeriod, 'transform')
	var writeStream = new ArrayWriteStream(result)
		.once('finish', printResult)

	readStream.pipe(addPeriod).pipe(writeStream)

	function printResult() {
		require('haraldutil').p(result)
	}
}

/*
Transform object

stream-transform:293 object:Transform {
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
    sync: false,
    needReadable: true,
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
    },
    finish: function g() {
      listener: function ()
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
  _transformState: object:TransformState {
    afterTransform: function (er, data),
    needTransform: false,
    transforming: false,
    writecb: null,
    writechunk: null,
    -- prototype: TransformState
  },
  -- prototype: Transform,
  push: function (chunk, encoding),
  _transform: function (chunk, encoding, cb),
  _write: function (chunk, encoding, cb),
  _read: function (n),
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
  addListener: recursive-object#28,
  resume: function (),
  pause: function (),
  wrap: function (stream),
  -- prototype: Stream,
  pipe: function (dest, options),
  -- prototype: EventEmitter,
  setMaxListeners: function (n),
  emit: function (type),
  addListener: function (type, listener),
  on: recursive-object#35,
  once: function (type, listener),
  removeListener: function (type, listener),
  removeAllListeners: function (type),
  listeners: function (type)
}
*/
//require('haraldutil').pp(new stream.Transform)

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
