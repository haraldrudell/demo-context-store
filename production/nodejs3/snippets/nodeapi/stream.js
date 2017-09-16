// stream.js
// Node.js stream pattern explained
// © Harald Rudell 2012 <harald.rudell@therudells.com> All rights reserved.

/*
Stream subclasses in node library:
net.Stream
fs.ReadStream
fs.WriteStream
fs.SyncWriteStream (internal)
http.IncomingMessage
http.OutgoingMessage
net.Socket
repl.ArrayStream
tls.CryptoStream
tty based on net.Socket
zlib.Zlib
_debugger.Client
*/

var jsutil = require('../javascript/jsutil')
var stream = require('stream') // http://nodejs.org/api/stream.html
var fs = require('fs') // http://nodejs.org/api/fs.html
var path = require('path') // http://nodejs.org/api/path.html
var haraldutil = require('haraldutil') // https://github.com/haraldrudell/haraldutil

var p = jsutil.p
var pEval = jsutil.pEval

jsutil.pFileHeader()

/*
1.      require('stream') is how to use Node.js' streams
  1.1   Streams were redesigned in Node.js 0.10
  1.2   Stream exports: Object.keys(require('stream'))
        ['super_', 'Readable', 'Writable', 'Duplex', 'Transform', 'PassThrough', 'Stream']
  1.3   stream usage in Node.js library: fs net http crypto repl tls
  1.4   Readable: fs.ReadStream http.IncomingMessage
  1.5   Writable: fs.WriteStream crypto.Sign, crypto.Verify
  1.6   Duplex net.Socket tls.CryptoStream
  1.7   Transform: crypto.LazyTransform crypto.Hash crypto.Hmac crypto.Cipher crypto.Cipheriv crypto.Decipher crupto.Decipheriv zlib.Zlib
*/
p('require(\'stream\') is how to use Node.js\' streams', true)
p('Streams were redesigned in Node.js 0.10')
pEval('Stream exports', 'Object.keys(require(\'stream\'))')
p('stream usage in Node.js library: fs net http crypto repl tls')
p('Readable: fs.ReadStream http.IncomingMessage')
p('Writable: fs.WriteStream crypto.Sign, crypto.Verify')
p('Duplex net.Socket tls.CryptoStream')
p('Transform: crypto.LazyTransform crypto.Hash crypto.Hmac crypto.Cipher crypto.Cipheriv crypto.Decipher crupto.Decipheriv zlib.Zlib')

/*
2.      stream.Stream is a base class simply inheriting events.EventEmitter
*/
p('stream.Stream is a base class providing pipe and events.EventEmitter', true)

/*
nodeapi-stream:93 object:Stream {
  domain: null,
  _events: {},
  _maxListeners: 10,
  -- prototype: Stream,
  pipe: function (dest, options),
  -- prototype: EventEmitter,
  setMaxListeners: function (n),
  emit: function (type),
  addListener: function (type, listener),
  on: recursive-object#6,
  once: function (type, listener),
  removeListener: function (type, listener),
  removeAllListeners: function (type),
  listeners: function (type)
}
*/
//require('haraldutil').pp(new stream.Stream)

/*
stream.Readable

Readable Stream
Event: 'data': emitted for each data
Event: 'end': emitted after the last data
Event: 'error': emitted on fatal error as the last event
Event: 'close': not all streams emit close
stream.readable: boolean. initally true, set to false on error or end
stream.setEncoding([encoding])
stream.pause()
stream.resume()
stream.destroy()
stream.pipe(destination, [options])

if consuming code wants to abort the readstream flow, it should invoke destroy

Writable Stream
Event: 'drain'
Event: 'error': emitted on fatal error as last event
Event: 'close'
Event: 'pipe' ?
stream.writable: boolean, initially true, set to false on error or end
stream.write(string, [encoding])
stream.write(buffer)
stream.end()
stream.end(string, encoding)
stream.end(buffer)
stream.destroy()
stream.destroySoon()

the writable stream, can be aborted by invoking destroy. subsequent write or end invocations then throw exception.
destroySoon allows for end invocation but not write.
*/
p('stream.Readable...', true)

/*
nodeapi-stream:93 object:Readable {
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
require('haraldutil').pp(new stream.Readable)

console.log(haraldutil.getLoc())

var print = true
var doRead = false
doWrite = false

/*
A generic Stream instance:

nodeapi-stream.js:66 The Stream object: object:Stream {
	-- prototype:Stream,
	pipe:function (dest, options),
	-- prototype:EventEmitter,
	removeListener:function (type, listener),
	addListener:function (type, listener),
	listeners:function (type),
	emit:function (),
	on:recursive-object#4,
	once:function (type, listener),
	setMaxListeners:function (n),
	removeAllListeners:function (type)
}
*/
/*
options.end: false: dest.end or dest.destroy are not invoked ie. can continue writing after source end.
*/
function pipe(dest, options) {
	var source = this;

	function ondata(chunk) {
		if (dest.writable) {
			if (false === dest.write(chunk) && source.pause) {
				source.pause();
			}
		}
	}
	source.on('data', ondata);

	function ondrain() {
		if (source.readable && source.resume) {
			source.resume();
		}
	}
	dest.on('drain', ondrain);

	// If the 'end' option is not supplied, dest.end() will be called when
	// source gets the 'end' or 'close' events.  Only dest.end() once.
	if (!dest._isStdio && (!options || options.end !== false)) {
		source.on('end', onend);
		source.on('close', onclose);
	}
	var didOnEnd = false;
	function onend() {
		if (didOnEnd) return;
		didOnEnd = true;
		dest.end();
	}
	function onclose() {
		if (didOnEnd) return;
		didOnEnd = true;
		dest.destroy();
	}

	// don't leave dangling pipes when there are errors.
	function onerror(er) {
		cleanup();
		if (this.listeners('error').length === 0) {
			throw er; // Unhandled stream error in pipe.
		}
	}
	source.on('error', onerror);
	dest.on('error', onerror);
	// remove all the event listeners that were added.
	function cleanup() {
		source.removeListener('data', ondata);
		dest.removeListener('drain', ondrain);
		source.removeListener('end', onend);
		source.removeListener('close', onclose);
		source.removeListener('error', onerror);
		dest.removeListener('error', onerror);
		source.removeListener('end', cleanup);
		source.removeListener('close', cleanup);
		dest.removeListener('end', cleanup);
		dest.removeListener('close', cleanup);
	}
	source.on('end', cleanup);
	source.on('close', cleanup);
	dest.on('end', cleanup);
	dest.on('close', cleanup);

	dest.emit('pipe', source);

	// Allow for unix-like usage: A.pipe(B).pipe(C)
	return dest;
}
var streamInstance = new stream.Stream
if (print) {
	console.log(haraldutil.getLoc(), 'The Stream object:', haraldutil.inspectAll(streamInstance))
	console.log(haraldutil.getLoc(), streamInstance.pipe)
}

