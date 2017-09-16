// stream-writable.js
// Demonstrate a class extending Readable
// © Harald Rudell 2013 <harald.rudell@therudells.com> All rights reserved.

/*
Writable
1. invoke write()
2. invoke end()
3. emits 'finish'

Events
drain: emitted when the last pending write finishes before end is invoked
prefinish: end received while pending writes in progress, noit always emitted
finish: end received, all writes complete
pipe Readable
unpipe Readable
error Error

is Error? There is not indicator that error has been emitted

is EOF?
this._writableState.ending indicates that this.end() was invoked
this._writableState.prefinished indicates that the 'prefinish' event fired, it is only emitted if pending writes exist on end invocation
this._writableState.finished indicates that the 'finish' event fired and all work is complete

There is no longer a destroy function.
fs.WriteStream implements a destroy() that closes the stream and emits 'close'
*/
var stream = require('stream') // http://nodejs.org/api/stream.html
var util = require('util') // http://nodejs.org/api/util.html

var jsutil = require('../javascript/jsutil')
var path = require('path') // http://nodejs.org/api/path.html
var fs = require('fs') // http://nodejs.org/api/fs.html
var haraldutil = require('haraldutil') // https://github.com/haraldrudell/haraldutil

var filename = path.join(__dirname, 'data', 'text.txt')
var p = jsutil.p
var pEval = jsutil.pEval

jsutil.pFileHeader()

/*
WriteStream implementation

writable: true until an error occurs or end or destroy is invoked

events
'drain': all written items complete
'close': final event: the stream reached end, resources have been released
'error' err: a fatal error occured, resources have been released
a stream will emit a final 'close' or one or more final 'error' events
*/
function ArrayWriteStream(array) {
	var self = this
	stream.Writable.call(this, {objectMode: true})
	this._write = _write

	/*
	Internal write
	data: String/Buffer/Object
	encoding: string eg. 'utf8'
	cb(err): function

	return value:

	If _write is not implemented, an exception is thrown on the first write:
	Error: not implemented
	    at ArrayWriteStream.Writable._write (_stream_writable.js:317:6)
	    at doWrite (_stream_writable.js:219:10)
	    at writeOrBuffer (_stream_writable.js:209:5)
	    at ArrayWriteStream.Writable.write (_stream_writable.js:180:11)
	    at testArrayWriteStream (/home/foxyboy/Desktop/c505/node/nodejs3/snippets/nodeapi/stream-writable.js:122:11)
	    at Object.<anonymous> (/home/foxyboy/Desktop/c505/node/nodejs3/snippets/nodeapi/stream-writable.js:116:1)
	    at Module._compile (module.js:456:26)
	    at Object.Module._extensions..js (module.js:474:10)
	    at Module.load (module.js:356:32)
	    at Function.Module._load (module.js:312:12)
	*/
	function _write(data, encoding, cb) {
		array.push(data)
		cb()
	}
}
util.inherits(ArrayWriteStream, stream.Writable)

/*
How to discard buffered contents, like previous destroy()?
There is no such option.

First invoke end(). Then try to discard the buffer somehow. we can't do that because it means ignored callbacks.
a. It is not safe to tamper buffer
a. _write could be replaced, drawback: modified the object
b. .finished could be set to true, draback: finished event may not be emitted
c. .length could be set to zero

An invocation to this.write() _stream_writable.js:169
1. if .ended, ie. end() was invoked, writeAfterEnd() throws exception 187
2. .pendingcb is incremented 189
3. writeOrBuffer(): if .writing or .corked does .buffer.push otherwise doWrite() 229
4. doWrite() invokes _write() 248
5. _write() has onwrite(stream, er) as callback 256
6. onwrite() invokes clearBuffer() if not .finished, .corked and buffer not empty 281
7. onwriteStateUpdate() resets the .write flag 286
8. onwrite() invokes afterWrite(), either immediately or if sync, on nextTick to limit stack depth 301
9. afterWrite() decrements .pendingcb, then does finishMaybe
10. clearBuffer() initializes the next write cycle

.writing is initially false
.writing is set to true on each doWrite
.writing is set to false on each onwriteStateUpdate
.writing serializes _write invocations.

.sync is initially true
.sync is set to true prior to every _write
.sync is set to false after every _write
.sync inserts process.nextTick, so that stack depth is not excessive

.bufferProcessing is initially false
clearBuffer() sets bufferProcessing to true first and then to false at return
uncork() and onwrite() invokes clearBuffer only if bufferProcessing is false

pendingcb is never reset.
*/

/*
Events

writeStream finish
stream-writable:139:printResult [ 'one', 'two' ]
*/
testArrayWriteStream()
function testArrayWriteStream() {
	var result = []
	var writable = new ArrayWriteStream(result)
		.once('finish', printResult)
	var unwrap = wrapEmit(writable, 'writeStream')

	writable.write('one')
	writable.write('two')
	writable.end()

	function printResult() {
		require('haraldutil').p(result)
	}
}

/*
1.      stream.Writable(options) constructor
  1.1   options: optional object
  1.2   .highWaterMark: optional integer, default 16 Ki
  1.3   .objectMode: optional bollean, default false: stream is of objects, not bytes or characters
  1.4   .decodeString: optional boolean, default true
  1.5   .defaultEncoding: optional string, default 'utf8'
*/
p('stream.Writable(options) constructor', true)
p('options: optional object')
p('.highWaterMark: optional integer, default 16 Ki')
p('.objectMode: optional bollean, default false: stream is of objects, not bytes or characters')
p('.decodeString: optional boolean, default true')
p('.defaultEncoding: optional string, default \'utf8\'')

/*
2.      Writable extends Stream EventEmitter
  2.1   .domain
  2.2   pipe()
  2.3   write()
  2.4   end()
  2.5   writable: boolean
*/
p('Writable extends Stream EventEmitter', true)
p('.domain')
p('pipe()')
p('write(chunk, encoding, cb)')
p('cork(): after 0.10.11')
p('uncork(): after 0.10.11')
p('end(chunk, encoding, cb)')
p('writable: boolean')

/*
Writable object

stream-writable:142 object:Writable {
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
  domain: null,
  _events: {},
  _maxListeners: 10,
  -- prototype: Writable,
  pipe: function (),
  write: function (chunk, encoding, cb),
  _write: function (chunk, encoding, cb),
  end: function (chunk, encoding, cb),
  -- prototype: Stream,
  pipe: function (dest, options),
  -- prototype: EventEmitter,
  setMaxListeners: function (n),
  emit: function (type),
  addListener: function (type, listener),
  on: recursive-object#13,
  once: function (type, listener),
  removeListener: function (type, listener),
  removeAllListeners: function (type),
  listeners: function (type)
}
*/
//require('haraldutil').pp(new stream.Writable)

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
