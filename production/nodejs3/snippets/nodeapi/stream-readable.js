// stream-readable.js
// Demonstrate a class extending Readable
// © Harald Rudell 2012 <harald.rudell@therudells.com> All rights reserved.

/*
Readable
1. emits 'readable'
2. invoke this.read() until null return value
3. emits 'end'

events
end: the stream ends with the end event or one or more error events
error err
pipe
unpipe
data only in legacy flow mode.
close and finish are emitted by some stream types

is Error? there is no indicator of wether the stream emitted 'error'

is EOF?
this._readableState.ended indicates that an EOF chunk was detected.
this._readableState.endEmitted indicates that the end event did fire, ie. there will be no more data emitted.

modes
Readable goes into pull mode when a listener is added to the 'readable' event
Pull mode is indicated by this._readableState.readableListening
Legacy mode is indicated by this._readableState.flowing

There is no longer a destroy() function. How is the stream closed before EOF?
fs.ReadStream implements a destroy() that closes the stream and emits 'close'
fs.WriteStream uses the same function.

http://nodejs.org/api/stream.html#stream_class_stream_readable
*/

var stream = require('stream') // http://nodejs.org/api/stream.html
var util = require('util') // http://nodejs.org/api/util.html

var jsutil = require('../javascript/jsutil')

var dataList = ['data1', 'data2']
var p = jsutil.p
var pEval = jsutil.pEval

jsutil.pFileHeader()

/*
1.      stream.Readable(options) constructor
  1.1   options: optional object
  1.2   .objectMode: optional bollean, default false: stream is of objects, not bytes or characters
  1.3   .defaultEncoding: optional string, default 'utf8'
  1.4   .encoding: optional string, default none: data encoding
*/
p('stream.Readable(options) constructor', true)
p('options: optional object')
p('.objectMode: optional bollean, default false: stream is of objects, not bytes or characters')
p('.highWaterMark: optional integer, default 16 Ki')
p('.defaultEncoding: optional string, default \'utf8\'')
p('.encoding: optional string, default none: data encoding')

/*
2.      Readable extends Stream EventEmitter
  2.1   .domain
  2.2   read(size): size: optional number, default all: amount of data to read. return value: String/Buffer/null
  2.3   push(chunk, encoding): add chunk to buffer, encoding: optional string. return value: boolean true if buffer space is available
  2.4   - in objectMode objects must be pushed one at a atime
  2.5   - push(null) means end of file
  2.6   unshift(chunk)
  2.7   setEncoding(encoding)
  2.8   pipe(dest, pipeOpts)
  2.9   unpipe(dest)
  2.10  wrap: function (stream)
  2.11  Legacy: resume() pause() readable: boolean
*/
p('Readable extends Stream EventEmitter', true)
p('.domain')
p('read(size): size: optional number, default all: amount of data to read. return value: String/Buffer/null')
p('push(chunk, encoding): add chunk to buffer, encoding: optional string. return value: boolean true if buffer space is available')
p('- in objectMode objects must be pushed one at a atime')
p('- push(null) means end of file')
p('unshift(chunk)')
p('setEncoding(encoding)')
p('pipe(dest, pipeOpts)')
p('unpipe(dest)')
p('wrap: function (stream)')
p('Legacy: resume() pause() readable: boolean')

function ArrayReadStream(array) {
	stream.Readable.call(this, {objectMode: true})
	this._read = _read

	/*
	_read(size)
	size: integer is the size of the buffer the readable stream has configured
	this: the readable stream object
	_read does not have a return value.

	_read is invoked by the parent to have the child invoke this.push(chunk, encoding)
	this.push(null) means EOF

	If _read is not implemented, an exception is thrown:
	Error: not implemented
	    at ArrayReadStream.Readable._read (_stream_readable.js:446:22)
	    at ArrayReadStream.Readable.read (_stream_readable.js:320:10)
	    at ArrayReadStream.Readable.on (_stream_readable.js:691:14)
	    at ArrayReadStream.EventEmitter.once (events.js:179:8)
	    at readAStream (/home/foxyboy/Desktop/c505/node/nodejs3/snippets/nodeapi/stream-readable.js:69:4)
	*/
	function _read(n) {
		if (Array.isArray(array)) array.forEach(this.push.bind(this))
		this.push(array = null)
	}
}
util.inherits(ArrayReadStream, stream.Readable)

/*
If all data is pushed at once, an extra readable is emitted
readStream readable
stream-readable:110:invokeRead 'data1'
stream-readable:110:invokeRead 'data2'
readStream readable
readStream end
function ArrayReadStream(array) {
	stream.Readable.call(this, {objectMode: true})
	if (Array.isArray(array)) array.forEach(this.push.bind(this))
	this.push(null)
}
*/

/*
Events

readStream readable
stream-readable:131:invokeRead 'data1'
stream-readable:131:invokeRead 'data2'
readStream end
*/
//readAStream()
function readAStream() {
	var readStream = new ArrayReadStream(dataList)
		.once('readable', invokeRead)
	var unwrap = wrapEmit(readStream, 'readStream')

	function invokeRead() {
		var data

		while (data = readStream.read()) {
			require('haraldutil').pp(data)
		}
	}
}

/*
Readable object

stream-readable:113 object:Readable {
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
  _events: {},
  _maxListeners: 10,
  -- prototype: Readable,
  push: function (chunk, encoding),
  unshift: function (chunk),
  setEncoding: function (enc),
  read: function (n),
  _read: function (n),
  pipe: function (dest, pipeOpts),
  unpipe: function (dest),
  on: function (ev, fn),
  addListener: recursive-object#12,
  resume: function (),
  pause: function (),
  wrap: function (stream),
  -- prototype: Stream,
  pipe: function (dest, options),
  -- prototype: EventEmitter,
  setMaxListeners: function (n),
  emit: function (type),
  addListener: function (type, listener),
  on: recursive-object#19,
  once: function (type, listener),
  removeListener: function (type, listener),
  removeAllListeners: function (type),
  listeners: function (type)
}
*/
//require('haraldutil').pp(new stream.Readable)

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