/*
A file read stream
A read stream will always output data
A pause is not immediately effective
once it reaches end, it will close automatically

properties:
readable: boolean: true until error or end
paused: boolean: false, controlled by pause-resume

functions:
pause(): no return value
resume(): no return value
destroy(cb(err)): no return value. if open, will close.

events:
'open' fd: fd is the file descriptor, a small number
'data' data
'end'
'close'
'error'
*/

/*
a file write stream
unless you write to the stream, it will remain open and idle
once a write completes, drain events will be emitted

properties:
writable: boolean: true until error or end
drainable: boolean: initial undefined, indicates that data was written
busy: indicates that an operation open, write, close is in progress

functions:
flush()
end(data, encoding, cb(err))
write(data, cb(err, bytesWritten)): boolean, always return false
destroySoon() == end
destroy(cb(err))

events:
'open' fd: fd is the file descriptor, a small number
'drain' emitted when no more open, write, close operations are queued
'close'
'error'

write requires this reference to be the stream object
- can have cb
- is not synchronous
_queue is an array of pending commands, func and arguments

write.end does close, and can have a callback
*/

var file = path.join(__dirname, 'data', 'text.txt')
/*
createReadStream instantiates a new object
inherits from Stream
properties
.path string, .fd null, .readable true, .paused false, .flags 'r', .mode number, .bufferSize number
.start, .end: number
.pos
all option properties are added as properties

on construction, sets .fd to open() and emits 'open' and does _read()
it does close on 'end'
*/
if (doRead) {
	var inp = fs.createReadStream(file, {encoding:'utf-8'})
		.once('open', function () {
			console.log('open')
		})

	if (print) console.log('Initial paused', inp.paused)

	logAllEvents(inp)

	// is not effective
	//debugger
	//inp.pause()

	if (print) console.log('Properties of a file read stream object:', haraldutil.inspectDeep(inp))
}

if (doWrite) {
	var out = fs.createWriteStream('/dev/null', {encoding:'utf-8'})
		.once('drain', doClose)

	logAllEvents(out)
/*
Properties of a file write stream object: {
	path:'/dev/null',
	fd:null,
	bytesWritten:0,
	encoding:'binary',
	emit:function emitWrapper(event),
	busy:true,
	writable:true,
	_open:function (path, flags, mode, callback),
	mode:438,
	flags:'w',
	_queue:0:[(nonE)length:0],
	-- prototype,
	flush:function (),
	end:function (data, encoding, cb),
	write:function (data),
	destroySoon:recursive-object#6,
	destroy:function (cb),
	-- prototype:Stream,
	pipe:function (dest, options),
	-- prototype:EventEmitter,
	emit:function (),
	removeListener:function (type, listener),
	addListener:function (type, listener),
	listeners:function (type),
	on:recursive-object#12,
	once:function (type, listener),
	setMaxListeners:function (n),
	removeAllListeners:function (type)
}
*/
	if (print) console.log('Properties of a file write stream object:', haraldutil.inspectDeep(out))

	//out.write()
}

function doClose() {
	this.end(closeDone)
}

function closeDone(err) {
	console.log('Close complete:', err ? err.toString() : 'ok')
}

// You can listen to all events by overriding the emit function
function logAllEvents(emitter) {
	var _emit = emitter.emit
	emitter.emit = function emitWrapper(event) {
		var args = Array.prototype.slice.call(arguments)
		console.log(arguments.callee.name, haraldutil.inspectDeep(args))
		_emit.apply(emitter, args)
	}
}

/*
fron node api documentation:
streams can be read streams, write streams, or both

read stream
A read stream starts providing data after .resume() has been invoked
'data': A readstream emits data when it becomes available
'end': A read stream emits end when there are no more data events
'error': if no listener throws
'close':
.readable: true goes false on error, end or destroy
.resume(): may have this function
.pause(): may have this function
.destroy()
.setEncoding(): default Buffer, argument 'utf-8'

write stream
'drain': A write stream emits drain when it can accept more data
'error': if no listener throws
'close': when resources have been freed
'pipe': better issue a drain event
.writable: true goes false on error, end or destroy
.write(data): synchronous write, return value true: buffer was flushed, false: buffer full, write is future
.end(): indicate that all data has been sent
.destroy(): close function
.destroySoon()
*/
