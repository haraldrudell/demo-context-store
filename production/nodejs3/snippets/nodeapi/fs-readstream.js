// fs-readstream.js
// Demonstrate fs.ReadStream
// © Harald Rudell 2012 <harald.rudell@therudells.com> All rights reserved.

/*
on 'readable' this.read() needs to be repeatedly invoked
the stream ends with 'end' or one or more 'error' events
*/

var fs = require('fs') // http://nodejs.org/api/fs.html

var jsutil = require('../javascript/jsutil')
var path = require('path') // http://nodejs.org/api/path.html
var haraldutil = require('haraldutil') // https://github.com/haraldrudell/haraldutil

var filename = path.join(__dirname, 'data', 'text.txt')
var p = jsutil.p
var pEval = jsutil.pEval

jsutil.pFileHeader()

/*
ReadStream constructor
http://nodejs.org/api/fs.html#fs_class_fs_readstream

*/
p('ReadStream(path, options)', true)
p('path: string absolute filename, stored at this.path')
p('options: optional object, default: {flags: \'r\', encoding: null, fd: null, mode: 0666, autoClose: true}')
p('- option {encoding: \'utf8\'} produces string data, default is Buffer')
p('this.read(size): return value: String, Buffer or null')
p('- size: optional integer, how much data to read')
p('this.read(0): returns null')

/*
ReadStream object

fs-readstream:29 object:ReadStream {
  _readableState: object:ReadableState {
    highWaterMark: 65536,
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
    end: function ()
  },
  _maxListeners: 10,
  path: '/home/foxyboy/Desktop/c505/node/nodejs3/snippets/nodeapi/data/text.txt',
  fd: null,
  flags: 'r',
  mode: 438,
  start: undefined,
  end: undefined,
  autoClose: true,
  pos: undefined,
  -- prototype: ReadStream,
  open: function (),
  _read: function (n),
  destroy: function (),
  close: function (cb),
  -- prototype: Readable,
  push: function (chunk, encoding),
  unshift: function (chunk),
  setEncoding: function (enc),
  read: function (n),
  _read: function (n),
  pipe: function (dest, pipeOpts),
  unpipe: function (dest),
  on: function (ev, fn),
  addListener: recursive-object#17,
  resume: function (),
  pause: function (),
  wrap: function (stream),
  -- prototype: Stream,
  pipe: function (dest, options),
  -- prototype: EventEmitter,
  setMaxListeners: function (n),
  emit: function (type),
  addListener: function (type, listener),
  on: recursive-object#24,
  once: function (type, listener),
  removeListener: function (type, listener),
  removeAllListeners: function (type),
  listeners: function (type)
}
*/
//require('haraldutil').pp(new fs.ReadStream(filename))

/*
ReadStream events

open 11
readable
-- invoke read()
end
close
*/
//readStreamEvents()
function readStreamEvents() {
	var readStream = new fs.ReadStream(filename, {encoding: 'utf8'})
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
ReadStream error behavior
- close the file descriptor on the open event and examine error events
close and end events are not emitted

readStream open 11
fs-readstream:156:closeResult Closed file descriptor: 11
readStream error object:Error {...}
fs-readstream:160:errorListener Error: { [Error: EBADF, read] errno: 9, code: 'EBADF' }
readStream error object:Error {...}
fs-readstream:160:errorListener Error: { [Error: EBADF, close] errno: 9, code: 'EBADF' }
*/
//readStreamErrors()
function readStreamErrors() {
	var readStream = new fs.ReadStream(filename, {encoding: 'utf8'})
		.once('open', closeFile)
		.on('error', errorListener)
	var unwrap = wrapEmit(readStream, 'readStream')

	function closeFile(fd) {
		fs.close(fd, closeResult)

		function closeResult(err) {
			if (err) throw err
			require('haraldutil').p('Closed file descriptor:', fd)
		}
	}
	function errorListener(err) {
		require('haraldutil').p('Error:', err)
	}
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
